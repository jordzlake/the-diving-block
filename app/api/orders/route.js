import { Order } from "@/lib/models";
import { connectToDb } from "@/lib/db";
import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    connectToDb();
    const orders = await Order.find();
    return NextResponse.json(orders);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: [err] });
  }
};

export const POST = async (req, res) => {
  const { data } = await req.json();
  const orderItems = data.orderItems;
  const customerData = data.customerData;
  const total = Number(data.total);
  const userId = data.userId;
  const pickupLocation = data.pickupLocation;
  let paymentStatus = "";
  if (data.paymentStatus) {
    paymentStatus = data.paymentStatus;
  }

  try {
    connectToDb();
    const newOrder = new Order({
      total,
      customerData,
      orderItems,
      pickupLocation,
      paymentStatus: paymentStatus ? paymentStatus : undefined,
      meta: userId ? { id: userId } : undefined,
    });
    //return NextResponse.json({ success: newOrder });
    const obj = await newOrder.save();
    const oid = obj._id.toString();
    const responseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${oid}`;
    console.log(responseUrl);
    console.log("");

    if (total === 0) {
      redirect(`/orders/${oid}`);
    } else if (paymentStatus === "Bank Transfer") {
      let newResponseUrl = `/orders/${oid}`;
      return NextResponse.json({
        success: true,
        data: { url: newResponseUrl },
      });
    } else {
      const data = {
        account_number: "5203609482",
        avs: "1",
        zipcode: "000000",
        country_code: "TT",
        currency: "TTD",
        environment:
          process.env.NEXT_PUBLIC_ENV == "development" ? "sandbox" : "live", //sandbox for dev, live for production
        fee_structure: "customer_pay",
        method: "credit_card",
        order_id: oid.slice(0, 6),
        origin: "TheDivingBlock",
        response_url: responseUrl,
        total: String(total) + ".00",
      };
      console.log("data:", data);
      const response = await axios.post(
        "https://tt.wipayfinancial.com/plugins/payments/request",
        data,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer e2ng2gbow4vdtb",
            "Content-Type": "application/json",
          },
        }
      );

      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email`, {
        method: "POST",
        body: JSON.stringify({
          firstName: customerData.firstName,
          email: customerData.email,
          orderID: oid,
        }),
      });

      return NextResponse.json({ success: true, data: response.data });
    }
  } catch (err) {
    console.log(JSON.stringify(err));

    return NextResponse.json({ errors: [err.message] });
  }
};
