"use client";

import "@/app/shop/shop.css";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Loading } from "@/components/controls/loading/Loading";
import StoreCard from "@/components/cards/store-card/Storecard";
import { getFilteredProducts } from "@/lib/productActions";
import {
  FaArrowLeft, // Added for pagination arrows
  FaArrowRight, // Added for pagination arrows
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
  // New state for selected subcategories
  // When reading from URL, split the single string by comma
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    searchParams.get("subCategory")
      ? searchParams.get("subCategory").split(",")
      : []
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("p")) || 1
  );
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8; // Products per page for the shop

  // Categories will now store the full category objects from settings
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

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
          // Special handling for array parameters that might become empty
          (key === "size" && newParams[key].length === 0) ||
          (key === "subCategory" && newParams[key].length === 0) // Check for empty array for subCategory
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
    updateQuery({ p: page }, false); // Do not reset page when changing page number
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let filter = searchParams.get("t") || "";
        let order = searchParams.get("o") || "asc";
        let page = Number(searchParams.get("p")) || 1;
        let size = searchParams.get("size")
          ? searchParams.get("size").split(",")
          : undefined; // Read size as comma-separated
        let color = searchParams.get("color") || undefined;
        let category = searchParams.get("category") || undefined;
        let subCategory = searchParams.get("subCategory")
          ? searchParams.get("subCategory").split(",")
          : undefined; // Read subCategory as comma-separated

        const data = {
          filter,
          order,
          page,
          size,
          color,
          category,
          subCategory, // Pass subCategory to getFilteredProducts
          limit: productsPerPage,
        };

        const settings = await getSettings();
        // Store full category objects to access subCategories
        setCategories(settings[0].categories || []);
        const itemSizes = settings[0].sizes.map((sz) => sz);
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

  // Extract unique colors from current products for the color filter
  const colors = [
    ...new Set(
      products
        .flatMap((product) => product.colors?.map((c) => c.name))
        .filter(Boolean)
    ),
  ];

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Calculate the range of pagination items to display
  const pageRange = 1; // Number of pages to show around the current page
  let startPage = Math.max(1, currentPage - pageRange);
  let endPage = Math.min(totalPages, currentPage + pageRange);

  // Adjust start and end page to ensure a consistent number of visible pages
  if (endPage - startPage + 1 < 2 * pageRange + 1) {
    if (currentPage - startPage < pageRange) {
      // If current page is close to the beginning, extend endPage
      endPage = Math.min(totalPages, startPage + 2 * pageRange);
    } else if (endPage - currentPage < pageRange) {
      // If current page is close to the end, extend startPage
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
        window.scrollTo(0, 100); // Scroll to top after page change
      }}
      disabled={currentPage === 1} // Disable if on the first page
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
    // Add ellipses if there's a gap between the first page and the start of the range
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
    // Add ellipses if there's a gap between the end of the range and the last page
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
      disabled={currentPage === totalPages} // Disable if on the last page
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
    <main>
      <ScrollToTop /> {/* Added ScrollToTop component */}
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
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat, i) => (
                        <option key={`${cat.name}-${i}`} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    {/* Subcategory checkboxes */}
                    {selectedCategory &&
                      getSubCategoriesForCategory(selectedCategory).length >
                        0 && (
                        <div className="shop-subcategories-container">
                          <label className="shop-filter-label">
                            Subcategories:
                          </label>
                          {getSubCategoriesForCategory(selectedCategory).map(
                            (subCat, i) => (
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
                            )
                          )}
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
                            datemodified={product.updatedAt}
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
