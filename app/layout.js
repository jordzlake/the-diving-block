import "./globals.css";
import { montserrat, rubik } from "./fonts";
import Header from "@/components/main/header/Header";
import Footer from "@/components/main/footer/Footer";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import ToastProvider from "@/components/toast/ToastProvider";

import { Suspense } from "react";
import AuthContext from "@/components/contexts/AuthContext";
import { auth } from "@/lib/auth";
import { OrderContextProvider } from "@/components/contexts/OrderContext";
config.autoAddCss = false;

export default async function RootLayout({ children }) {
  const session = await auth();
  const sessionKey = new Date().valueOf();
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${rubik.variable}`}>
        <AuthContext session={session} sessionKey={sessionKey}>
          <OrderContextProvider>
            <ToastProvider>
              <Suspense>
                <Header />
              </Suspense>
              {children}
              <Suspense>
                <Footer />
              </Suspense>
            </ToastProvider>
          </OrderContextProvider>
        </AuthContext>
      </body>
    </html>
  );
}
