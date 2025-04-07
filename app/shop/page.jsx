"use client";

import "@/app/shop/shop.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loading } from "@/components/controls/loading/Loading";
import StoreCard from "@/components/cards/store-card/Storecard";
import { Collapse } from "antd";
import { getProducts } from "@/lib/productActions";
import { FaCartShopping, FaGlobe, FaSpinner } from "react-icons/fa6";

const items = [
  {
    key: "1",
    label: "Sort By",
    children: (
      <select name="filterSortBy" id="filterSortBy">
        <option value="default">-- Select a Value --</option>
        <option value="price">Price: (low to high)</option>
        <option value="altprice">Price: (high to low)</option>
        <option value="recent">Most Recent</option>
        <option value="popularity">Popularity</option>
        <option value="random">Random</option>
        <option value="name">Name: (A to Z)</option>
        <option value="altname">Name: (Z to A)</option>
      </select>
    ),
  },
  {
    key: "2",
    label: "Price Range",
    children: (
      <select name="priceRange" id="priceRange">
        <option value="0-200">$0.00 - $200.00</option>
        <option value="201-400">$201.00 - $400.00</option>
        <option value="401-600">$401.00 - $600.00</option>
        <option value="601-800">$601.00 - $800.00</option>
        <option value="801-2500">$801.00 - $2,500.00</option>
      </select>
    ),
  },
  {
    key: "3",
    label: "Product Categories",
    children: <p>...</p>,
  },
  {
    key: "4",
    label: "Colour",
    children: <p>...</p>,
  },
  {
    key: "5",
    label: "Size",
    children: (
      <div>
        {[
          "0-6 mths",
          "18-24mths",
          "20",
          "38",
          "4.5-5",
          "42",
          "44",
          "5/6",
          "6-8 Jnr (XXXXS)",
          "7-9 (male); 8-10(female)",
          "9.5-10.5",
          "Afro Kids",
          "Afro midi",
          "Afro Regular",
          "Afro Regular Narrow",
          "Afro Superlarge",
          "S/M",
          "YL",
          "YM",
          "YS",
          "3.5-4",
          "10",
          "10/12",
          "11",
          "11-11.5",
          "11-13",
          "11-14",
          "12",
          "12.5-13",
          "12-18mths",
          "12-24mths",
          "13 (46)",
          "13-16",
          "14",
          "16",
          "18",
          "18 months",
          "22",
          "24",
          "26",
          "28",
          "2T",
          "2XL",
          "3-6mths",
          "30",
          "32",
          "34",
          "36",
          "3T",
          "3XL",
          "4",
          "4-5",
          "40",
          "4t",
          "5",
          "5-7",
          "5T",
          "6",
          "6-12mths",
          "6-6X",
          "6-9mths",
          "6.5-7.5",
          "6/7",
          "6mths",
          "7",
          "7/8",
          "7T",
          "8",
          "8-9",
          "9",
          "9-12 months",
          "9/10",
          "9mths",
          "L",
          "Large",
          "Large 4-5",
          "Lg",
          "M",
          "S",
          "Sm",
          "Small",
          "US 26",
          "US 28",
          "XL",
          "XS",
          "XXL",
          "XXS",
          "XXXS",
        ].map((size, index) => (
          <div key={index} className="shop-checkbox-container">
            <input
              type="checkbox"
              id={`size-${index}`}
              name="size"
              value={size}
            />
            <label htmlFor={`size-${index}`}>{size}</label>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "6",
    label: "On Sale",
    children: (
      <div className="shop-checkbox-container">
        <input type="checkbox" id="sale" name="sale" value="sale" />
        <label htmlFor="sale">On Sale</label>
      </div>
    ),
  },
];

const Shop = () => {
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
    <main>
      <section className="shop-container">
        <div className="shop-banner-content-container">
          <div className="shop-banner-title-container">
            <h1 className="shop-banner-content-title">Our Shop</h1>
          </div>
          <div className="shop-banner-inner-content-container">
            <div className="shop-banner-header sbh-first">
              <p className="h-text">
                <FaCartShopping />
                &nbsp;&nbsp;&nbsp;Delivery Available
              </p>
              <p className="p-text">Anywhere in Trinidad and Tobago</p>
            </div>
            <div className="shop-banner-header sbh-second">
              <p className="h-text">
                <FaSpinner />
                &nbsp;&nbsp;&nbsp;Exchanges must be
              </p>
              <p className="p-text">Done within 14 days of puchcase</p>
            </div>
            <div className="shop-banner-header sbh-third">
              <p className="h-text">
                <FaGlobe />
                &nbsp;&nbsp;&nbsp;Shipping via dhl for
              </p>
              <p className="p-text">international customers</p>
            </div>
          </div>
        </div>
        <div className="shop-store">
          <div className="shop-filters-container">
            <form action="submit">
              <Collapse items={items} />
            </form>
          </div>
          <div className="shop-store-wrapper">
            <div className="shop-store-title-container">
              <h2 className="shop-store-title">PRODUCTS!</h2>
            </div>
            <div className="shop-store-items-container">
              {!loading ? (
                <div className="shop-store-container">
                  {products.map((product) => (
                    <StoreCard
                      key={product._id}
                      id={product._id}
                      image={product.image}
                      title={product.title}
                      cost={product.cost}
                      discount={product.discount}
                      category={product.category}
                      handleClick={() => router.push(`/shop/${product._id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <Loading />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;
