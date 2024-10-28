import WooCommerceAPI from "woocommerce-api";

const consumerKey = process.env.WOO_CONSUMER_KEY;
const consumerSecret = process.env.WOO_CONSUMER_SECRET;
const URL = process.env.WOO_URL;

const WooCommerce = new WooCommerceAPI({
  url: URL,
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  wpAPI: true,
  version: "wc/v3",
});

export default WooCommerce;
