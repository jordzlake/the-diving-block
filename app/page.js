import "./home.css";
import dynamic from "next/dynamic";
import Section from "@/components/main/section/Section";
import Banner from "@/components/main/banner/Banner";
import Categories from "@/components/main/categories/Categories";
import { clothes, swimwear, kids } from "@/lib/tempclothes";
import ProductSection from "@/components/main/productSection/ProductSection";
import SubCategories from "@/components/main/subcategories/SubCategories";

export default function Home() {
  return (
    <main className="main">
      <Banner />
      <Categories />
      <Section
        title="Latest Products"
        subtitle="New Arrivals"
        linebreak
        content={clothes}
        buttonText="View Shop"
      />
      <ProductSection
        title="Products"
        subtitle="Most Popular"
        content={swimwear}
        buttonText="View Shop"
      />
      <SubCategories />
      <Section
        title="New Arrivals"
        subtitle="Swimwear"
        linebreak
        content={kids}
        buttonText="View Shop"
      />
    </main>
  );
}
