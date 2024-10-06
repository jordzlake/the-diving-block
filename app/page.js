import "./home.css";
import dynamic from "next/dynamic";
import Banner from "@/components/main/banner/Banner";
import Categories from "@/components/main/categories/Categories";

export default function Home() {
  return (
    <div>
      <main className="main">
        <Banner />
        <Categories />
      </main>
    </div>
  );
}
