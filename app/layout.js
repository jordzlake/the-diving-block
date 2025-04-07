import "./globals.css";
import { montserrat, rubik } from "./fonts";
import { CartProvider } from "@/components/controls/Contexts/CartProvider";
import Header from "@/components/main/header/Header";
import Footer from "@/components/main/footer/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ToastProvider from "@/components/toast/ToastProvider";
config.autoAddCss = false;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${rubik.variable}`}>
        <CartProvider>
          <Header />
          <ToastProvider>{children}</ToastProvider>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
