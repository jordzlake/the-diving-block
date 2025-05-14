import { Order, Product } from "@/lib/models";
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
  const updateInventory = order.updateInventory ?? false;
  const updatePurchase = order.updatePurchase ?? false;

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

    console.log("update inventory?", updateInventory);
    // 2. Update Product Inventory (if updateInventory is true)
    if (updateInventory) {
      // Use a loop that handles async operations correctly
      for (const orderItem of order.orderItems) {
        try {
          //  product should have at least _id, color, size, and amount.
          const { productId, color, size, amount } = orderItem;

          const productToUpdate = await Product.findById(productId);
          if (!productToUpdate) {
            console.warn(
              `Product with ID ${productId} not found. Skipping inventory update.`
            );
            continue; // Go to the next item in the loop
          }

          if (
            productToUpdate.inventory &&
            productToUpdate.inventory.length > 0
          ) {
            // Find the specific inventory item to update
            const inventoryItem = productToUpdate.inventory.find(
              (item) => item.color === color && item.size === size
            );

            if (inventoryItem) {
              //check if there is enough quantity
              if (inventoryItem.amount < amount) {
                console.log("Not enough quantity in stock");
              }
              inventoryItem.amount -= amount; // Reduce the quantity
            } else {
              console.log(
                `Inventory item with color ${color} and size ${size} not found for product ${productId}. Skipping.`
              );
              continue;
            }
          } else {
            // If product.inventory doesn't exist, reduce product.quantity
            if (productToUpdate.quantity < amount) {
              console.log("Not enough quantity in stock");
            }
            productToUpdate.quantity -= amount;
          }

          // Save the updated product
          await productToUpdate.save();
          console.log(
            `Inventory updated for product ${productId}, color ${color}, size ${size}, amount reduced by ${amount}`
          );
        } catch (error) {
          console.error("Error updating inventory:", error);
        }
      }
    }

    if (updatePurchase) {
      for (const orderItem of order.orderItems) {
        try {
          //  product should have at least _id, color, size, and amount.
          const { productId, amount } = orderItem;

          const productToUpdate = await Product.findById(productId);
          if (!productToUpdate) {
            console.warn(
              `Product with ID ${productId} not found. Skipping inventory update.`
            );
            continue; // Go to the next item in the loop
          }
          let purchases = 0;
          console.log("purchases", productToUpdate.purchases);
          if (productToUpdate.purchases) {
            purchases = Number(productToUpdate.purchases) + Number(amount);
          } else {
            purchases = 1;
          }
          productToUpdate.purchases = purchases;
          // Save the updated product
          await productToUpdate.save();
          console.log(
            `Inventory updated for product ${productId}, color ${color}, size ${size}, amount reduced by ${amount}`
          );
        } catch (error) {
          console.error("Error updating inventory:", error);
        }
      }
    }

    return NextResponse.json(item);
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
