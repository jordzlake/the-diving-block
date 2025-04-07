import { Order } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    connectToDb();
    const orders = await Order.find();
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
