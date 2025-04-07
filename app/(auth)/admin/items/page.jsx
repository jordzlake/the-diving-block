"use client";

import { useContext, useEffect, useState } from "react";
import "./items.css";
import "../admin.css";
import { getProducts } from "@/lib/productActions";
import StoreCard from "@/components/cards/store-card/Storecard";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPencil,
  FaTrashCan,
} from "react-icons/fa6";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { toast } from "react-toastify";
import { deleteProduct } from "@/lib/productActions";
import { useSearchParams } from "next/navigation";
import { Loading } from "@/components/controls/loading/Loading";
import { CartContext } from "@/components/controls/Contexts/CartProvider";
import { getSettings } from "@/lib/settingActions";

export const dynamic = "force-dynamic";

const Items = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const { addItem } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = items.filter((item) => {
      const searchTermLower = searchText.toLowerCase().trim();
      setCurrentPage(1);
      if (selectedCategory !== "All" && selectedCategory !== item.category) {
        return false;
      }
      return (
        item.createdAt.toString().toLowerCase().includes(searchTermLower) ||
        item.title.toLowerCase().includes(searchTermLower) ||
        item.cost.toString().toLowerCase().includes(searchTermLower) ||
        item._id.toString().toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredItems(filtered);
  }, [items, searchText, selectedCategory]);

  useEffect(() => {
    (async () => {
      try {
        const products = await getProducts();
        setItems(products);
        const settings = await getSettings();
        const cat = [{ name: "All" }, ...settings[0].categories];
        setCategories(cat.map((item) => item.name));
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

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
          setItems(items.filter((i) => i._id !== item._id));
        } else {
          toast.error("Cannot Delete Item.");
        }
      }
    } catch (err) {
      toast.error("Cannot Delete Item.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <main className="admin-items admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container-items">
        <h1 className="admin-title">Items</h1>

        <div className="admin-items-content">
          {!loading ? (
            <>
              {items.length > 0 && (
                <div className="admin-items-filter-controls">
                  <div className="admin-searchBarContainer">
                    <p className="admin-searchText">Search:</p>
                    <input
                      className="admin-searchBar"
                      type="text"
                      placeholder="Search items..."
                      value={searchText}
                      onChange={(e) =>
                        setSearchText(e.target.value.toLowerCase())
                      }
                    />
                  </div>
                  <div className="admin-controlsContainer">
                    <p className="admin-searchText">Filter:</p>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="admin-dropdown"
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {filteredItems.length > 0 ? (
                <div className="admin-items-container">
                  <div className="admin-items-grid">
                    {currentItems.map((item) => (
                      <div className="admin-items-grid-item" key={item._id}>
                        <StoreCard
                          id={item._id}
                          image={item.image}
                          title={item.title}
                          cost={item.cost}
                          discount={item.discount}
                          category={item.category}
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
                  <div className="pagination-controls">
                    <button
                      className="admin-pagination-button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <FaArrowLeft />
                    </button>
                    <span className="admin-pagination-text">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="admin-pagination-button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
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
