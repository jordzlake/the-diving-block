import { Order } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const dynamic = "force-dynamic";

export const GET = async (req, res) => {
  const { id } = await req.json();
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
    if (order.id) {
      const id = order.id;
      updateOrder = await order.findById(id);
      console.log("Updating Item:", updateOrder);

      if (!updateOrder) {
        return {
          errors: { general: "No order with that id exists to be updated" },
        };
      }

      const item = await Order.findByIdAndUpdate(id, {
        new: order.new,
        status: order.status,
        total: order.total,
        customerData: order.customerData,
        orderItems: order.orderItems,
        paymentMethod: order.paymentMethod,
        instructions: order.instructions,
        paymentStatus: order.paymentStatus,
        pickupLocation: order.pickupLocation,
        meta: order.meta,
      });

      if (!item)
        return {
          errors: { general: "No Item found to be Updated" },
        };

      return NextResponse.json({ success: order });
    } else {
      const newOrder = new Order({
        new: order.new,
        status: order.status,
        total: order.total,
        customerData: order.customerData,
        orderItems: order.orderItems,
        paymentMethod: order.paymentMethod,
        instructions: order.instructions,
        paymentStatus: order.paymentStatus,
        pickupLocation: order.pickupLocation,
        meta: order.meta,
      });
      console.log("order", newOrder);
      await newOrder.save();
      //return NextResponse.redirect(new URL("/", req.url));
      return NextResponse.json({ success: newOrder });
    }
  } catch (err) {
    return NextResponse.json({ error: err });
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
    return NextResponse.json({ error: err });
  }
};
