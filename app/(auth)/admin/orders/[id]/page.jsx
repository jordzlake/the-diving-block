"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import "./order.css";
import "../../admin.css";
import { Loading } from "@/components/controls/loading/Loading";
import { getOrder, updateOrder } from "@/lib/orderActions";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";

const AdminOrder = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (!order) {
      (async () => {
        try {
          setLoading(true);
          let order = await getOrder(id);

          console.log("order", order);
          setStatus(order.status);
          setPaymentStatus(order.paymentStatus);
          setOrder(order);

          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [searchParams, id, order]);

  const handleSubmit = async () => {
    setPending(true);
    const data = {
      ...order,
      status: status,
      paymentStatus: paymentStatus,
    };

    const res = await updateOrder(data);
    setPending(false);
    if (res.error) {
      toast.error("Error: " + res.error);
    } else {
      toast.success("Order was updated successfully");
      router.push("/admin/orders");
    }
  };

  return (
    <main className="admin-section">
      <AdminNavbar />
      <section className="admin-container container">
        {!loading ? (
          <>
            {order &&
            order.orderItems?.length > 0 &&
            Object.keys(order.customerData)?.length > 0 ? (
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
                                    defaultImage="404_toij8l.png"
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
                                {`${Number(oi.item.cost).toFixed(2)} x ${
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
                    <thead></thead>
                    <tbody>
                      <tr>
                        <td>Email:</td>
                        <td>{order.customerData.email}</td>
                      </tr>
                      <tr>
                        <td>First Name:</td>
                        <td>{order.customerData.firstName}</td>
                      </tr>
                      <tr>
                        <td>Last Name:</td>
                        <td>{order.customerData.lastName}</td>
                      </tr>
                      <tr>
                        <td>Street:</td>
                        <td>{order.customerData.street}</td>
                      </tr>
                      <tr>
                        <td>City:</td>
                        <td>{order.customerData.city}</td>
                      </tr>
                      <tr>
                        <td>Phone:</td>
                        <td>{order.customerData.phone}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="">Order Status:</td>
                        <td className="">
                          {order.status === "In Progress"
                            ? "Processing"
                            : order.status === "Cancelled"
                            ? "Cancelled"
                            : "Delivered"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="orders-controls">
                  <h2 className="orders-subtitle">Admin Controls</h2>
                  <div className="order-status-control">
                    <label>Order Payment Status:</label>
                    <div className="controls">
                      <div
                        className={`status-control ${
                          paymentStatus == "Failed" && "failed"
                        }`}
                      >
                        Failed
                      </div>
                      <div
                        className={`status-control ${
                          paymentStatus == "Success" && "success"
                        }`}
                      >
                        Success
                      </div>
                    </div>
                  </div>
                  <div className="order-status-control">
                    <label>Order Preparation Status:</label>
                    <div className="controls">
                      <div
                        className={`control ${
                          status == "In Progress" && "inprogress"
                        }`}
                        onClick={() => setStatus("In Progress")}
                      >
                        In Progress
                      </div>
                      <div
                        className={`control ${
                          status == "Completed" && "completed"
                        }`}
                        onClick={() => setStatus("Completed")}
                      >
                        Completed
                      </div>
                    </div>
                  </div>

                  <div className="order-submit-container">
                    <button
                      onClick={handleSubmit}
                      className="order-submit-button"
                    >
                      {pending ? "...Please Wait" : "Update Preparation Status"}
                    </button>
                  </div>
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
            )}
          </>
        ) : (
          <>
            <Loading />
          </>
        )}
      </section>
    </main>
  );
};

export default AdminOrder;
