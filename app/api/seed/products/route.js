import { Product } from "@/lib/models";
import { products } from "@/lib/default/products";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDb();
    await Product.deleteMany({});
    const importProducts = await Product.insertMany(products);
    return NextResponse.json({ importProducts });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: `Something went wrong: ${err}` });
  }
}
