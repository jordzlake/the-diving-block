import WooCommerce from "@/lib/woocommerce-settings";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    try {
      const { id } = params;
      const product = await new Promise((resolve, reject) => {
        WooCommerce.get(`products/${id}`, (err, res) => {
          if (err) {
            return reject(err);
          }
          try {
            const parsedData = JSON.parse(res.body); // Parse the JSON string to an object
            resolve(parsedData);
          } catch (parseError) {
            reject("Failed to parse response data.");
          }
        });
      });
      return NextResponse.json(product);
    } catch (err) {
      return NextResponse.json(err);
    }
  } catch (err) {
    throw new Error(err);
  }
};
