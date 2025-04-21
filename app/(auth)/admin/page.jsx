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
              src="https://charts.mongodb.com/charts-project-0-rbczvsb/embed/charts?id=321d8431-ac9a-423b-9f14-11ada5b10316&maxDataAge=3600&theme=light&autoRefresh=true"
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
                src="https://charts.mongodb.com/charts-project-0-rbczvsb/embed/charts?id=8984bf0a-c52c-4531-98d6-104f6cded9c0&maxDataAge=3600&theme=light&autoRefresh=true"
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
                src="https://charts.mongodb.com/charts-project-0-rbczvsb/embed/charts?id=69962dd1-40c4-466c-bcc5-f9f1a0ccbb44&maxDataAge=3600&theme=light&autoRefresh=true"
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
