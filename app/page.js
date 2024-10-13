import "./home.css";
import dynamic from "next/dynamic";
import Section from "@/components/main/section/Section";
import Banner from "@/components/main/banner/Banner";
import Categories from "@/components/main/categories/Categories";
import { clothes } from "@/lib/tempclothes";

export default function Home() {
  return (
    <div>
      <main className="main">
        <Banner />
        <Categories />
        <Section title="Latest Products" subtitle="New Arrivals" linebreak content={clothes}/>
      </main>
    </div>
  );
}
