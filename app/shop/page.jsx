"use client";

import "@/app/shop/shop.css";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Loading } from "@/components/controls/loading/Loading";
import StoreCard from "@/components/cards/store-card/Storecard";
import { getFilteredProducts } from "@/lib/productActions";
import {
  FaCartShopping,
  FaGlobe,
  FaMagnifyingGlass,
  FaSpinner,
} from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { getSettings } from "@/lib/settingActions";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { CalculateProductDiscounts } from "@/components/calculations/CalculateProductDiscounts";

const Shop = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("t") || "");
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams.getAll("size") || []
  );
  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || undefined
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || undefined
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("p")) || 1
  );
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8;

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  const updateQuery = useCallback(
    (newParams, shouldResetPage = true) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const key in newParams) {
        if (
          newParams[key] === undefined ||
          newParams[key] === null ||
          newParams[key] === ""
        ) {
          newSearchParams.delete(key);
        } else if (Array.isArray(newParams[key])) {
          newSearchParams.delete(key);
          newParams[key].forEach((value) => newSearchParams.append(key, value));
        } else {
          newSearchParams.set(key, newParams[key]);
        }
      }
      if (shouldResetPage) {
        setCurrentPage(1);
        newSearchParams.set("p", "1");
      }
      router.push(`/shop?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateQuery({ t: searchTerm });
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setSelectedSizes((prevSizes) =>
      isChecked
        ? [...prevSizes, value]
        : prevSizes.filter((size) => size !== value)
    );
    // Update query immediately on size change, resetting page
    updateQuery({
      size: isChecked
        ? [...selectedSizes, value]
        : selectedSizes.filter((size) => size !== value),
    });
  };

  const handleColorChange = (event) => {
    const value = event.target.value === "" ? undefined : event.target.value;
    setSelectedColor(value);
    updateQuery({ color: value });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value === "" ? undefined : event.target.value;
    setSelectedCategory(value);
    updateQuery({ category: value });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateQuery({ p: page }, false);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let filter = searchParams.get("t") || "";
        let order = searchParams.get("o") || "asc";
        let page = Number(searchParams.get("p")) || 1;
        let size = searchParams.getAll("size") || undefined;
        let color = searchParams.get("color") || undefined;
        let category = searchParams.get("category") || undefined;

        const data = {
          filter,
          order,
          page,
          size,
          color,
          category,
          limit: productsPerPage,
        };

        const settings = await getSettings();
        const itemCategories = settings[0].categories.map((cat) => cat.name);
        const itemSizes = settings[0].sizes.map((sz) => sz);

        setCategories(itemCategories);
        setSizes(itemSizes);

        const res = await getFilteredProducts(data);
        const discountedItems = CalculateProductDiscounts(
          res.products,
          settings[0]
        );
        setProducts(discountedItems);
        setTotalProducts(res.total);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    })();
  }, [searchParams, productsPerPage]);

  // Extract unique values for filters
  const colors = [
    ...new Set(
      products.flatMap((product) => product.colors.map((c) => c.name))
    ),
  ].filter(Boolean);

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginationItems = Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
      onClick={() => handlePageChange(i + 1)}
    >
      {i + 1}
    </button>
  ));

  const collapseStyles = {
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const headerStyles = {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const contentStyles = {
    padding: "10px",
  };

  const [openFilters, setOpenFilters] = useState({
    size: false,
    color: false,
    category: false,
  });

  const toggleCollapse = (filter) => {
    setOpenFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

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
              <p className="p-text">Done within 14 days of purchase</p>
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
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button type="submit" className="search-button">
                  <FaMagnifyingGlass />
                </button>
              </div>
            </form>

            {categories.length > 0 && (
              <div style={collapseStyles}>
                <div
                  style={headerStyles}
                  onClick={() => toggleCollapse("category")}
                >
                  Category
                  <span>{openFilters.category ? "-" : "+"}</span>
                </div>
                {openFilters.category && (
                  <div style={contentStyles}>
                    <select
                      value={selectedCategory || ""}
                      onChange={handleCategoryChange}
                      style={{ width: "100%", padding: "8px" }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {sizes.length > 0 && (
              <div style={collapseStyles}>
                <div
                  style={headerStyles}
                  onClick={() => toggleCollapse("size")}
                >
                  Size
                  <span>{openFilters.size ? "-" : "+"}</span>
                </div>
                {openFilters.size && (
                  <div style={contentStyles} className="shop-sizes-container">
                    {sizes.map((size) => (
                      <div key={size} style={{ marginBottom: "5px" }}>
                        <input
                          type="checkbox"
                          value={size}
                          checked={selectedSizes.includes(size)}
                          onChange={handleSizeChange}
                          id={`size-${size}`}
                        />
                        <label
                          htmlFor={`size-${size}`}
                          style={{ marginLeft: "5px" }}
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {colors.length > 0 && (
              <div style={collapseStyles}>
                <div
                  style={headerStyles}
                  onClick={() => toggleCollapse("color")}
                >
                  Color
                  <span>{openFilters.color ? "-" : "+"}</span>
                </div>
                {openFilters.color && (
                  <div style={contentStyles}>
                    <select
                      value={selectedColor || ""}
                      onChange={handleColorChange}
                      style={{ width: "100%", padding: "8px" }}
                    >
                      <option value="">All Colors</option>
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="shop-store-wrapper">
            <div className="shop-store-title-container">
              <h2 className="shop-store-title">PRODUCTS!</h2>
            </div>
            <div className="shop-store-items-container">
              {!loading ? (
                products.length > 0 ? (
                  <>
                    {
                      <div className="shop-store-container">
                        {products.map((product) => (
                          <StoreCard
                            key={product._id}
                            spec={product.spec || undefined}
                            id={product._id}
                            image={product.image}
                            title={product.title}
                            cost={product.cost}
                            discount={product.discount}
                            category={product.category}
                            handleClick={() =>
                              router.push(`/shop/${product._id}`)
                            }
                          />
                        ))}
                      </div>
                    }
                  </>
                ) : (
                  <>
                    <div className="shop-store-warning">
                      There are no products in this category
                    </div>
                  </>
                )
              ) : (
                <div>
                  <Loading />
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="pagination-container">{paginationItems}</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;
