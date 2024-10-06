import "./globals.css";
import { montserrat, rubik } from "./fonts";
import Header from "@/components/main/header/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${rubik.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
