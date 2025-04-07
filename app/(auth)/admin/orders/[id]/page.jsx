"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import "./order.css";
import { getOrder } from "@/lib/orderActions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateOrder } from "@/lib/orderActions";
import { Loading } from "@/components/controls/loading/Loading";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import "../../admin.css";

export const dynamic = "force-dynamic";

const AdminOrder = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(35);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const order = await getOrder(id);
          setStatus(order.status);
          setPaymentStatus(order.paymentStatus);
          console.log(order);
          setOrder(order);
          setLoading(false);
        } catch (err) {
          throw err;
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setPending(true);
    const data = { id: order._id, status, paymentStatus };
    const res = await updateOrder(data);
    setPending(false);
    if (res.success) {
      toast.success("Order was updated successfully");
      router.push("/admin/orders");
    }
    if (res.error) {
      toast.error("Error: " + res.error);
    }
  };

  return (
    <main className="admin-section orders-page">
      <ScrollToTop />
      <AdminNavbar />
      <div className="orders-container">
        {!loading ? (
          order ? (
            <div className="orders-wrapper">
              <h1 className="orders-title">
                Order: {order.customerData.recipient}
              </h1>
              <div className="orders-table-container">
                <table className="orders-summary-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Item</th>
                      <th>Item Details</th>
                      <th>Amount</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((oi, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{oi.item.title}</td>
                        <td className="details">
                          {oi.category.toLowerCase() == "ice cream" && (
                            <>
                              {oi.mixIn.length > 0 ? (
                                <>
                                  Mix Ins:
                                  {oi.mixIn.map((m, i) => (
                                    <li key={i}>
                                      {m.title}
                                      {i != oi.mixIn.length - 1 && ", "}
                                    </li>
                                  ))}
                                  {oi.mixIn.length == 2
                                    ? " (2) = $6.00"
                                    : oi.mixIn.length == 3
                                    ? " (3) = $12.00"
                                    : `(${oi.mixIn.length}) = Free`}
                                </>
                              ) : (
                                "Mix ins: None"
                              )}
                              <br />

                              {oi.topping
                                ? `Topping: ${oi.topping.title}`
                                : "Topping: None"}
                              <br />

                              {oi.containerChoices.map((container, i) => (
                                <span key={i}>
                                  {container.title}:
                                  <span>${container.cost.toFixed(2)}</span> x
                                  <span>{container.amount}</span> =
                                  <span>
                                    $
                                    {(
                                      container.cost * container.amount
                                    ).toFixed(2)}{" "}
                                    TTD
                                  </span>
                                  <br />
                                </span>
                              ))}

                              {oi.coneChoices &&
                                oi.coneChoices.map((container, i) => (
                                  <span key={i}>
                                    {container.title}:
                                    <span>${container.cost.toFixed(2)}</span> x
                                    <span>{container.amount}</span> =
                                    <span>
                                      $
                                      {(
                                        container.cost * container.amount
                                      ).toFixed(2)}{" "}
                                      TTD
                                    </span>
                                    <br />
                                  </span>
                                ))}
                            </>
                          )}
                        </td>
                        <td>{oi.amount}</td>
                        <td>${Number(oi.orderItemtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Delivery Fee</th>
                      {order.paymentType == "free" ? (
                        <td>$0.00</td>
                      ) : !order.area.includes("Pickup") ? (
                        <td>${deliveryFee}.00</td>
                      ) : (
                        <td>N/A</td>
                      )}
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <th>Total</th>
                      <td>${Number(order.total).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="order-bottom-container">
                <div className="orders-additional-info">
                  <div className="orders-customer-info">
                    <h2 className="orders-subtitle">Customer Info</h2>
                    <p className="orders-data">
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleString("en-GB", {
                        timeZone: "America/Port_of_Spain",
                      })}
                    </p>
                    <p className="orders-data">
                      Recipient: {order.customerData.recipient}
                    </p>
                    <p className="orders-data">
                      Email: {order.customerData.email}
                    </p>
                    {order.area && order.area != "pickup" && (
                      <p className="orders-data">
                        Address: {order.customerData.address}
                      </p>
                    )}
                    <p className="orders-data">
                      {order.area && order.area == "pickup"
                        ? `Order to be Picked Up at #1 Arima, Street, Building`
                        : `Area: ${order.area}`}
                    </p>

                    <p className="orders-data">
                      Phone: {order.customerData.phone}
                    </p>
                    <p className="orders-data">
                      Instructions: {order.instructions}
                    </p>
                  </div>
                  <div className="orders-payment-info">
                    <h2 className="orders-subtitle">Delivery Info</h2>
                    <p className="orders-data">
                      Payment Type: {order.paymentType}
                    </p>
                    <p className="orders-data">
                      Payment Type: {order.paymentStatus}
                    </p>
                    <p className="orders-data">
                      Status:{" "}
                      <span
                        className={`orders-status ${
                          order.status === "In Progress" && "orders-progress"
                        } ${order.status === "Completed" && "orders-completed"}
                    ${order.status === "Cancelled" && "orders-cancelled"}`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="orders-controls">
                  <h2 className="orders-subtitle">Admin Controls</h2>

                  <div className="order-status-control">
                    <label>Order Status:</label>
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
                  <div className="order-status-control">
                    <label>Order Payment Status:</label>
                    <div className="controls">
                      <div
                        className={`control ${
                          paymentStatus == "Unpaid" && "inprogress"
                        }`}
                        onClick={() => setPaymentStatus("Unpaid")}
                      >
                        Unpaid
                      </div>
                      <div
                        className={`control ${
                          paymentStatus == "Paid" && "completed"
                        }`}
                        onClick={() => setPaymentStatus("Paid")}
                      >
                        Paid
                      </div>
                    </div>
                  </div>
                  <div className="order-submit-container">
                    <button
                      onClick={handleSubmit}
                      className="order-submit-button"
                    >
                      {pending ? "...Please Wait" : "Update Status"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="orders-data">No order found.</p>
          )
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
};

export default AdminOrder;
