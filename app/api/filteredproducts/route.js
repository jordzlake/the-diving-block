import { Product } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settingActions"; // Assuming this path is correct for your getSettings function

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const { data } = await req.json();
  // Fetch global settings, including sales and category sales information
  const returnedSettings = await getSettings();
  const settings = returnedSettings[0] || [];

  try {
    const {
      filter,
      order = "asc",
      page = 1,
      limit = 8,
      size,
      color,
      category,
    } = data;

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Log received filter parameters for debugging
    console.log("Received Filter:", filter);
    console.log("Received Order:", order);
    console.log("Received Page:", page);
    console.log("Received Size:", size);
    console.log("Received Color:", color);
    console.log("Received Category:", category);

    // Initialize a Mongoose query builder for the Product model
    const query = Product.find();

    // --- Start of Sales/Category Sales Logic ---
    // If the filter explicitly requests "sales", apply sales-specific conditions
    if (filter === "sale") {
      const combinedSaleFilterConditions = [];
      const productIdsInSales = new Set(); // Use a Set to store unique product IDs for direct sales
      // 1. Process 'sales' array from settings (direct product sales)
      if (settings && settings.sales && Array.isArray(settings.sales)) {
        settings.sales.forEach((sale) => {
          // Check if the sale is enabled and has items
          if (sale.enabled && sale.items && Array.isArray(sale.items)) {
            sale.items.forEach((item) => {
              // Assuming 'item' in 'sale.items' has an '_id' field which is the product ID
              if (item._id) {
                productIdsInSales.add(item._id); // Convert to string for consistency
              }
            });
          }
        });
      }

      console.log(
        "Product IDs in Direct Sales:",
        Array.from(productIdsInSales)
      );

      // Add condition for direct product sales if any IDs were collected
      if (productIdsInSales.size > 0) {
        combinedSaleFilterConditions.push({
          _id: { $in: Array.from(productIdsInSales) },
        });
      }

      // 2. Process 'categorysales' array from settings
      const categorySaleConditions = [];
      if (
        settings &&
        settings.categorysales &&
        Array.isArray(settings.categorysales)
      ) {
        settings.categorysales.forEach((csale) => {
          // Check if the category sale is enabled and has a category defined
          if (csale.enabled && csale.category) {
            let categoryMatchConditionsForThisSale = [];

            // Condition for matching main product category and subCategory
            let mainProductCategoryCondition = { category: csale.category };
            if (
              csale.subCategories &&
              Array.isArray(csale.subCategories) &&
              csale.subCategories.length > 0
            ) {
              // If specific subCategories are defined, include them in the main category match
              mainProductCategoryCondition.subCategory = {
                $in: csale.subCategories,
              };
            }
            categoryMatchConditionsForThisSale.push(
              mainProductCategoryCondition
            );

            // Condition for matching additionalCategories
            if (
              csale.subCategories &&
              Array.isArray(csale.subCategories) &&
              csale.subCategories.length > 0
            ) {
              // If specific subCategories are defined, use $elemMatch for precise matching in additionalCategories array
              categoryMatchConditionsForThisSale.push({
                additionalCategories: {
                  $elemMatch: {
                    category: csale.category,
                    subCategory: { $in: csale.subCategories },
                  },
                },
              });
            } else {
              // If no specific subCategories, just match the category in additionalCategories
              categoryMatchConditionsForThisSale.push({
                "additionalCategories.category": csale.category,
              });
            }
            // Combine the main product category and additional category conditions with $or
            categorySaleConditions.push({
              $or: categoryMatchConditionsForThisSale,
            });
          }
        });
      }

      // Add condition for category sales if any were collected
      if (categorySaleConditions.length > 0) {
        combinedSaleFilterConditions.push({ $or: categorySaleConditions });
      }

      // Apply the combined sale conditions to the query
      if (combinedSaleFilterConditions.length > 0) {
        query.and([{ $or: combinedSaleFilterConditions }]);
      }
      // MODIFICATION: Removed the else block that returned no products if no sale conditions were found.
      // Now, if no sale conditions are found, the query proceeds without sale-specific restrictions,
      // allowing other filters (size, color, category) to still apply to the broader product set.
    } else {
      // --- Original Text Search Filter Logic (only applied if 'filter' is NOT "sales") ---
      if (filter) {
        // Use $or to search across multiple text fields (title, description, category, brand, tags)
        // Includes searching within 'additionalCategories.category' for general text filter
        query.or([
          { title: { $regex: filter, $options: "i" } },
          { description: { $regex: filter, $options: "i" } },
          { category: { $regex: filter, $options: "i" } },
          { brand: { $regex: filter, $options: "i" } },
          { tags: { $regex: filter, $options: "i" } },
          {
            "additionalCategories.category": { $regex: filter, $options: "i" },
          },
        ]);
      }
    }
    // --- End of Sales/Category Sales Logic ---

    // --- Apply other filters (size, color, category) ---
    // These filters will further refine the results, whether they are sale items or general search results.

    // Apply size filter if 'size' parameter is provided and has values
    if (size && size.length > 0) {
      query.where("sizes").in(Array.isArray(size) ? size : [size]);
    }

    // Apply color filter if 'color' parameter is provided
    if (color) {
      query.where("colors.name").equals(color);
    }

    // Apply category filter if 'category' parameter is provided
    if (category) {
      // Search for the category in either the main 'category' field or within 'additionalCategories'
      query.or([
        { category: category },
        { "additionalCategories.category": category },
      ]);
    }

    // Log the constructed query object's filter for debugging purposes
    console.log("Fluent Query Object (before execution):", query.getFilter());

    // Establish connection to the database
    connectToDb();

    // Execute the Mongoose query:
    // 1. Sort by createdAt field (descending for 'asc' order based on user's 'order' param)
    //    Note: -1 for descending (newest first), 1 for ascending (oldest first)
    // 2. Skip documents for pagination
    // 3. Limit the number of documents returned per page
    const products = await query
      .sort({ createdAt: order === "asc" ? -1 : 1 }) // Assuming 'asc' means latest first by convention
      .skip(skip)
      .limit(limit);

    // Get the total count of documents that match the current filter criteria
    // This is used for pagination metadata (e.g., total pages)
    const total = await Product.countDocuments(query.getFilter());

    // Log the results for debugging
    //console.log("Found Products:", products);
    //console.log("Total Matching Products:", total);

    // Return the found products and the total count as a JSON response
    return NextResponse.json({ products, total });
  } catch (err) {
    // Catch any errors during the process and log them
    console.error("Error filtering products:", err);
    // Return an error response with a 500 status code
    return NextResponse.json(
      { error: "Failed to filter products." },
      { status: 500 }
    );
  }
};
