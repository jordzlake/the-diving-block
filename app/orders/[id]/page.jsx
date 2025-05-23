"use client";

import { useParams, useSearchParams } from "next/navigation";
import "./order.css";
import { Loading } from "@/components/controls/loading/Loading";
import { getOrder, updateOrder } from "@/lib/orderActions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

const Order = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("id", id);
    console.log("order", order);
    console.log(
      "order oi length",

      order?.orderItems?.length > 0
    );
    console.log(
      "order cd length",

      order && order?.customerData > 0
    );

    if (id) {
      setLoading(true);
      const status = searchParams.get("status")
        ? searchParams.get("status")
        : "";
      const transaction_id = searchParams.get("transaction_id")
        ? searchParams.get("transaction_id")
        : "";
      let paymentStatus = "Error";
      if (status == "failed") {
        paymentStatus = "Failed";
      }
      if (status == "success") {
        paymentStatus = "Success";
      }
      (async () => {
        try {
          let orderFound = await getOrder(id);

          console.log("order", orderFound);
          if (orderFound.paymentStatus == "Pending") {
            if (status != "" && transaction_id != "") {
              let newOrder = await updateOrder({
                ...orderFound,
                paymentStatus: paymentStatus,
                updateInventory: true,
                updatePurchase: true,
                new: false,
              });
              console.log("newOrder", newOrder);
              clearItems();
              setOrder(newOrder);
            } else {
              setOrder(orderFound);
            }
          } else {
            setOrder(orderFound);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [searchParams, id]);

  return (
    <main>
      <section className="container">
        {!loading ? (
          order ? (
            <>
              <div className="cart-container">
                <div className="cart-wrapper">
                  <div className="cart-title">Order Information</div>
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th className="table-title">Name</th>
                        <th className="table-title">Size</th>
                        <th className="table-title">Color</th>
                        <th className="table-title">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems &&
                        order.orderItems.length > 0 &&
                        order.orderItems.map((oi, i) => (
                          <tr key={i}>
                            <td className="table-name">
                              <div
                                className="table-image"
                                onClick={() => {
                                  router.push(`/shop/${oi.item._id}`);
                                }}
                              >
                                <CldImage
                                  src={oi.item.image}
                                  fill
                                  alt="product image"
                                  defaultImage="404_lztxti.png"
                                />
                                <span className="product-quantity">
                                  {oi.amount}
                                </span>
                              </div>
                              {oi.item.name}
                            </td>
                            <td>
                              <span>{oi.size && oi.size}</span>
                            </td>
                            <td>
                              <span>{oi.color && oi.color}</span>
                            </td>

                            <td>
                              $
                              {`${Number(oi.cartItemCost).toFixed(2)} x ${
                                oi.amount
                              } = $${Number(oi.orderItemTotal).toFixed(
                                2
                              )}`}{" "}
                              TTD
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="">Shipping:</td>
                        <td className="">{order.pickupLocation}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="table-cost final">Total:</td>
                        <td className="table-cost final">
                          ${order.total}
                          TTD
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="checkout-container">
                <div>
                  <h2 className="checkout-title">Details</h2>
                </div>
                <table className="cart-table personal">
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Email:</td>
                      <td>{order?.customerData?.email}</td>
                    </tr>
                    <tr>
                      <td>First Name:</td>
                      <td>{order?.customerData?.firstName}</td>
                    </tr>
                    <tr>
                      <td>Last Name:</td>
                      <td>{order?.customerData?.lastName}</td>
                    </tr>
                    <tr>
                      <td>Street:</td>
                      <td>{order?.customerData?.street}</td>
                    </tr>
                    <tr>
                      <td>City:</td>
                      <td>{order?.customerData?.city}</td>
                    </tr>
                    <tr>
                      <td>Phone:</td>
                      <td>{order?.customerData?.phone}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="">Order Status:</td>
                      <td className="">
                        <span
                          className={`order-status-text ${
                            order.status === "In Progress"
                              ? "processing"
                              : order.status == "Cancelled"
                              ? "cancelled"
                              : "delivered"
                          }`}
                        >
                          {order.status === "In Progress"
                            ? "Processing"
                            : order.status === "Cancelled"
                            ? "Order Cancelled"
                            : "Delivered"}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <div className="cart-fallback-container">
              <div className="cart-fallback">
                <div className="cart-title">Order does not exist</div>
                <div>Click here to place an order:</div>
                <Link href="/shop">Shop</Link>
              </div>
            </div>
          )
        ) : (
          <>
            <Loading />
          </>
        )}
      </section>
    </main>
  );
};

export default Order;
