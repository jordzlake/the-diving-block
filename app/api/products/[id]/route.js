import { Product } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { deleteCloudinaryItems } from "@/lib/cloudinary";
import { productSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const GET = async (req, { params }) => {
  const { id } = await params;

  try {
    connectToDb();
    const product = await Product.findById(id);
    return NextResponse.json(product);
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

    const existingProduct = await Product.findById(product._id);
    if (!existingProduct) {
      return NextResponse.json({
        errors: ["No item with that ID exists to be updated"],
      });
    }

    const validationResult = productSchema.safeParse(product);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) =>
          `${issue.path}: 
          ${issue.message}`
      );
      return NextResponse.json({ errors });
    }

    const updatedProduct = await Product.findByIdAndUpdate(product._id, {
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
    });

    return NextResponse.json({ success: updatedProduct });
  } catch (err) {
    return NextResponse.json({ error: [err.message] });
  }
};

export const DELETE = async (req, res) => {
  try {
    const { id, images } = await req.json();
    connectToDb();
    const deleteResult = await deleteCloudinaryItems(images);
    console.log("del images", deleteResult);
    const item = await Product.findByIdAndDelete(id);

    if (!item) {
      throw "Item not found.";
    }

    return NextResponse.json({
      deleted: `Item ${item._id} successfully deleted.`,
    });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
