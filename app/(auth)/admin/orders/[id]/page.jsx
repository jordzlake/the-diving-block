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

  return <main className="admin-section orders-page"></main>;
};

export default AdminOrder;
