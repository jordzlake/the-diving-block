"use client";
import "./home.css";
import dynamic from "next/dynamic";
import Section from "@/components/main/section/Section";
import Banner from "@/components/main/banner/Banner";
import Categories from "@/components/main/categories/Categories";
import { clothes, swimwear, kids } from "@/lib/tempclothes";
import ProductSection from "@/components/main/productSection/ProductSection";
import SubCategories from "@/components/main/subcategories/SubCategories";
import { getProducts } from "@/lib/productActions";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        setProducts(res);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="main">
      <Banner />
      <Categories />
      <Section
        title="Latest Products"
        subtitle="New Arrivals"
        linebreak
        content={products}
        buttonText="View Shop"
      />
      <ProductSection
        title="Products"
        subtitle="Most Popular"
        content={products}
        buttonText="View Shop"
      />
      <SubCategories />
      <Section
        title="New Arrivals"
        subtitle="Swimwear"
        linebreak
        content={products}
        buttonText="View Shop"
      />
    </main>
  );
}
