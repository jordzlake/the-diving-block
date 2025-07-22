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
  FaCheck,
  FaGlobe,
  FaMagnifyingGlass,
  FaPencil,
  FaSalesforce,
  FaSpinner,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { getSettings } from "@/lib/settingActions";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";

import "./itemsInventory.css";
import "@/app/shop/shop.css";

import "../admin.css";
import { toast } from "react-toastify";

import { deleteProduct } from "@/lib/productActions";

export const dynamic = "force-dynamic";

const InventoryItems = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("t") || "");
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams.get("size") ? searchParams.get("size").split(",") : [] // Read size as comma-separated
  );
  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || undefined
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  // New state for selected subcategories, reading from comma-separated URL param
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    searchParams.get("subCategory")
      ? searchParams.get("subCategory").split(",")
      : []
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("p")) || 1
  );
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 6;

  // Categories will now store the full category objects from settings
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Helper function to get subcategories for a given category name
  const getSubCategoriesForCategory = useCallback(
    (categoryName) => {
      const category = categories.find((cat) => cat.name === categoryName);
      return category ? category.subCategories : [];
    },
    [categories]
  );

  const updateQuery = useCallback(
    (newParams, shouldResetPage = true) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const key in newParams) {
        if (
          newParams[key] === undefined ||
          newParams[key] === null ||
          newParams[key] === "" ||
          (key === "category" && newParams[key] === "All") ||
          (key === "size" && newParams[key].length === 0) ||
          (key === "subCategory" && newParams[key].length === 0) // Handle empty subCategory array
        ) {
          newSearchParams.delete(key);
        } else if (Array.isArray(newParams[key])) {
          // For array parameters like 'size' and 'subCategory', join them with a comma
          // and set as a single parameter.
          if (newParams[key].length > 0) {
            newSearchParams.set(key, newParams[key].join(","));
          } else {
            newSearchParams.delete(key); // Delete if array is empty
          }
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
    const updatedSizes = isChecked
      ? [...selectedSizes, value]
      : selectedSizes.filter((size) => size !== value);
    setSelectedSizes(updatedSizes);
    updateQuery({ size: updatedSizes });
  };

  const handleColorChange = (event) => {
    const value = event.target.value === "" ? undefined : event.target.value;
    setSelectedColor(value);
    updateQuery({ color: value });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value === "" ? undefined : event.target.value;
    setSelectedCategory(value);
    // Reset subcategories when main category changes
    setSelectedSubCategories([]);
    updateQuery({ category: value, subCategory: [] }); // Pass empty array to clear subCategory in URL
  };

  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    const updatedSubCategories = isChecked
      ? [...selectedSubCategories, value]
      : selectedSubCategories.filter((subCat) => subCat !== value);
    setSelectedSubCategories(updatedSubCategories);
    updateQuery({ subCategory: updatedSubCategories }); // Pass the array to updateQuery
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
        // Read size and subCategory as comma-separated strings and split into arrays
        const size = searchParams.get("size")
          ? searchParams.get("size").split(",")
          : undefined;
        const color = searchParams.get("color") || undefined;
        const category = searchParams.get("category") || undefined;
        const subCategory = searchParams.get("subCategory")
          ? searchParams.get("subCategory").split(",")
          : undefined;

        const queryParams = {
          filter,
          page,
          limit: productsPerPage,
          size,
          color,
          category,
          subCategory, // Pass subCategory to getFilteredProducts
        };

        const res = await getFilteredProducts(queryParams);
        setProducts(res.products);
        setTotalProducts(res.total);

        const settings = await getSettings();
        // Store full category objects to access subCategories
        // Ensure "All" is explicitly added if it's a desired filter option,
        // otherwise settings.categories will be used directly.
        const allCategories = [...(settings[0].categories || [])];
        setCategories(allCategories);
        const itemSizes = settings[0].sizes || [];
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
      // Using a custom modal/dialog instead of window.confirm for better UI/UX
      // For this example, we'll simulate the confirmation. In a real app, you'd
      // render a modal and handle its state.
      const confirmed = window.confirm(
        "Are you sure you want to delete this item?"
      ); // Replace with custom modal
      if (confirmed) {
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

  // Calculate the range of pagination items to display
  const pageRange = 2; // Number of pages to show around the current page
  let startPage = Math.max(1, currentPage - pageRange);
  let endPage = Math.min(totalPages, currentPage + pageRange);

  // Adjust start and end page to ensure a consistent number of visible pages
  if (endPage - startPage + 1 < 2 * pageRange + 1) {
    if (currentPage - startPage < pageRange) {
      endPage = Math.min(totalPages, startPage + 2 * pageRange);
    } else if (endPage - currentPage < pageRange) {
      startPage = Math.max(1, endPage - 2 * pageRange);
    }
  }

  const paginationItems = [];

  // Add "Previous" button
  paginationItems.push(
    <button
      key="prev"
      className="pagination-button"
      onClick={() => {
        handlePageChange(currentPage - 1);
        window.scrollTo(0, 100);
      }}
      disabled={currentPage === 1}
    >
      <FaArrowLeft />
    </button>
  );

  // Add first page if not in range
  if (startPage > 1) {
    paginationItems.push(
      <button
        key={1}
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => {
          handlePageChange(1);
          window.scrollTo(0, 100);
        }}
      >
        1
      </button>
    );
    if (startPage > 2) {
      paginationItems.push(
        <span key="dots-start" className="pagination-dots">
          ...
        </span>
      );
    }
  }

  // Add page numbers within the calculated range
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <button
        key={i}
        className={`pagination-button ${currentPage === i ? "active" : ""}`}
        onClick={() => {
          handlePageChange(i);
          window.scrollTo(0, 100);
        }}
      >
        {i}
      </button>
    );
  }

  // Add last page if not in range
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationItems.push(
        <span key="dots-end" className="pagination-dots">
          ...
        </span>
      );
    }
    paginationItems.push(
      <button
        key={totalPages}
        className={`pagination-button ${
          currentPage === totalPages ? "active" : ""
        }`}
        onClick={() => {
          handlePageChange(totalPages);
          window.scrollTo(0, 100);
        }}
      >
        {totalPages}
      </button>
    );
  }

  // Add "Next" button
  paginationItems.push(
    <button
      key="next"
      className="pagination-button"
      onClick={() => {
        handlePageChange(currentPage + 1);
        window.scrollTo(0, 100);
      }}
      disabled={currentPage === totalPages}
    >
      <FaArrowRight />
    </button>
  );

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
        <h1 className="admin-title">Inventory</h1>

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
                          style={{
                            width: "100%",
                            padding: "8px",
                            marginBottom: "10px",
                          }}
                        >
                          <option value="All">All Categories</option>
                          {categories.map((cat, i) => (
                            <option key={`${cat.name}-${i}`} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        {/* Subcategory checkboxes */}
                        {selectedCategory &&
                          selectedCategory !== "All" &&
                          getSubCategoriesForCategory(selectedCategory).length >
                            0 && (
                            <div className="shop-subcategories-container">
                              <label className="shop-filter-label">
                                Subcategories:
                              </label>
                              {getSubCategoriesForCategory(
                                selectedCategory
                              ).map((subCat, i) => (
                                <div
                                  key={`${subCat}-${i}`}
                                  style={{ marginBottom: "5px" }}
                                >
                                  <input
                                    type="checkbox"
                                    value={subCat}
                                    checked={selectedSubCategories.includes(
                                      subCat
                                    )}
                                    onChange={handleSubCategoryChange}
                                    id={`subcat-${subCat}`}
                                  />
                                  <label
                                    htmlFor={`subcat-${subCat}`}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    {subCat}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
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
                            router.push(`/admin/inventory/${item._id}`)
                          }
                        />
                        <div className="admin-items-grid-item-utils">
                          <div
                            className="admin-items-grid-item-pencil"
                            onClick={() =>
                              router.push(`/admin/inventory/${item._id}`)
                            }
                          >
                            <MdInventory />
                          </div>
                          {item.inventory && item.inventory.length > 0 ? (
                            <div className="admin-items-grid-item-green">
                              <FaCheck />
                            </div>
                          ) : (
                            <div className="admin-items-grid-item-red">
                              <FaXmark />
                            </div>
                          )}
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

export default InventoryItems;
