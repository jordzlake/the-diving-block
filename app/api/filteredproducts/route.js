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

    console.log("size", size);
    const skip = (page - 1) * limit;

    console.log("Received Filter:", filter);
    console.log("Received Order:", order);
    console.log("Received Page:", page);
    console.log("Received Size:", size);
    console.log("Received Color:", color);
    console.log("Received Category:", category);

    const query = Product.find();

    if (filter) {
      query.or([
        { title: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
        { category: { $regex: filter, $options: "i" } },
        { brand: { $regex: filter, $options: "i" } },
        { tags: { $regex: filter, $options: "i" } },
      ]);
    }

    if (size && size.length > 0) {
      query.where("sizes").in(Array.isArray(size) ? size : [size]);
    }

    if (color) {
      query.where("colors.name").equals(color);
    }

    if (category) {
      query.where("category").equals(category);
    }

    console.log("Fluent Query Object:", query.getFilter());

    connectToDb();
    const products = await query
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query.getFilter());

    console.log("Found Products:", products);
    console.log("Total Matching Products:", total);

    return NextResponse.json({ products, total });
  } catch (err) {
    console.error("Error filtering products:", err);
    return NextResponse.json(
      { error: "Failed to filter products." },
      { status: 500 }
    );
  }
};
