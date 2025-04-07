"use client";

import "../admin.css";
import "./settings.css"; // Create a new CSS file for settings
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { getSettings, updateSettings } from "@/lib/settingActions";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import { settingsSchema } from "@/lib/schema"; // Assuming you have this schema
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import { Loading } from "@/components/controls/loading/Loading";

export const dynamic = "force-dynamic";

const Settings = () => {
  const [settingsData, setSettingsData] = useState({
    categories: [],
    sizes: [],
    locations: [],
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);
  const [newSize, setNewSize] = useState("");
  const [newLocationType, setNewLocationType] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const fetchedSettings = await getSettings();
        if (fetchedSettings && fetchedSettings.length > 0) {
          setSettingsData(fetchedSettings[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
        toast.error("Error fetching settings.");
      }
    })();
  }, []);

  const handleCategoryNameChange = (e) => {
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedCategories = [...settingsData.categories];
    updatedCategories[index].name = value;
    setSettingsData({ ...settingsData, categories: updatedCategories });
  };

  const handleSubCategoryNameChange = (e) => {
    const { value } = e.target;
    const categoryIndex = parseInt(e.target.dataset.categoryIndex);
    const subCategoryIndex = parseInt(e.target.dataset.index);
    const updatedCategories = [...settingsData.categories];
    updatedCategories[categoryIndex].subCategories[subCategoryIndex] = value;
    setSettingsData({ ...settingsData, categories: updatedCategories });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setSettingsData({
        ...settingsData,
        categories: [
          ...settingsData.categories,
          { name: newCategoryName, subCategories: [] },
        ],
      });
      setNewCategoryName("");
    }
  };

  const handleAddSubCategory = (categoryIndex) => {
    if (newSubCategoryName.trim()) {
      const updatedCategories = [...settingsData.categories];
      updatedCategories[categoryIndex].subCategories.push(newSubCategoryName);
      setSettingsData({ ...settingsData, categories: updatedCategories });
      setNewSubCategoryName("");
      setSelectedCategoryIndex(-1); // Reset selected category
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = settingsData.categories.filter(
      (_, idx) => idx !== index
    );
    setSettingsData({ ...settingsData, categories: updatedCategories });
  };

  const handleRemoveSubCategory = (categoryIndex, subCategoryIndex) => {
    const updatedCategories = [...settingsData.categories];
    updatedCategories[categoryIndex].subCategories = updatedCategories[
      categoryIndex
    ].subCategories.filter((_, idx) => idx !== subCategoryIndex);
    setSettingsData({ ...settingsData, categories: updatedCategories });
  };

  const handleAddSize = () => {
    if (newSize.trim()) {
      setSettingsData({
        ...settingsData,
        sizes: [...(settingsData.sizes || []), newSize],
      });
      setNewSize("");
    }
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = (settingsData.sizes || []).filter(
      (_, idx) => idx !== index
    );
    setSettingsData({ ...settingsData, sizes: updatedSizes });
  };

  const handleLocationTypeChange = (e) => {
    const { value } = e.target;
    const index = parseInt(e.target.dataset.index);
    const updatedLocations = [...settingsData.locations];
    updatedLocations[index].type = value;
    setSettingsData({ ...settingsData, locations: updatedLocations });
  };

  const handleAddLocation = () => {
    if (newLocationType.trim()) {
      setSettingsData({
        ...settingsData,
        locations: [...settingsData.locations, { type: newLocationType }],
      });
      setNewLocationType("");
    }
  };

  const handleRemoveLocation = (index) => {
    const updatedLocations = settingsData.locations.filter(
      (_, idx) => idx !== index
    );
    setSettingsData({ ...settingsData, locations: updatedLocations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      settingsSchema.parse(settingsData); // Validate the entire settings data
      const result = await updateSettings(settingsData);
      if (result.errors) {
        setErrors(result.errors);
        toast.error("Error updating settings.");
      } else {
        toast.success("Settings updated successfully!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((err) => ({ message: err.message })));
      } else {
        console.error("Validation error:", error);
        toast.error("Something went wrong during validation.");
      }
    }
  };

  return (
    <main className="admin-settings admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container">
        {!loading ? (
          <div className="admin-settings-content">
            <div className="admin-settings-title">Edit Website Settings</div>
            <form className="admin-settings-form" onSubmit={handleSubmit}>
              {/* Categories */}
              <div className="admin-settings-group">
                <label className="admin-settings-label">Categories:</label>
                {settingsData.categories.map((category, index) => (
                  <div key={index} className="admin-settings-item">
                    <FormInput
                      label={`Category ${index + 1}`}
                      type="text"
                      value={category.name}
                      onChange={handleCategoryNameChange}
                      data-index={index}
                      // validationSchema={
                      //   settingsSchema.shape.categories.element.shape.name
                      // }
                    />
                    <button
                      type="button"
                      className="admin-settings-remove-button"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <FaTrashCan /> Remove
                    </button>

                    <div className="admin-settings-subcategories">
                      <label className="admin-settings-label sub-label">
                        Sub-Categories:
                      </label>
                      {category.subCategories.map((subCategory, subIndex) => (
                        <div key={subIndex} className="admin-settings-sub-item">
                          <FormInput
                            type="text"
                            value={subCategory}
                            onChange={handleSubCategoryNameChange}
                            data-category-index={index}
                            data-index={subIndex}
                          />
                          <button
                            type="button"
                            className="admin-settings-remove-button sub-button"
                            onClick={() =>
                              handleRemoveSubCategory(index, subIndex)
                            }
                          >
                            <FaTrashCan /> Remove
                          </button>
                        </div>
                      ))}
                      <div className="admin-settings-add-subcategory">
                        <FormInput
                          label="New Sub-Category"
                          type="text"
                          value={newSubCategoryName}
                          onChange={(e) =>
                            setNewSubCategoryName(e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="admin-settings-add-button"
                          onClick={() => handleAddSubCategory(index)}
                        >
                          <FaPlus /> Add Sub-Category
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="admin-settings-add-item">
                  <FormInput
                    label="New Category Name"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-settings-add-button"
                    onClick={handleAddCategory}
                  >
                    <FaPlus /> Add Category
                  </button>
                </div>
              </div>

              {/* Sizes */}
              <div className="admin-settings-group">
                <label className="admin-settings-label">Sizes:</label>
                <div className="admin-settings-array-container">
                  {(settingsData.sizes || []).map((size, index) => (
                    <div key={index} className="admin-settings-array-item">
                      <FormInput
                        type="text"
                        value={size}
                        onChange={(e) => {
                          const updatedSizes = [...(settingsData.sizes || [])];
                          updatedSizes[index] = e.target.value;
                          setSettingsData({
                            ...settingsData,
                            sizes: updatedSizes,
                          });
                        }}
                        // validationSchema={settingsSchema.shape.sizes?.element}
                      />
                      <button
                        type="button"
                        className="admin-settings-remove-button"
                        onClick={() => handleRemoveSize(index)}
                      >
                        <FaTrashCan /> Remove
                      </button>
                    </div>
                  ))}
                  <div className="admin-settings-add-item">
                    <FormInput
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      label="New Size"
                    />
                    <button
                      type="button"
                      className="admin-settings-add-button"
                      onClick={handleAddSize}
                    >
                      <FaPlus /> Add Size
                    </button>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="admin-settings-group">
                <label className="admin-settings-label">Locations:</label>
                {settingsData.locations.map((location, index) => (
                  <div key={index} className="admin-settings-item">
                    <FormInput
                      label={`Location Type ${index + 1}`}
                      type="text"
                      value={location}
                      onChange={handleLocationTypeChange}
                      data-index={index}
                      // validationSchema={
                      //   settingsSchema.shape.locations?.element.shape.type
                      // }
                    />
                    <button
                      type="button"
                      className="admin-settings-remove-button"
                      onClick={() => handleRemoveLocation(index)}
                    >
                      <FaTrashCan /> Remove
                    </button>
                  </div>
                ))}
                <div className="admin-settings-add-item">
                  <FormInput
                    label="New Location Type"
                    type="text"
                    value={newLocationType}
                    onChange={(e) => setNewLocationType(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-settings-add-button"
                    onClick={handleAddLocation}
                  >
                    <FaPlus /> Add Location
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-settings-save-button">
                Save Settings
              </button>
            </form>
            <ErrorContainer errors={errors} />
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
};

export default Settings;
