import WooCommerce from "@/lib/woocommerce-settings";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    try {
      const products = await new Promise((resolve, reject) => {
        WooCommerce.get("products?per_page=20&page=3", (err, res) => {
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
      return NextResponse.json(products);
    } catch (err) {
      return NextResponse.json(err);
    }
  } catch (err) {
    throw new Error(err);
  }
};
