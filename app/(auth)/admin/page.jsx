"use client";

import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import "./admin.css";

export const dynamic = "force-dynamic";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RevenueByDayChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Build a reasonable year range (3 years back → current)
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i);

  const loadChartJs = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (window.Chart) return resolve();
        const s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        s.onload = resolve;
        s.onerror = () => reject(new Error("Failed to load Chart.js"));
        document.head.appendChild(s);
      }),
    [],
  );

  // Fetch orders once
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await loadChartJs();
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [loadChartJs]);

  // Rebuild chart whenever orders, month, or year changes
  useEffect(() => {
    if (!orders || !canvasRef.current || !window.Chart) return;

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const revenue = new Array(daysInMonth).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      if (
        date.getFullYear() === selectedYear &&
        date.getMonth() === selectedMonth
      ) {
        const day = date.getDate() - 1; // 0-indexed
        revenue[day] += Number(order.total) || 0;
      }
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(250, 129, 0, 0.55)");
    gradient.addColorStop(1, "rgba(250, 129, 0, 0.05)");

    chartRef.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenue,
            backgroundColor: gradient,
            borderColor: "#fa8100",
            borderWidth: 1.5,
            borderRadius: 3,
            hoverBackgroundColor: "#eeaf6c",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `Day ${items[0].label}`,
              label: (item) =>
                ` $${item.parsed.y.toLocaleString("en-TT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} TTD`,
            },
            backgroundColor: "#000",
            titleColor: "#eeaf6c",
            bodyColor: "#fff",
            borderColor: "#fa8100",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#555",
              autoSkip: true,
              maxTicksLimit: 16,
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: {
              color: "#555",
              callback: (v) =>
                "$" +
                v.toLocaleString("en-TT", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }),
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [orders, selectedMonth, selectedYear]);

  const totalRevenue = (() => {
    if (!orders) return 0;
    return orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
        );
      })
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  })();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        boxSizing: "border-box",
        background: "#fff",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
            Total revenue
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 600,
              color: "#fa8100",
            }}
          >
            $
            {totalRevenue.toLocaleString("en-TT", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span style={{ fontSize: "13px", fontWeight: 400, color: "#aaa" }}>
              TTD
            </span>
          </p>
        </div>

        {/* Month / Year selectors */}
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #fa8100",
              color: "#000",
              fontSize: "13px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #fa8100",
              color: "#000",
              fontSize: "13px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart area */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: "14px",
            }}
          >
            Loading chart…
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c00",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Bar chart of daily revenue for ${MONTHS[selectedMonth]} ${selectedYear}`}
        />
      </div>
    </div>
  );
};

const Admin = () => {
  const router = useRouter();

  return (
    <main className="admin-section">
      <AdminNavbar />
      <div className="admin-container">
        <h1 className="admin-title">Dashboard</h1>
        <div className="admin-content">
          <div className="admin-content-g1">
            <RevenueByDayChart />
          </div>
          <div className="admin-content-bottom-graphs">
            <div className="admin-content-g2">
              <iframe
                style={{
                  background: "#FFF",
                  border: "none",
                  borderRadius: "2px",
                  boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                }}
                width="100%"
                height="100%"
                src="https://charts.mongodb.com/charts-project-0-rdducjh/embed/charts?id=3d0f46db-438d-447d-b193-8ebcc352237d&maxDataAge=3600&theme=light&autoRefresh=true"
              ></iframe>
            </div>
            <div className="admin-content-g3">
              <iframe
                style={{
                  background: "#FFF",
                  border: "none",
                  borderRadius: "2px",
                  boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                }}
                width="100%"
                height="100%"
                src="https://charts.mongodb.com/charts-project-0-rdducjh/embed/charts?id=00278bac-bf7f-4b11-95b6-3a38b1698cd3&maxDataAge=3600&theme=light&autoRefresh=true"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="admin-bottom-container">
          <button
            className="admin-button-primary"
            onClick={() => router.push("/admin/orders")}
          >
            View Orders
          </button>
        </div>
      </div>
    </main>
  );
};

export default Admin;
