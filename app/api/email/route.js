import { NextResponse, NextRequest } from "next/server";
const nodemailer = require("nodemailer");

// Handles POST requests to /api
export const dynamic = "force-dynamic";

export const POST = async (req) => {
  const username = process.env.NEXT_PUBLIC_EMAIL;
  const password = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: username,
      pass: password,
    },
  });

  try {
    const { firstName, email, orderID } = await req.json();
    console.log(firstName, email, orderID);
    const mail = await transporter.sendMail({
      from: "Diving Block Website",
      to: email,
      replyTo: email,
      subject: `Your order has been received!`,
      html: `
            <p>Hey</p>
            <br/>
            <br/>
            <p>Thank you for shopping at TheDivingBlock. Your order for ${firstName} is currently being processed you can track it using the link below:</p>
            <br/>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders?o=${orderID}">Click Here To Track Order!</a>
            <br/>
            <br/>
            <p>Have a nice day!</p>
            <br/>
            <br/>
            <p>Regards,</p>
            <p>The Diving Block</p>
            `,
    });

    const mailAlert = await transporter.sendMail({
      from: username,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      replyTo: email,
      subject: `Order Notification For ${firstName}`,
      html: `
            <p>Hey,</p>
            <br/>
            <br/>
            <p>An order was placed. Click the link below to process it:</p>
            <br/>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/order?o=${orderID}">Click Here To Process Order.</a>
           
            <br/>
            <br/>
            <p>Regards,</p>
            <p>The Diving Block Website</p>
            `,
    });

    return NextResponse.json({ message: "Success: email was sent" });
  } catch (err) {
    console.log(err);
    return NextResponse.status(500).json({
      errors: ["Email could not be sent"],
    });
  }
};
