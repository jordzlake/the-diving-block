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
                background: "#FFFF",
                border: "none",
                borderRadius: "2px",
                boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
              }}
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-project-0-rdducjh/embed/charts?id=b28c9709-301e-4ad1-b542-fb456d5e1755&maxDataAge=3600&theme=light&autoRefresh=true"
            ></iframe>
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
