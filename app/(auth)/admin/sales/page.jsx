"use client";

import "../admin.css";
import "./sales.css";
import { useEffect, useState, useCallback } from "react";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { getSettings, updateSettings } from "@/lib/settingActions";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import { settingsSchema } from "@/lib/schema"; // Assuming this schema is for validation
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { FaMagnifyingGlass, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Loading } from "@/components/controls/loading/Loading";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/productActions";
import { CldImage } from "next-cloudinary";

export const dynamic = "force-dynamic";

const dropdownStyles = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  zIndex: 10,
  maxHeight: "200px",
  overflowY: "auto",
};

const dropdownItemStyles = {
  padding: "8px 12px",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#eee",
  },
};

const Sales = () => {
  const router = useRouter();
  const [settingsData, setSettingsData] = useState({
    categories: [],
    sales: [],
    sitesale: {
      name: "",
      discount: 0,
      description: "",
      enabled: false,
    },
    categorysales: [], // Initialize categorysales array
  });
  const [newSale, setNewSale] = useState({
    name: "",
    description: "",
    discount: 0,
    items: [],
  });
  const [newCategorySale, setNewCategorySale] = useState({
    name: "",
    category: "", // Store category name as string
    subCategories: [], // Store selected sub-category names as array of strings
    discount: 0,
    description: "",
    enabled: false,
  });
  const [errors, setErrors] = useState([]);
  const [changeErrors, setChangeErrors] = useState([]);
  const [addErrors, setAddErrors] = useState([]);
  const [addCategorySaleErrors, setAddCategorySaleErrors] = useState([]); // New state for category sale errors
  const [searchTermNewSale, setSearchTermNewSale] = useState("");
  const [searchResultsNewSale, setSearchResultsNewSale] = useState([]);
  const [isDropdownOpenNewSale, setIsDropdownOpenNewSale] = useState(false);
  const [searchTermExistingSale, setSearchTermExistingSale] = useState("");
  const [searchResultsExistingSale, setSearchResultsExistingSale] = useState(
    []
  );
  const [isDropdownOpenExistingSale, setIsDropdownOpenExistingSale] =
    useState(false);
  const [currentExistingSaleIndex, setCurrentExistingSaleIndex] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchTimeoutExisting, setSearchTimeoutExisting] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // State to hold all available categories and their subcategories
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let fetchedSettings = await getSettings();
        if (fetchedSettings && fetchedSettings.length > 0) {
          // Ensure sitesale and categorysales are initialized if missing
          if (!fetchedSettings[0].sitesale) {
            fetchedSettings[0].sitesale = {
              name: "",
              discount: 0,
              description: "",
              enabled: false,
            };
          }
          if (!fetchedSettings[0].categorysales) {
            fetchedSettings[0].categorysales = [];
          }
          setSettingsData(fetchedSettings[0]);
          setAvailableCategories(fetchedSettings[0].categories || []); // Set available categories
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
        toast.error("Error fetching settings.");
      }
    })();
  }, []);

  // Helper to get subcategories for a given category name
  const getSubCategoriesForCategory = (categoryName) => {
    const category = availableCategories.find(
      (cat) => cat.name === categoryName
    );
    return category ? category.subCategories : [];
  };

  // Handlers for existing regular sales
  const handleSalesNameChange = (e) => {
    setSettingsChanged(true);
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedSales = [...settingsData.sales];
    updatedSales[index].name = value;
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleSalesDescriptionChange = (e) => {
    setSettingsChanged(true);
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedSales = [...settingsData.sales];
    updatedSales[index].description = value;
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleSalesRadioChange = (e) => {
    setSettingsChanged(true);
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedSales = [...settingsData.sales];
    updatedSales[index].enabled = value === "true";
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleSalesDiscountChange = (e) => {
    setSettingsChanged(true);
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedSales = [...settingsData.sales];
    updatedSales[index].discount = parseFloat(value);
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleAddItemToSale = (item) => {
    setNewSale((prevNewSale) => ({
      ...prevNewSale,
      items: [...prevNewSale.items, item],
    }));
    setSearchTermNewSale("");
    setSearchResultsNewSale([]);
    setIsDropdownOpenNewSale(false);
  };

  const handleRemoveItemFromNewSale = (index) => {
    const updatedItems = newSale.items.filter((_, idx) => idx !== index);
    setNewSale({ ...newSale, items: updatedItems });
  };

  const handleAddItemToExistingSale = (item) => {
    setSettingsChanged(true);
    const updatedSales = [...settingsData.sales];
    const saleIndex = currentExistingSaleIndex;

    if (updatedSales[saleIndex]) {
      updatedSales[saleIndex].items = [
        ...(updatedSales[saleIndex].items || []),
        item,
      ];
      setSettingsData({ ...settingsData, sales: updatedSales });
      setSearchTermExistingSale("");
      setSearchResultsExistingSale([]);
      setIsDropdownOpenExistingSale(false);
      setCurrentExistingSaleIndex(null);
    } else {
      console.error(`Error: Sale object does not exist at index ${saleIndex}`);
      toast.error("Could not add item to sale.");
      setSearchTermExistingSale("");
      setSearchResultsExistingSale([]);
      setIsDropdownOpenExistingSale(false);
      setCurrentExistingSaleIndex(null);
    }
  };

  const handleRemoveItemFromExistingSale = (saleIndex, itemIndex) => {
    setSettingsChanged(true);
    const updatedSales = [...settingsData.sales];
    updatedSales[saleIndex].items = updatedSales[saleIndex].items.filter(
      (_, idx) => idx !== itemIndex
    );
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleAddSale = async (e) => {
    setButtonLoading(true);
    setAddErrors([]);
    e.preventDefault();
    const validationErrors = [];
    if (!newSale.name) {
      validationErrors.push("newSaleName : Sale name is required.");
    }
    if (newSale.discount < 0 || isNaN(newSale.discount)) {
      validationErrors.push(
        "newSaleDiscount : Discount must be a positive number."
      );
    }

    if (validationErrors.length > 0) {
      setButtonLoading(false);
      setAddErrors(validationErrors);
      return;
    }

    const newSettings = {
      ...settingsData,
      sales: [...settingsData.sales, newSale],
    };
    setSettingsData(newSettings);
    setNewSale({
      name: "",
      description: "",
      discount: 0,
      items: [],
    });
    const data = { formData: newSettings };
    const result = await updateSettings(data);
    if (result.errors) {
      setButtonLoading(false);
      setAddErrors([...validationErrors, ...result.errors]);
      return;
    } else {
      setButtonLoading(false);
      toast.success("Changed Settings Successfully");
      router.push("/admin/sales");
    }
  };

  const handleRemoveSale = (index) => {
    setSettingsChanged(true);
    const updatedSales = settingsData.sales.filter((_, idx) => idx !== index);
    setSettingsData({ ...settingsData, sales: updatedSales });
  };

  const handleSubmit = async (e) => {
    setButtonLoading(true);
    e.preventDefault();
    setChangeErrors([]);
    const validationErrors = [];
    settingsData.sales.forEach((sale, index) => {
      if (!sale.name) {
        validationErrors.push(
          `sales.${index}.name : Sale ${index + 1} name is required.`
        );
      }
      if (sale.discount < 0 || isNaN(sale.discount)) {
        validationErrors.push(
          `sales.${index}.discount: Sale ${
            index + 1
          } discount must be a positive number.`
        );
      }
    });
    // Add validation for category sales here
    settingsData.categorysales.forEach((sale, index) => {
      if (!sale.name) {
        validationErrors.push(
          `categorysales.${index}.name : Category Sale ${
            index + 1
          } name is required.`
        );
      }
      if (sale.discount < 0 || isNaN(sale.discount)) {
        validationErrors.push(
          `categorysales.${index}.discount: Category Sale ${
            index + 1
          } discount must be a positive number.`
        );
      }
      if (!sale.category) {
        validationErrors.push(
          `categorysales.${index}.category: Category Sale ${
            index + 1
          } category is required.`
        );
      }
      if (sale.subCategories.length === 0) {
        validationErrors.push(
          `categorysales.${index}.subCategories: Category Sale ${
            index + 1
          } must have at least one sub-category selected.`
        );
      }
    });

    if (validationErrors.length > 0) {
      setButtonLoading(false);
      setChangeErrors(validationErrors);
      return;
    }

    console.log("Form data:", settingsData);
    const data = { formData: settingsData };
    const result = await updateSettings(data);
    if (result.errors) {
      setButtonLoading(false);
      setChangeErrors([...validationErrors, ...result.errors]);
      return;
    } else {
      setButtonLoading(false);
      toast.success("Changed Settings Successfully");
      router.push("/admin/sales");
    }
  };

  const handleSiteSaleSubmit = async (e) => {
    setButtonLoading(true);
    e.preventDefault();
    setErrors([]);
    const validationErrors = [];
    if (!settingsData.sitesale.name) {
      validationErrors.push("siteSaleName : Site wide sale name is required.");
    }
    if (
      settingsData.sitesale.discount < 0 ||
      isNaN(settingsData.sitesale.discount)
    ) {
      validationErrors.push(
        "siteSaleDiscount : Site wide sale discount must be a positive number."
      );
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setButtonLoading(false);
      return;
    }

    console.log("Form data:", settingsData);
    const data = { formData: settingsData };
    const result = await updateSettings(data);
    if (result.errors) {
      setButtonLoading(false);
      setErrors([...validationErrors, ...result.errors]);
      return;
    } else {
      setButtonLoading(false);
      toast.success("Changed Site Sale Settings Successfully");
      router.push("/admin/sales");
    }
  };

  const handleSiteWideSaleChange = (e) => {
    const { value, name } = e.target;
    let siteSale = { ...settingsData.sitesale, [name]: value };
    console.log({ ...settingsData, sitesale: siteSale });
    setSettingsData({ ...settingsData, sitesale: siteSale });
  };

  const handleSiteWideSalesRadioChange = (e) => {
    const { value } = e.target;
    let siteSale = { ...settingsData.sitesale, enabled: value === "true" };
    console.log({ ...settingsData, sitesale: siteSale });
    setSettingsData({ ...settingsData, sitesale: siteSale });
  };

  const searchProducts = useCallback(async (term) => {
    setSearchLoading(true);
    try {
      const response = await fetchProducts({
        searchTerm: term,
        limit: 10,
      });
      if (response.products) {
        const { products } = response;
        return products;
      } else {
        toast.error("Error searching products.");
        return [];
      }
    } catch (error) {
      console.error("Error during product search:", error);
      toast.error("Error searching products.");
      return [];
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchInputChangeNewSale = (e) => {
    const { value } = e.target;
    setSearchTermNewSale(value);
    setSearchResultsNewSale([]);
    setIsDropdownOpenNewSale(false);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value) {
      setSearchTimeout(
        setTimeout(async () => {
          const results = await searchProducts(value);
          if (results) {
            const allItemsInSales = settingsData.sales.reduce((acc, sale) => {
              if (sale.items) {
                acc.push(...sale.items.map((item) => item._id));
              }
              return acc;
            }, []);

            setSearchResultsNewSale(
              results.filter(
                (result) =>
                  !newSale.items.some((item) => item._id === result._id) &&
                  !allItemsInSales.includes(result._id) // Check against all sales
              )
            );
            setIsDropdownOpenNewSale(true);
          }
        }, 100)
      );
    }
  };

  const handleSearchInputChangeExistingSale = (e, index) => {
    const { value } = e.target;
    setSearchTermExistingSale(value);
    setSearchResultsExistingSale([]);
    setIsDropdownOpenExistingSale(false);
    setCurrentExistingSaleIndex(index);

    if (searchTimeoutExisting) {
      clearTimeout(searchTimeoutExisting);
    }

    if (value) {
      setSearchTimeoutExisting(
        setTimeout(async () => {
          const results = await searchProducts(value);
          if (results && settingsData.sales[index]?.items) {
            setSearchResultsExistingSale(
              results.filter(
                (result) =>
                  !settingsData.sales[index].items.some(
                    (item) => item._id === result._id
                  )
              )
            );
            setIsDropdownOpenExistingSale(true);
          } else if (results) {
            setSearchResultsExistingSale(results);
            setIsDropdownOpenExistingSale(true);
          }
        }, 100)
      );
    }
  };

  // Handlers for new category sale
  const handleNewCategorySaleChange = (e) => {
    const { name, value } = e.target;
    setNewCategorySale((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCategorySaleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setNewCategorySale((prev) => ({
      ...prev,
      category: categoryName,
      subCategories: [], // Clear subcategories when main category changes
    }));
  };

  const handleNewCategorySaleSubCategoryChange = (e) => {
    const { value, checked } = e.target;
    setNewCategorySale((prev) => {
      const updatedSubCategories = checked
        ? [...prev.subCategories, value]
        : prev.subCategories.filter((subCat) => subCat !== value);
      return { ...prev, subCategories: updatedSubCategories };
    });
  };

  const handleAddCategorySale = async (e) => {
    setButtonLoading(true);
    setAddCategorySaleErrors([]);
    e.preventDefault();
    const validationErrors = [];
    if (!newCategorySale.name) {
      validationErrors.push(
        "newCategorySaleName : Category sale name is required."
      );
    }
    if (newCategorySale.discount < 0 || isNaN(newCategorySale.discount)) {
      validationErrors.push(
        "newCategorySaleDiscount : Discount must be a positive number."
      );
    }
    if (!newCategorySale.category) {
      validationErrors.push("newCategorySaleCategory : Category is required.");
    }
    if (newCategorySale.subCategories.length === 0) {
      validationErrors.push(
        "newCategorySaleSubCategories : At least one sub-category must be selected."
      );
    }

    if (validationErrors.length > 0) {
      setButtonLoading(false);
      setAddCategorySaleErrors(validationErrors);
      return;
    }

    const newSettings = {
      ...settingsData,
      categorysales: [...settingsData.categorysales, newCategorySale],
    };
    setSettingsData(newSettings);
    setNewCategorySale({
      name: "",
      category: "",
      subCategories: [],
      discount: 0,
      description: "",
      enabled: false,
    });
    const data = { formData: newSettings };
    const result = await updateSettings(data);
    if (result.errors) {
      setButtonLoading(false);
      setAddCategorySaleErrors([...validationErrors, ...result.errors]);
      return;
    } else {
      setButtonLoading(false);
      toast.success("Category Sale Added Successfully");
      router.push("/admin/sales");
    }
  };

  // Handlers for existing category sales
  const handleExistingCategorySaleChange = (e, index) => {
    setSettingsChanged(true);
    const { name, value } = e.target;
    const updatedCategorySales = [...settingsData.categorysales];
    updatedCategorySales[index] = {
      ...updatedCategorySales[index],
      [name]: value,
    };
    setSettingsData({ ...settingsData, categorysales: updatedCategorySales });
  };

  const handleExistingCategorySaleCategoryChange = (e, index) => {
    setSettingsChanged(true);
    const categoryName = e.target.value;
    const updatedCategorySales = [...settingsData.categorysales];
    updatedCategorySales[index].category = categoryName;
    updatedCategorySales[index].subCategories = []; // Clear subcategories when main category changes
    setSettingsData({ ...settingsData, categorysales: updatedCategorySales });
  };

  const handleExistingCategorySaleSubCategoryChange = (e, saleIndex) => {
    setSettingsChanged(true);
    const { value, checked } = e.target;
    setSettingsData((prevSettings) => {
      const updatedCategorySales = [...prevSettings.categorysales];
      const currentSale = { ...updatedCategorySales[saleIndex] };
      const updatedSubCategories = checked
        ? [...(currentSale.subCategories || []), value]
        : (currentSale.subCategories || []).filter(
            (subCat) => subCat !== value
          );
      currentSale.subCategories = updatedSubCategories;
      updatedCategorySales[saleIndex] = currentSale;
      return { ...prevSettings, categorysales: updatedCategorySales };
    });
  };

  const handleExistingCategorySaleRadioChange = (e, index) => {
    setSettingsChanged(true);
    const { value } = e.target;
    const updatedCategorySales = [...settingsData.categorysales];
    updatedCategorySales[index].enabled = value === "true";
    setSettingsData({ ...settingsData, categorysales: updatedCategorySales });
  };

  const handleRemoveCategorySale = (index) => {
    setSettingsChanged(true);
    const updatedCategorySales = settingsData.categorysales.filter(
      (_, idx) => idx !== index
    );
    setSettingsData({ ...settingsData, categorysales: updatedCategorySales });
  };

  return (
    <main className="admin-sales admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container admin-sales-main-container">
        {!loading ? (
          <div className="admin-sales-content">
            <div className="admin-sales-title">Store Sales</div>
            {/* Sales */}

            <div className="admin-sales">
              <form className="admin-sales-form">
                {settingsData.sales.length > 0 && (
                  <div className="admin-sales-current">
                    <label className="admin-sales-label">Current Sales:</label>
                    <div className="admin-sales-text">
                      You can edit sales by clicking the fields and changing the
                      text
                    </div>
                    {settingsData.sales.map((sale, index) => (
                      <div key={index} className="admin-sale-container">
                        <label className="admin-sale-number">
                          Sale {index + 1}: {sale.name}
                        </label>
                        <FormRow>
                          <FormInput
                            label={`Name`}
                            type="text"
                            value={sale.name}
                            onChange={handleSalesNameChange}
                            dataIndex={index}
                          />

                          <FormInput
                            label={`Sale Discount (%)`}
                            type="number"
                            min={0}
                            value={String(sale.discount)}
                            onChange={handleSalesDiscountChange}
                            dataIndex={index}
                          />
                        </FormRow>

                        <FormInput
                          label={`Description`}
                          type="textarea"
                          value={sale.description}
                          onChange={handleSalesDescriptionChange}
                          dataIndex={index}
                          rows={3}
                        />

                        <FormInput
                          label="Activate Sale"
                          type="radio"
                          name={`enabled-${index}`}
                          options={[
                            {
                              displayValue: "Yes",
                              value: true,
                            },
                            {
                              displayValue: "No",
                              value: false,
                            },
                          ]}
                          value={sale.enabled}
                          dataIndex={index}
                          onChange={handleSalesRadioChange}
                        />

                        {sale.items && sale.items.length > 0 && (
                          <>
                            <label className="admin-sales-label-text">
                              Items in Sale:
                            </label>
                            <div className="admin-sales-items-in-sale">
                              {sale.items?.map((item, itemIndex) => (
                                <div
                                  key={`sale-${index}-item-${itemIndex}`}
                                  className="admin-sales-current-item-in-sale"
                                >
                                  <div className="admin-item-image-sale">
                                    <CldImage
                                      src={item.image}
                                      alt={item.title}
                                      fill
                                    />
                                  </div>
                                  <div className="admin-item-title-sale">
                                    {item.title}
                                  </div>
                                  <button
                                    type="button"
                                    className="admin-sales-remove-item-button"
                                    onClick={() =>
                                      handleRemoveItemFromExistingSale(
                                        index,
                                        itemIndex
                                      )
                                    }
                                  >
                                    <FaTrashCan />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="admin-sales-search-bar-container">
                          <FormInput
                            label={
                              <>
                                <FaMagnifyingGlass /> Add Item to Sale
                              </>
                            }
                            type="text"
                            value={searchTermExistingSale}
                            onChange={(e) =>
                              handleSearchInputChangeExistingSale(e, index)
                            }
                          />
                          {searchLoading && <div>Searching...</div>}
                          {isDropdownOpenExistingSale &&
                            currentExistingSaleIndex === index &&
                            searchResultsExistingSale.length > 0 && (
                              <div
                                style={dropdownStyles}
                                className="admin-search-dropdown-existing"
                              >
                                {searchResultsExistingSale.map((item) => (
                                  <div
                                    key={item._id}
                                    style={dropdownItemStyles}
                                    className="admin-search-dropdown-item"
                                    onClick={() =>
                                      handleAddItemToExistingSale(item)
                                    }
                                  >
                                    {item.title}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>

                        <button
                          type="button"
                          className="admin-sales-remove-button"
                          onClick={() => handleRemoveSale(index)}
                        >
                          <FaTrashCan /> &nbsp; Remove Sale
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Category Sales */}
                {settingsData.categorysales.length > 0 && (
                  <div className="admin-sales-current">
                    <label className="admin-sales-label">
                      Current Category Sales:
                    </label>
                    <div className="admin-sales-text">
                      You can edit category sales by clicking the fields and
                      changing the text.
                    </div>
                    {settingsData.categorysales.map((sale, index) => (
                      <div
                        key={`category-sale-${index}`}
                        className="admin-sale-container"
                      >
                        <label className="admin-sale-number">
                          Category Sale {index + 1}: {sale.name}
                        </label>
                        <FormRow>
                          <FormInput
                            label={`Name`}
                            type="text"
                            name="name"
                            value={sale.name}
                            onChange={(e) =>
                              handleExistingCategorySaleChange(e, index)
                            }
                          />
                          <FormInput
                            label={`Discount (%)`}
                            type="number"
                            min={0}
                            name="discount"
                            value={String(sale.discount)}
                            onChange={(e) =>
                              handleExistingCategorySaleChange(e, index)
                            }
                          />
                        </FormRow>
                        <FormInput
                          label={`Description`}
                          type="textarea"
                          name="description"
                          value={sale.description}
                          onChange={(e) =>
                            handleExistingCategorySaleChange(e, index)
                          }
                          rows={3}
                        />
                        <FormInput
                          label="Select Category"
                          type="dropdown"
                          name="category"
                          defaultOption="Selct an option..."
                          options={availableCategories.map((cat) => cat.name)}
                          value={sale.category}
                          onChange={(e) =>
                            handleExistingCategorySaleCategoryChange(e, index)
                          }
                        />
                        {sale.category &&
                          getSubCategoriesForCategory(sale.category).length >
                            0 && (
                            <div className="admin-sales-subcategories-container">
                              <label className="admin-sales-label-text">
                                Select Sub-Categories:
                              </label>
                              {getSubCategoriesForCategory(sale.category).map(
                                (subCat, i) => (
                                  <div
                                    key={`${subCat}-${i}`}
                                    className="admin-sales-checkbox-item"
                                  >
                                    <input
                                      type="checkbox"
                                      id={`existing-subcat-${index}-${subCat}`}
                                      value={subCat}
                                      checked={sale.subCategories.includes(
                                        subCat
                                      )}
                                      onChange={() =>
                                        handleExistingCategorySaleSubCategoryChange(
                                          {
                                            target: {
                                              value: subCat,
                                              checked:
                                                !sale.subCategories.includes(
                                                  subCat
                                                ),
                                            },
                                          },
                                          index
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`existing-subcat-${index}-${subCat}`}
                                    >
                                      {subCat}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        <FormInput
                          label="Activate Sale"
                          type="radio"
                          name={`category-enabled-${index}`}
                          options={[
                            { displayValue: "Yes", value: true },
                            { displayValue: "No", value: false },
                          ]}
                          value={sale.enabled}
                          onChange={(e) =>
                            handleExistingCategorySaleRadioChange(e, index)
                          }
                        />
                        <button
                          type="button"
                          className="admin-sales-remove-button"
                          onClick={() => handleRemoveCategorySale(index)}
                        >
                          <FaTrashCan /> &nbsp; Remove Category Sale
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {settingsChanged && (
                  <button
                    disabled={buttonLoading}
                    type="submit"
                    className="admin-sales-save-button"
                    onClick={handleSubmit}
                  >
                    {!buttonLoading ? "Save Changes" : "Loading..."}
                  </button>
                )}
                {changeErrors.length > 0 && (
                  <ErrorContainer errors={changeErrors} />
                )}
                <div className="admin-sales-add">
                  <label className="admin-sales-label">Add A New Sale:</label>
                  <div className="admin-sales-text">
                    Fill out the information and click the button labelled "Add
                    New Sale" to add a new sale.
                  </div>
                  <FormRow>
                    <FormInput
                      label="New Sale Name"
                      type="text"
                      value={newSale.name}
                      onChange={(e) =>
                        setNewSale({ ...newSale, name: e.target.value })
                      }
                    />
                    <FormInput
                      label="New Sale Discount (%)"
                      type="number"
                      min={0}
                      value={String(newSale.discount)}
                      onChange={(e) =>
                        setNewSale({
                          ...newSale,
                          discount: parseFloat(e.target.value), // Ensure discount is a number
                        })
                      }
                    />
                  </FormRow>
                  <FormInput
                    label="New Sale Description"
                    type="textarea"
                    value={newSale.description}
                    onChange={(e) =>
                      setNewSale({ ...newSale, description: e.target.value })
                    }
                    rows={3}
                  />
                  <label className="admin-sales-label">
                    Items in New Sale:
                  </label>
                  <div className="admin-sales-items-in-sale">
                    {newSale.items &&
                      newSale.items?.map((item, index) => (
                        <div
                          key={`new-sale-item-${item._id}`} // Use item._id for key
                          className="admin-sales-item-in-sale"
                        >
                          <div className="admin-item-image-sale">
                            <CldImage src={item.image} alt={item.title} fill />
                          </div>
                          <div className="admin-item-title-sale">
                            {item.title}
                          </div>
                          <button
                            type="button"
                            className="admin-sales-remove-item-button"
                            onClick={() => handleRemoveItemFromNewSale(index)}
                          >
                            <FaTrashCan />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="admin-sales-search-bar-container">
                    <FormInput
                      label={
                        <>
                          <FaMagnifyingGlass /> Add Item to New Sale
                        </>
                      }
                      type="text"
                      value={searchTermNewSale}
                      onChange={handleSearchInputChangeNewSale}
                    />
                    {searchLoading && (
                      <div
                        style={dropdownStyles}
                        className="admin-search-dropdown-new"
                      >
                        Searching...
                      </div>
                    )}
                    {isDropdownOpenNewSale &&
                      searchResultsNewSale.length > 0 && (
                        <div
                          style={dropdownStyles}
                          className="admin-search-dropdown-new"
                        >
                          {searchResultsNewSale.map((item) => (
                            <div
                              key={item._id}
                              style={dropdownItemStyles}
                              className="admin-search-dropdown-item"
                              onClick={() => handleAddItemToSale(item)}
                            >
                              {item.title}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <button
                    disabled={buttonLoading}
                    type="button"
                    className="admin-sales-save-button"
                    onClick={handleAddSale}
                  >
                    {!buttonLoading ? "Add New Sale" : "Loading..."}
                  </button>
                  {addErrors.length > 0 && (
                    <ErrorContainer errors={addErrors} />
                  )}
                </div>

                {/* Add New Category Sale Section */}
                <div className="admin-sales-add admin-cat-sales-add">
                  <label className="admin-sales-label">
                    Add A New Category Sale:
                  </label>
                  <div className="admin-sales-text">
                    Define a new sale that applies to specific categories and
                    their sub-categories.
                  </div>
                  <FormRow>
                    <FormInput
                      label="Category Sale Name"
                      type="text"
                      name="name"
                      value={newCategorySale.name}
                      onChange={handleNewCategorySaleChange}
                    />
                    <FormInput
                      label="Category Sale Discount (%)"
                      type="number"
                      min={0}
                      name="discount"
                      value={String(newCategorySale.discount)}
                      onChange={(e) =>
                        setNewCategorySale({
                          ...newCategorySale,
                          discount: parseFloat(e.target.value),
                        })
                      }
                    />
                  </FormRow>
                  <FormInput
                    label="Category Sale Description"
                    type="textarea"
                    name="description"
                    value={newCategorySale.description}
                    onChange={handleNewCategorySaleChange}
                    rows={3}
                  />
                  <FormInput
                    label="Select Category"
                    type="dropdown"
                    name="category"
                    defaultOption={"Selct an option..."}
                    options={availableCategories.map((cat) => cat.name)}
                    value={newCategorySale.category}
                    onChange={handleNewCategorySaleCategoryChange}
                  />
                  {newCategorySale.category &&
                    getSubCategoriesForCategory(newCategorySale.category)
                      .length > 0 && (
                      <div className="admin-sales-subcategories-container">
                        <label className="admin-sales-label-text">
                          Select Sub-Categories:
                        </label>
                        {getSubCategoriesForCategory(
                          newCategorySale.category
                        ).map((subCat, i) => (
                          <div
                            key={`${subCat}-${i}`}
                            className="admin-sales-checkbox-item"
                          >
                            <input
                              type="checkbox"
                              id={`new-subcat-${subCat}`}
                              value={subCat}
                              checked={newCategorySale.subCategories.includes(
                                subCat
                              )}
                              onChange={handleNewCategorySaleSubCategoryChange}
                            />
                            <label htmlFor={`new-subcat-${subCat}`}>
                              {subCat}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  <FormInput
                    label="Activate Category Sale"
                    type="radio"
                    name="enabled"
                    options={[
                      { displayValue: "Yes", value: true },
                      { displayValue: "No", value: false },
                    ]}
                    value={newCategorySale.enabled}
                    onChange={(e) =>
                      setNewCategorySale({
                        ...newCategorySale,
                        enabled: e.target.value === "true",
                      })
                    }
                  />
                  <button
                    disabled={buttonLoading}
                    type="button"
                    className="admin-sales-save-button"
                    onClick={handleAddCategorySale}
                  >
                    {!buttonLoading ? "Add New Category Sale" : "Loading..."}
                  </button>
                  {addCategorySaleErrors.length > 0 && (
                    <ErrorContainer errors={addCategorySaleErrors} />
                  )}
                </div>
              </form>
              <form>
                {settingsData.sitesale && (
                  <div className="admin-sales-site-sale">
                    <label className="admin-sales-label">Site Wide Sale:</label>
                    <div className="admin-sales-text">
                      To apply a discount on all items fill information below
                      and then click save. Ensure the site wide sale is enabled
                      if you want the site wide discounts to apply. To turn off
                      the sale make sure the site wide sale is disabled.
                    </div>
                    <FormRow>
                      <FormInput
                        label="Sale Name"
                        type="text"
                        name="name"
                        value={settingsData.sitesale.name}
                        onChange={handleSiteWideSaleChange}
                      />
                      <FormInput
                        label="Sale Discount (%)"
                        min={0}
                        type="number"
                        name="discount"
                        value={settingsData.sitesale.discount}
                        onChange={handleSiteWideSaleChange}
                      />
                    </FormRow>
                    <FormInput
                      label="Sale Description"
                      type="textarea"
                      name="description"
                      value={settingsData.sitesale.description}
                      onChange={handleSiteWideSaleChange}
                      rows={3}
                    />
                    <FormInput
                      label="Activate Sale"
                      type="radio"
                      name="enabledsitesale"
                      options={[
                        {
                          displayValue: "Yes",
                          value: true,
                        },
                        {
                          displayValue: "No",
                          value: false,
                        },
                      ]}
                      value={settingsData.sitesale.enabled}
                      onChange={handleSiteWideSalesRadioChange}
                    />

                    <button
                      disabled={buttonLoading}
                      type="button"
                      className="admin-sales-save-button"
                      onClick={handleSiteSaleSubmit}
                    >
                      {!buttonLoading ? "Edit Site Wide Sale" : "Loading..."}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {errors.length > 0 && <ErrorContainer errors={errors} />}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
};

export default Sales;
