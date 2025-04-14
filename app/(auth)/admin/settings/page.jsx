"use client";

import "../admin.css";
import "./settings.css";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { getSettings, updateSettings } from "@/lib/settingActions";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import { settingsSchema } from "@/lib/schema";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import { Loading } from "@/components/controls/loading/Loading";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const Settings = () => {
  const router = useRouter();
  const [settingsData, setSettingsData] = useState({
    categories: [],
    sizes: [],
    locations: [],
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryNames, setNewSubCategoryNames] = useState([]);
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
          setNewSubCategoryNames(fetchedSettings[0].categories.map(() => ""));
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
      setNewSubCategoryNames([...newSubCategoryNames, ""]);
      setNewCategoryName("");
    }
  };

  const handleAddSubCategory = (categoryIndex) => {
    const subCategoryName = newSubCategoryNames[categoryIndex]?.trim();
    if (subCategoryName) {
      const updatedCategories = [...settingsData.categories];
      updatedCategories[categoryIndex].subCategories.push(subCategoryName);
      setSettingsData({ ...settingsData, categories: updatedCategories });

      const updatedInputs = [...newSubCategoryNames];
      updatedInputs[categoryIndex] = "";
      setNewSubCategoryNames(updatedInputs);
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = settingsData.categories.filter(
      (_, idx) => idx !== index
    );
    setSettingsData({ ...settingsData, categories: updatedCategories });
    setNewSubCategoryNames(newSubCategoryNames.filter((_, i) => i !== index));
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
    updatedLocations[index] = value;
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
    console.log("Form data:", settingsData);
    const data = { formData: settingsData };
    const result = await updateSettings(data);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    toast.success("Changed Settings Successfully");
    router.push("/admin/settings");
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
                    <div className="admin-settings-pair">
                      <FormInput
                        label={`Category ${index + 1}`}
                        type="text"
                        value={category.name}
                        onChange={handleCategoryNameChange}
                        dataIndex={index}
                      />
                      <button
                        type="button"
                        className="admin-settings-remove-button"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <FaTrashCan /> Remove
                      </button>
                    </div>

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
                            dataCategoryIndex={index}
                            dataIndex={subIndex}
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
                          value={newSubCategoryNames[index] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const updatedInputs = [...newSubCategoryNames];
                            updatedInputs[index] = value;
                            setNewSubCategoryNames(updatedInputs);
                          }}
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
                      dataIndex={index}
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
