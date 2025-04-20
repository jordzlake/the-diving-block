import { Order } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const dynamic = "force-dynamic";

export const GET = async (req, { params }) => {
  const { id } = await params;
  console.log(id);
  try {
    connectToDb();
    const order = await Order.findById(id);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};

export const POST = async (req, res) => {
  const { order } = await req.json();

  try {
    connectToDb();

    const id = order._id;
    const updateOrder = await Order.findById(id);

    if (!updateOrder) {
      return NextResponse.json({
        errors: ["No order with that id exists to be updated"],
      });
    }

    const item = await Order.findByIdAndUpdate(id, {
      new: order.new,
      status: order.status,
      total: order.total,
      customerData: order.customerData,
      orderItems: order.orderItems,
      paymentStatus: order.paymentStatus,
      pickupLocation: order.pickupLocation,
      meta: order.meta,
    });
    if (!item)
      NextResponse.json({
        errors: ["No Item found to be Updated"],
      });

    console.log("item:", item);
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ errors: [err] });
  }
};

export const DELETE = async (req, res) => {
  try {
    const { id } = await req.json();
    connectToDb();
    const item = await Order.findByIdAndDelete(id);

    if (!item) {
      throw "Order not found.";
    }

    return NextResponse.json({
      deleted: `Order ${item._id} successfully deleted.`,
    });
  } catch (err) {
    return NextResponse.json({ errors: [err] });
  }
};
