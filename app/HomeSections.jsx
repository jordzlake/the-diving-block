"use client";

import Section from "@/components/main/section/Section";
import Categories from "@/components/main/categories/Categories";
import ProductSection from "@/components/main/productSection/ProductSection";
import SubCategories from "@/components/main/subcategories/SubCategories";
import { getProductsParameters } from "@/lib/productActions";
import { useEffect, useState } from "react";

export default function HomeSections() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [altFilteredProducts, setAltFilteredProducts] = useState([]);
  const [popularFilteredProducts, setPopularFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res1 = await getProductsParameters({ order: "desc", limit: 12 });
        const res2 = await getProductsParameters({
          order: "asc",
          limit: 6,
          purchases: true,
        });
        const res3 = await getProductsParameters({
          order: "asc",
          limit: 12,
          category: "Swim Wear",
        });
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
    <>
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
    </>
  );
}
