"use client";

import "./orders.css";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/controls/loading/Loading";
import { getOrders } from "@/lib/orderActions";

export const dynamic = "force-dynamic";

const Orders = () => {
  const session = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("In Progress");

  useEffect(() => {
    if (session && session.data?.user) {
      (async () => {
        try {
          const user = session.data?.user;
          const myOrders = await getOrders();
          console.log("my orders", myOrders);
          console.log("user", user);
          const newOrders = myOrders.filter((ord) => ord.meta?.id == user._id);
          setOrders(newOrders);
          setFilteredOrders(newOrders);
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [session]);

  const filterOrders = (filter) => {
    if (orders.length > 0) {
      if (filter === "All") {
        setFilteredOrders(orders);
      } else {
        const tempFiltered = orders.filter(
          (ord) => ord.status == filter || ord.paymentStatus == filter
        );
        setFilteredOrders(tempFiltered);
      }
      setFilter(filter);
    }
  };

  return (
    <main className="orders ">
      <ScrollToTop />
      <div className="my-orders-container my-orders-cont">
        <h1 className="my-orders-title">Orders</h1>
        {!loading ? (
          orders.length > 0 ? (
            <div className="my-orders-container">
              <div className="my-orders-filter-tabs">
                <div
                  className={`filter ${filter == "In Progress" && "active"}`}
                  onClick={() => filterOrders("In Progress")}
                >
                  In Progress
                </div>
                <div
                  className={`filter ${filter == "Completed" && "active"}`}
                  onClick={() => filterOrders("Completed")}
                >
                  Completed
                </div>
                <div
                  className={`filter ${filter == "Failed" && "active"}`}
                  onClick={() => filterOrders("Failed")}
                >
                  Paid
                </div>
                <div
                  className={`filter ${filter == "Success" && "active"}`}
                  onClick={() => filterOrders("Success")}
                >
                  Unpaid
                </div>
                <div
                  className={`filter ${filter == "All" && "active"}`}
                  onClick={() => filterOrders("Failed")}
                >
                  All
                </div>
              </div>
              <div className="my-orders-rows">
                {filteredOrders.map((ord, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      router.push(`/orders/${ord._id}`);
                    }}
                    className="my-order-container"
                  >
                    <div className="my-order-top-info">
                      <div className="my-order-name">
                        {ord.customerData.firstName} {ord.customerData.lastName}
                      </div>
                    </div>
                    <div className="my-order-bottom-info">
                      <div className="my-order-items-left">
                        <div className="my-order-payment-status">
                          Order Status: {ord.status}
                        </div>
                        <div className="my-order-payment-status">
                          Date:{" "}
                          {new Date(ord.createdAt).toLocaleString("en-GB", {
                            timeZone: "America/Port_of_Spain",
                          })}
                        </div>

                        <div className="my-order-payment-type">
                          Payment Status: {ord.paymentStatus}
                        </div>
                      </div>
                      <div className="my-order-items-right">
                        <div className="my-order-number">
                          {ord.orderItems.length} Items
                        </div>
                        <div className="my-order-cost">
                          ${Number(ord.total).toFixed(2)} TTD
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>You have no orders.</div>
          )
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
};

export default Orders;
