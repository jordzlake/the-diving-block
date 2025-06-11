import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Product } from "@/lib/models";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const orderParam = searchParams.get("order");
  const limitParam = searchParams.get("limit");
  const tagsParam = searchParams.get("tags");
  const purchasesParam = searchParams.get("purchases");
  const categoryParam = searchParams.get("category");

  const order = orderParam === "desc" ? -1 : 1; // Default to ascending for createdAt
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const tags = tagsParam
    ? tagsParam
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    : [];
  const sortByPurchases = purchasesParam === "true";
  const purchaseOrder = sortByPurchases ? -1 : order; // Default to descending for purchases

  try {
    await connectToDb();

    const query = {};

    if (categoryParam) {
      query.category = categoryParam; // Assuming product.category is a string matching catagoryParam
    }

    if (tags.length > 0) {
      query.tags = { $in: tags.map((tag) => new RegExp(tag, "i")) };
    }

    const sortOptions = {};

    if (sortByPurchases) {
      sortOptions.purchases = purchaseOrder;
    } else if (orderParam) {
      sortOptions.createdAt = order;
    }

    let productsQuery = Product.find(query).sort(sortOptions);

    if (limit) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery.exec();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from the database" },
      { status: 500 }
    );
  }
};
