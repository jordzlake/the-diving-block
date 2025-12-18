import { Product } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const { data } = await req.json();

  try {
    const { searchTerm } = data;

    if (!searchTerm) {
      return NextResponse.json({ products: [], total: 0 });
    }

    console.log("Received Search Term:", searchTerm);

    connectToDb();

    // Construct the query to search by title and description
    const query = Product.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ],
    });

    // Limit the results to a maximum of ten products
    const products = await query.limit(10).exec();

    // Get the total number of products matching the search (without the limit)
    const total = await Product.countDocuments({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
      ],
    });

    console.log("Found Products:", products);
    console.log("Total Matching Products:", total);

    return NextResponse.json({ products, total });
  } catch (err) {
    console.error("Error searching products:", err);
    return NextResponse.json(
      { error: "Failed to search products." },
      { status: 500 }
    );
  }
};
