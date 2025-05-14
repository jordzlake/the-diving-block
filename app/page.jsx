"use client";
import "./home.css";

import Section from "@/components/main/section/Section";
import Banner from "@/components/main/banner/Banner";
import Categories from "@/components/main/categories/Categories";
import { clothes, swimwear, kids } from "@/lib/tempclothes";
import ProductSection from "@/components/main/productSection/ProductSection";
import SubCategories from "@/components/main/subcategories/SubCategories";
import { getProducts, getProductsParameters } from "@/lib/productActions";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [altFilteredProducts, setAltFilteredProducts] = useState([]);
  const [popularFilteredProducts, setPopularFilteredProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res1 = await getProductsParameters({ order: "desc", limit: 12 });
        const res2 = await getProductsParameters({
          order: "asc",
          limit: 6,
          purchases: true,
        });
        const res3 = await getProductsParameters({ order: "asc", limit: 12 });
        setFilteredProducts(res1);
        setPopularFilteredProducts(res2);
        setAltFilteredProducts(res3);
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
        content={filteredProducts}
        buttonText="View Shop"
      />
      <div className="container">
        <ProductSection
          title="Products"
          subtitle="Most Popular"
          content={popularFilteredProducts}
          buttonText="View Shop"
        />
      </div>
      <SubCategories />
      <Section
        title="New Arrivals"
        subtitle="Swimwear"
        linebreak
        content={altFilteredProducts}
        buttonText="View Shop"
      />
    </main>
  );
}
