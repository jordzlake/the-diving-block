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
  return <main className="admin-section orders-page"></main>;
};

export default AdminOrder;
