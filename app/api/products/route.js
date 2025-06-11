import { Product } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { productSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    connectToDb();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const POST = async (req, res) => {
  const { product } = await req.json();
  product.cost = parseFloat(product.cost);
  product.quantity = parseFloat(product.quantity);

  try {
    await connectToDb();

    const validationResult = productSchema.safeParse(product);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) =>
          `${issue.path}: 
               ${issue.message}`
      );
      return NextResponse.json({ errors });
    }

    const newProduct = new Product({
      title: product.title,
      spec: product.spec,
      cost: product.cost,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      quantity: product.quantity,
      image: product.image,
      galleryImages: product.galleryImages,
      weight: product.weight,
      dimensions: product.dimensions,
      colors: product.colors,
      sizes: product.sizes,
      brand: product.brand,
      notes: product.notes,
      tags: product.tags,
      colorImageVariants: product.colorImageVariants || [],
      sizeCostVariants: product.sizeCostVariants || [],
      additionalCategories: product.additionalCategories || [],
    });

    await newProduct.save();
    return NextResponse.json({ success: newProduct });
  } catch (err) {
    throw err;
    return NextResponse.json({ error: [err.message] });
  }
};
