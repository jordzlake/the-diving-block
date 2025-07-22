import { Product } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const { data } = await req.json();

  try {
    const {
      filter,
      order = "asc",
      page = 1,
      limit = 8,
      size,
      color,
      subCategory, // Destructure subCategory from the request data
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
    console.log("Received SubCategory:", subCategory); // Log the received subCategory

    // Array to hold all individual conditions
    const conditions = [];

    // Apply text search filter if 'filter' parameter is provided
    if (filter) {
      // Use $or to search across multiple text fields (title, description, category, brand, tags, subCategory)
      conditions.push({
        $or: [
          { title: { $regex: filter, $options: "i" } },
          { description: { $regex: filter, $options: "i" } },
          { category: { $regex: filter, $options: "i" } },
          { subCategory: { $regex: filter, $options: "i" } }, // Search within main subCategory
          { brand: { $regex: filter, $options: "i" } },
          { tags: { $regex: filter, $options: "i" } },
        ],
      });
    }

    // Apply size filter if 'size' parameter is provided and has values
    if (size && size.length > 0) {
      conditions.push({ sizes: { $in: Array.isArray(size) ? size : [size] } });
    }

    // Apply color filter if 'color' parameter is provided
    if (color) {
      conditions.push({ "colors.name": color });
    }

    // Apply category filter if 'category' parameter is provided
    if (category) {
      conditions.push({ category: category });
    }

    // Apply subCategory filter if 'subCategory' parameter is provided and has values
    if (subCategory && subCategory.length > 0) {
      conditions.push({ subCategory: { $in: subCategory } });
    }

    // Combine all conditions using $and if there are multiple, otherwise use the single condition
    const finalFindConditions =
      conditions.length > 0 ? { $and: conditions } : {};

    // Log the constructed query object's filter for debugging purposes
    console.log(
      "Constructed findConditions:",
      JSON.stringify(finalFindConditions, null, 2)
    );

    // Establish connection to the database
    connectToDb();

    // Execute the Mongoose query:
    // 1. Find documents matching the constructed finalFindConditions
    // 2. Sort by createdAt field (descending for 'asc' order based on user's 'order' param)
    //    Note: -1 for descending (newest first), 1 for ascending (oldest first)
    // 3. Skip documents for pagination
    // 4. Limit the number of documents returned per page
    const products = await Product.find(finalFindConditions)
      .sort({ createdAt: order === "asc" ? -1 : 1 }) // Assuming 'asc' means latest first by convention
      .skip(skip)
      .limit(limit);

    // Get the total count of documents that match the current filter criteria
    // This is used for pagination metadata (e.g., total pages)
    const total = await Product.countDocuments(finalFindConditions);

    // Log the results for debugging
    console.log("Found Products:", products);
    console.log("Total Matching Products:", total);

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
