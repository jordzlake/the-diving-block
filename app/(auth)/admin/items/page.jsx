"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Loading } from "@/components/controls/loading/Loading";
import StoreCard from "@/components/cards/store-card/Storecard";
import { getFilteredProducts } from "@/lib/productActions";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCartShopping,
  FaGlobe,
  FaMagnifyingGlass,
  FaPencil,
  FaSpinner,
  FaTrashCan,
} from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { getSettings } from "@/lib/settingActions";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";

import "./items.css";
import "@/app/shop/shop.css";

import "../admin.css";
import { toast } from "react-toastify";

import { deleteProduct } from "@/lib/productActions";

export const dynamic = "force-dynamic";

const Items = () => {
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
    searchParams.get("category") || "All"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("p")) || 1
  );
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8;

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const updateQuery = useCallback(
    (newParams, shouldResetPage = true) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const key in newParams) {
        if (
          newParams[key] === undefined ||
          newParams[key] === null ||
          newParams[key] === "" ||
          (key === "category" && newParams[key] === "All") ||
          (key === "size" && newParams[key].length === 0)
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
      router.push(`/admin/items?${newSearchParams.toString()}`, {
        scroll: false,
      });
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
        const filter = searchParams.get("t") || "";
        const page = Number(searchParams.get("p")) || 1;
        const size = searchParams.getAll("size") || undefined;
        const color = searchParams.get("color") || undefined;
        const category = searchParams.get("category") || undefined;

        const queryParams = {
          filter,
          page,
          limit: productsPerPage,
          size,
          color,
          category,
        };

        const res = await getFilteredProducts(queryParams);
        setProducts(res.products);
        setTotalProducts(res.total);

        const settings = await getSettings();
        const itemCategories = [{ name: "All" }, ...settings[0].categories];
        const itemSizes = settings[0].sizes || [];
        setCategories(itemCategories.map((item) => item.name));
        setSizes(itemSizes);

        // Extract unique colors from fetched products
        const uniqueColors = [
          ...new Set(
            res.products
              .flatMap((product) =>
                product.colors ? product.colors.map((c) => c.name) : []
              )
              .filter(Boolean)
          ),
        ];
        setColors(uniqueColors);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching products:", err);
      }
    })();
  }, [searchParams, productsPerPage]);

  const handleDelete = async (item) => {
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const data = {
          id: item._id,
          images: [item.image, item.subImage1, item.subImage2],
        };
        const res = await deleteProduct(data);
        if (res) {
          toast.success("Item successfully deleted!");
          setProducts((prevItems) =>
            prevItems.filter((i) => i._id !== item._id)
          );
        } else {
          toast.error("Cannot Delete Item.");
        }
      }
    } catch (err) {
      toast.error("Cannot Delete Item.");
    }
  };

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
    <main className="admin-items admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container-items">
        <h1 className="admin-title">Items</h1>

        <div className="admin-items-content">
          {!loading ? (
            <>
              <div className="shop-filters-container admin-items-filter-controls">
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
                          value={selectedCategory}
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
                      <div
                        style={contentStyles}
                        className="shop-sizes-container"
                      >
                        {sizes.map((size) => (
                          <div key={size} style={{ marginBottom: "5px" }}>
                            <input
                              type="checkbox"
                              value={size}
                              checked={selectedSizes.includes(size)}
                              onChange={handleSizeChange}
                              id={`size-${size}`}
                            />
                            <label htmlFor={`size-${size}`}>{size}</label>
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

              {products.length > 0 ? (
                <div className="admin-items-container">
                  <div className="admin-items-grid">
                    {products.map((item) => (
                      <div className="admin-items-grid-item" key={item._id}>
                        <StoreCard
                          id={item._id}
                          spec={item.spec || undefined}
                          image={item.image}
                          title={item.title}
                          cost={item.cost}
                          discount={item.discount}
                          category={item.category}
                          datemodified={item.updatedAt}
                          handleClick={() =>
                            router.push(`/admin/items/${item._id}`)
                          }
                        />
                        <div className="admin-items-grid-item-utils">
                          <div
                            className="admin-items-grid-item-pencil"
                            onClick={() =>
                              router.push(`/admin/items/${item._id}`)
                            }
                          >
                            <FaPencil />
                          </div>
                          <div
                            className="admin-items-grid-item-trash"
                            onClick={() => handleDelete(item)}
                          >
                            <FaTrashCan />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      {paginationItems}
                    </div>
                  )}
                </div>
              ) : (
                <div>There are no items.</div>
              )}
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </main>
  );
};

export default Items;
