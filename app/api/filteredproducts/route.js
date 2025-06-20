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

    // Apply text search filter if 'filter' parameter is provided
    if (filter) {
      // Use $or to search across multiple text fields (title, description, category, brand, tags)
      // MODIFICATION START: Added "additionalCategories.category" to the filter criteria
      query.or([
        { title: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
        { category: { $regex: filter, $options: "i" } },
        { brand: { $regex: filter, $options: "i" } },
        { tags: { $regex: filter, $options: "i" } },
        { "additionalCategories.category": { $regex: filter, $options: "i" } }, // New: Search within additionalCategories
      ]);
      // MODIFICATION END
    }

    // Apply size filter if 'size' parameter is provided and has values
    if (size && size.length > 0) {
      // Use .in() to match products where the 'sizes' array contains any of the provided sizes
      // Ensure 'size' is treated as an array
      query.where("sizes").in(Array.isArray(size) ? size : [size]);
    }

    // Apply color filter if 'color' parameter is provided
    if (color) {
      // Match products where 'colors.name' (nested field) equals the provided color
      query.where("colors.name").equals(color);
    }

    // Apply category filter if 'category' parameter is provided
    if (category) {
      // Use $or to search for the category in either the main 'category' field
      // or within the 'category' field of objects in the 'additionalCategories' array.
      query.or([
        { category: category }, // Match main category field
        { "additionalCategories.category": category }, // Match category within additionalCategories array
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
