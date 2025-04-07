"use client";

import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import { useRouter } from "next/navigation";
import "./admin.css";

export const dynamic = "force-dynamic";

const Admin = () => {
  const router = useRouter();

  return (
    <main className="admin-section">
      <AdminNavbar />
      <div className="admin-container">
        <h1 className="admin-title">Dashboard</h1>
        <div className="admin-content">
          <div className="admin-content-g1">
            <iframe
              style={{
                background: "#21313C",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-symphonytt-oifnudk/embed/charts?id=8fb5833c-46ab-4534-87f8-283a6156bfa1&maxDataAge=3600&theme=dark&autoRefresh=true"
            ></iframe>
          </div>
          <div className="admin-content-bottom-graphs">
            <div className="admin-content-g2">
              <iframe
                style={{
                  background: "#21313C",
                  border: "none",
                  borderRadius: "2px",
                  boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                }}
                width="100%"
                height="100%"
                src="https://charts.mongodb.com/charts-symphonytt-oifnudk/embed/charts?id=efa8c83b-60d1-48ec-a627-db68618bc9c3&maxDataAge=3600&theme=dark&autoRefresh=true"
              ></iframe>
            </div>
            <div className="admin-content-g3">
              <iframe
                style={{
                  background: "#21313C",
                  border: "none",
                  borderRadius: "2px",
                  boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                }}
                width="100%"
                height="100%"
                src="https://charts.mongodb.com/charts-symphonytt-oifnudk/embed/charts?id=769aa4c5-a11d-481d-a761-1437f9b9b3a1&maxDataAge=3600&theme=dark&autoRefresh=true"
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
