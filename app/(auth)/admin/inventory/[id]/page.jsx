"use client";

import "../../admin.css";
import "./itemInventory.css";
import { useEffect, useState, useCallback, Fragment } from "react";
import { updateProduct, getProduct } from "@/lib/productActions";
import { Loading } from "@/components/controls/loading/Loading";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { useParams, useRouter } from "next/navigation";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";

const Inventory = () => {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const fetchProductData = useCallback(async (productId) => {
    try {
      const product = await getProduct(productId);
      setItem(product);

      const initialInventory = [];
      if (product?.sizes && product?.colors) {
        product.sizes.forEach((size) => {
          product.colors.forEach((colorObj) => {
            const existingInventory = product.inventory?.find(
              (inv) => inv.size === size && inv.color === colorObj.name
            );
            initialInventory.push({
              size,
              color: colorObj.name,
              amount: existingInventory?.amount || 0,
            });
          });
        });
      }
      setInventory(initialInventory);
    } catch (err) {
      console.error("Error fetching product:", err);
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProductData(id);
    } else {
      setLoading(false);
    }
  }, [id, fetchProductData]);

  const handleInventoryChange = (index, name, value) => {
    const updatedInventory = [...inventory];
    updatedInventory[index][name] = value;
    setInventory(updatedInventory);
  };

  const handleSubmit = async (e) => {
    setButtonLoading(true);
    e.preventDefault();
    const data = { id, formData: { ...item, inventory } };
    const result = await updateProduct(data);
    if (result?.errors) {
      setErrors(result.errors);
      setButtonLoading(false);
      return;
    }
    toast.success("Product Inventory Updated Successfully");
    setButtonLoading(false);
    router.push("/admin/inventory");
  };

  if (loading) {
    return (
      <main className="admin-items admin-section">
        <AdminNavbar />
        <div className="admin-container">
          <Loading />
        </div>
        <ScrollToTop />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="admin-items admin-section">
        <AdminNavbar />
        <div className="admin-container">
          <div className="admin-item-not-found">Product not found</div>
        </div>
        <ScrollToTop />
      </main>
    );
  }

  return (
    <main className="admin-items admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-item-content">
          <div className="admin-item-title">
            Managing Inventory for {item.title}
          </div>
          <ErrorContainer errors={errors} />

          {inventory.length > 0 ? (
            <form className="admin-inventory-form">
              <div className="admin-inventory-grid">
                <div className="inventory-header">Size</div>
                <div className="inventory-header">Color</div>
                <div className="inventory-header">Amount in Stock</div>

                {inventory.map((itemInventory, index) => (
                  <Fragment
                    key={`${itemInventory.size}-${itemInventory.color}`}
                  >
                    <div className="inventory-item">{itemInventory.size}</div>
                    <div className="inventory-item">{itemInventory.color}</div>
                    <div className="inventory-item">
                      <FormInput
                        label="Amount"
                        type="number"
                        name="amount"
                        value={itemInventory.amount}
                        onChange={(e) =>
                          handleInventoryChange(
                            index,
                            e.target.name,
                            parseInt(e.target.value) >= 0
                              ? parseInt(e.target.value)
                              : 0
                          )
                        }
                        required={true}
                      />
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="admin-item-actions">
                <button
                  className="admin-variant-color-button"
                  disabled={buttonLoading}
                  onClick={handleSubmit}
                >
                  {buttonLoading ? "Updating..." : "Update Inventory"}
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-item-empty">
              No sizes or colors are currently associated with this product.
              Please update the product details to include sizes and colors to
              manage inventory.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Inventory;
