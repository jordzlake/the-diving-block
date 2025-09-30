"use client";

import "./orders.css";
import "../admin.css";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";

import { getOrders } from "@/lib/orderActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/controls/loading/Loading";

export const dynamic = "force-dynamic";

const AdminOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("In Progress");

  useEffect(() => {
    (async () => {
      try {
        const adminOrders = await getOrders();
        setOrders(adminOrders);
        if (adminOrders.length > 0) {
          const tempFiltered = adminOrders.filter(
            (ord) => ord.status == filter || ord.paymentStatus == filter
          );
          setFilteredOrders(tempFiltered);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const filterOrders = (filter) => {
    if (orders.length > 0) {
      if (filter === "All") {
        setFilteredOrders(orders);
      } else if (filter === "Failed") {
        const tempFiltered = orders.filter(
          (ord) =>
            ord.status == "Failed" ||
            ord.paymentStatus == "Pending" ||
            ord.paymentStatus == "Failed"
        );
        setFilteredOrders(tempFiltered);
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
    <main className="admin-orders admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container orders-cont">
        <h1 className="admin-title orders-title">Orders</h1>
        {!loading ? (
          orders.length > 0 ? (
            <div className="admin-orders-container">
              <div className="admin-orders-filter-tabs">
                <div
                  className={`admin-filter ${
                    filter == "In Progress" && "active"
                  }`}
                  onClick={() => filterOrders("In Progress")}
                >
                  In Progress
                </div>
                <div
                  className={`admin-filter ${
                    filter == "Completed" && "active"
                  }`}
                  onClick={() => filterOrders("Completed")}
                >
                  Completed
                </div>
                <div
                  className={`admin-filter ${filter == "Success" && "active"}`}
                  onClick={() => filterOrders("Success")}
                >
                  Successful Payment
                </div>
                <div
                  className={`admin-filter ${filter == "Failed" && "active"}`}
                  onClick={() => filterOrders("Failed")}
                >
                  Failed Payment
                </div>
                <div
                  className={`admin-filter ${
                    filter == "Cancelled" && "active"
                  }`}
                  onClick={() => filterOrders("Cancelled")}
                >
                  Cancelled
                </div>
                <div
                  className={`admin-filter ${filter == "All" && "active"}`}
                  onClick={() => filterOrders("All")}
                >
                  All
                </div>
              </div>
              <div className="admin-orders-rows">
                {filteredOrders.map((ord, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      router.push(`/admin/orders/${ord._id}`);
                    }}
                    className={`admin-order-container ${
                      ord.paymentStatus === "Success" && "success-container"
                    } ${ord.paymentStatus === "Failed" && "failed-container"}
                    ${ord.paymentStatus === "Pending" && "pending-container"}
                    `}
                  >
                    <div className="admin-order-top-info">
                      <div className="admin-order-name">
                        {ord.customerData.firstName} {ord.customerData.lastName}
                      </div>
                      {ord.new && <div className="admin-order-new">NEW!</div>}
                    </div>
                    <div className="admin-order-bottom-info">
                      <div className="admin-order-items-left">
                        <div className="admin-order-payment-status">
                          Order Status: {ord.status}
                        </div>
                        <div className="admin-order-payment-status">
                          Date:{" "}
                          {new Date(ord.createdAt).toLocaleString("en-GB", {
                            timeZone: "America/Port_of_Spain",
                          })}
                        </div>
                        <div className="admin-order-payment-type">
                          Payment Status: {ord.paymentStatus}
                        </div>
                      </div>
                      <div className="admin-order-items-right">
                        <div className="admin-order-number">
                          {ord.orderItems.length} Items
                        </div>
                        <div className="admin-order-cost">
                          ${Number(ord.total).toFixed(2)} TTD
                        </div>
                        <div className="admin-order-cost">ID: {ord._id}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>There are no orders.</div>
          )
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
