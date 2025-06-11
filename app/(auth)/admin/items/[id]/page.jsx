"use client";

import "../../admin.css";
import "./item.css";
import { useEffect, useRef, useState } from "react";
import { updateProduct } from "@/lib/productActions";
import {
  FaArrowLeft,
  FaArrowRight,
  FaImagePortrait,
  FaPlus,
  FaTrashCan,
  FaUpload,
} from "react-icons/fa6";
import { CldImage } from "next-cloudinary";
import { Loading } from "@/components/controls/loading/Loading";
import { getProduct } from "@/lib/productActions";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { getSettings } from "@/lib/settingActions";
import { deleteCloudinaryItems } from "@/lib/cloudinary";
import { useParams } from "next/navigation";
import { Lightbox } from "@/components/controls/lightbox/Lightbox";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import { productSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import dynamic from "next/dynamic";

const CldUploadWidget = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldUploadWidget),
  {
    ssr: false, // Ensure the component is not rendered on the server
    loading: () => <p>Loading upload widget...</p>, // Optional loading indicator
  }
);

const Item = () => {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState(["XS", "S", "M", "L", "XL"]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    cost: 0,
    spec: "",
    quantity: "",
    description: "",
    category: categories[0] || "", // Default to the first category if available
    subCategory: "None",
    sizes: [],
    brand: "",
    dimensions: "",
    weight: "",
    colors: [],
    notes: "",
    tags: "",
    image: "",
    galleryImages: [],
    colorImageVariants: [],
    sizeCostVariants: [],
    additionalCategories: [],
  });
  const [colorInput, setColorInput] = useState("#000000");
  const [colorName, setColorName] = useState("");
  const [presetColors, setPresetColors] = useState([]);
  const [selectedPresetColor, setSelectedPresetColor] = useState("");
  const [errors, setErrors] = useState([]);
  const [settings, setSettings] = useState({});
  const [upload, setUpload] = useState("");
  const [uploadGallery, setUploadGallery] = useState([]);
  const [colorImageVariant, setColorImageVariant] = useState({
    color: "",
    image: "",
  });
  const [sizeCostVariant, setSizeCostVariant] = useState({
    size: "",
    cost: 0,
  });
  const [showSelectionImages, setShowSelectionImages] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [additionalCategory, setAdditionalCategory] = useState({
    category: "",
    subCategory: "",
  });
  const [additionalSubCategories, setAdditionalSubCategories] = useState([]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const product = await getProduct(id);
          setItem(product);
          setFormData({
            ...product,
            colors: product.colors || [],
          });
          const settings = await getSettings();
          setSettings(settings[0]);
          const itemCategories = settings[0].categories.map((cat) => cat.name);
          const itemSizes = settings[0].sizes || [];
          setCategories(itemCategories);
          setSubCategories(settings[0].categories[0].subCategories); // Default to first category's subcategories
          setAdditionalCategory({
            ...additionalCategory,
            category: settings[0].categories[0].name,
          });
          setPresetColors(settings[0].colors || []);
          setAdditionalSubCategories(settings[0].categories[0].subCategories);
          itemSizes.length > 0 && setSizes(itemSizes);

          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setFormData({ ...formData, image: upload });
  }, [upload]);

  useEffect(() => {
    setFormData({ ...formData, galleryImages: [...uploadGallery] });
  }, [uploadGallery]);

  const lightboxRef = useRef(null);
  const galleryRef = useRef([]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryObj = settings.categories.find(
      (cat) => cat.name === selectedCategory
    );
    console.log("selectedCat:", selectedCategory);
    setSubCategories(
      selectedCategoryObj ? selectedCategoryObj.subCategories : []
    );
    setFormData({ ...formData, category: selectedCategory, subCategory: "" }); // Reset subcategory
  };

  const handleAdditionalCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selectedCategoryObj = settings.categories.find(
      (cat) => cat.name === selectedCategory
    );
    console.log("selectedCat:", selectedCategory);
    setAdditionalSubCategories(
      selectedCategoryObj ? selectedCategoryObj.subCategories : []
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddColor = () => {
    if (colorInput && colorName) {
      const isDuplicate = formData.colors.some(
        (color) =>
          color.hexcode.toUpperCase() === colorInput.toUpperCase() ||
          color.name === colorName
      );
      if (!isDuplicate) {
        setFormData({
          ...formData,
          colors: [
            ...formData.colors,
            { name: colorName, hexcode: colorInput.toUpperCase() },
          ],
        });
        setColorInput("#000000");
        setColorName("");
        setSelectedPresetColor("");
      } else {
        toast.error("This color or color name already exists!");
      }
    }
  };

  const handleUsePresetColor = (e) => {
    const selectedHex = e.target.value;
    const selectedColor = presetColors.find(
      (color) => color.hexcode === selectedHex
    );
    if (selectedColor) {
      setColorInput(selectedColor.hexcode);
      setColorName(selectedColor.name);
      setSelectedPresetColor(selectedHex); // Set selected preset for dropdown
    } else {
      // If "Select a preset" or an invalid option is chosen, clear the inputs
      setColorInput("#000000");
      setColorName("");
      setSelectedPresetColor("");
    }
  };

  const handleAddAdditionalCategory = () => {
    if (additionalCategory.category) {
      console.log("here");
      const isDuplicate = formData.additionalCategories.some(
        (addCategory) =>
          addCategory.category === additionalCategory.category &&
          addCategory.subCategory === additionalCategory.subCategory
      );

      if (!isDuplicate) {
        setFormData({
          ...formData,
          additionalCategories: [
            ...formData.additionalCategories,
            {
              category: additionalCategory.category,
              subCategory: additionalCategory.subCategory,
            },
          ],
        });
        console.log(formData.additionalCategories);
        setAdditionalCategory({
          ...additionalCategory,
          subCategory: "",
        });
      } else {
        toast.error("This additional category already exists!");
      }
    }
  };

  const handleRemoveColor = (index) => {
    const newColorArray = formData.colors.filter((_, idx) => idx !== index);
    setFormData({ ...formData, colors: newColorArray });
  };

  const handleAddColorImageVariant = () => {
    if (colorImageVariant.color && colorImageVariant.image) {
      const isDuplicate = formData.colorImageVariants.some(
        (variant) =>
          variant.color.toUpperCase() === colorImageVariant.color.toUpperCase()
      );
      if (!isDuplicate) {
        setFormData({
          ...formData,
          colorImageVariants: [
            ...formData.colorImageVariants,
            colorImageVariant,
          ],
        });
        setColorImageVariant({ color: "", image: "" });
      } else {
        toast.error("This color already has a variant!");
      }
    } else {
      toast.error("Please ensure a color and image are selected");
    }
  };

  const handleRemoveColorImageVariant = (index) => {
    const newColorImageVariantArray = formData.colorImageVariants.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, colorImageVariants: newColorImageVariantArray });
  };

  const handleAddSizeCostVariant = () => {
    if (sizeCostVariant.size && sizeCostVariant.cost) {
      const isDuplicate = formData.sizeCostVariants.some(
        (variant) =>
          variant.size.toUpperCase() === sizeCostVariant.size.toUpperCase()
      );
      if (!isDuplicate) {
        setFormData({
          ...formData,
          sizeCostVariants: [...formData.sizeCostVariants, sizeCostVariant],
        });
        setSizeCostVariant({ size: "", cost: 0 });
      } else {
        toast.error("This size already has a variant!");
      }
    } else {
      toast.error("Please ensure a size and cost are entered");
    }
  };

  const handleRemoveSizeCostVariant = (index) => {
    const newSizeCostVariantArray = formData.sizeCostVariants.filter(
      (_, idx) => idx !== index
    );
    setFormData({ ...formData, sizeCostVariants: newSizeCostVariantArray });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "sizes") {
      const updatedSizes = checked
        ? [...(formData.sizes || []), value]
        : formData.sizes?.filter((s) => s !== value) || [];
      setFormData({ ...formData, sizes: updatedSizes });
    }
  };

  const handleGalleryImageShift = (direction, index) => {
    if (direction == "left") {
      let arr = formData.galleryImages;
      const item = arr[index];
      arr.splice(index, 1);
      arr.splice(index - 1, 0, item);
      setFormData({ ...formData, galleryImages: arr });
    } else {
      let arr = formData.galleryImages;
      const item = arr[index];
      arr.splice(index, 1);
      arr.splice(index + 1, 0, item);
      setFormData({ ...formData, galleryImages: arr });
    }
  };

  const handleGalleryImageDelete = async (img, index) => {
    let arr = formData.galleryImages;
    await deleteCloudinaryItems([img]);
    arr.splice(index, 1);
    setFormData({ ...formData, galleryImages: arr });
  };

  const handleImageDelete = async (img) => {
    await deleteCloudinaryItems([img]);
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = async (e) => {
    setButtonLoading(false);
    e.preventDefault();
    console.log("Form data:", formData);
    const data = { id: id, formData: formData };
    const result = await updateProduct(data);
    if (result.errors) {
      setButtonLoading(false);
      setErrors(result.errors);
      return;
    }
    toast.success("Product Updated Successfully");
    setButtonLoading(false);
    router.push("/admin/items");
  };

  return (
    <main className="admin-items admin-section">
      <ScrollToTop />
      <AdminNavbar />
      <div className="admin-container">
        {!loading ? (
          item ? (
            <div className="admin-item-content">
              <div className="admin-item-title">Editing {item.title}</div>

              {/* General Information Section */}
              <form className="admin-item-form" onSubmit={handleSubmit}>
                <FormRow>
                  <FormInput
                    label="Product Name"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required={true}
                    validationSchema={productSchema.shape.title}
                  />
                  <FormInput
                    label="Product Cost"
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required={true}
                    validationSchema={productSchema.shape.cost}
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="Special Text for Promotion"
                    type="text"
                    name="spec"
                    value={formData.spec}
                    onChange={handleChange}
                    required={false}
                    validationSchema={productSchema.shape.specialText}
                  />
                  <FormInput
                    label="Amount in Stock"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required={true}
                    validationSchema={productSchema.shape.quantity}
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="Product Description"
                    type="textarea"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required={true}
                    validationSchema={productSchema.shape.description}
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="Select the Product Category"
                    type="dropdown"
                    name="category"
                    value={formData.category || categories[0]}
                    onChange={handleCategoryChange}
                    options={categories || []}
                    required={true}
                  />
                  <FormInput
                    label="Select the Product Sub-Category"
                    type="dropdown"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    options={subCategories || []}
                    defaultOption={"None"}
                    required={true}
                  />
                </FormRow>

                <label className="admin-item-label">
                  Additional Categories:
                </label>
                {formData.additionalCategories.length > 0 &&
                  formData.additionalCategories.map((addcat, i) => (
                    <FormRow key={i}>
                      <div>{i + 1}.</div>
                      <div>Category: {addcat.category}</div>
                      <div>Subcategory: {addcat.subCategory}</div>
                      <div
                        onClick={(e) => {
                          const newData = formData.additionalCategories.filter(
                            (cat, index) => index !== i
                          );
                          setFormData({
                            ...formData,
                            additionalCategories: newData,
                          });
                        }}
                        className="admin-item-delete-cat"
                      >
                        delete
                      </div>
                    </FormRow>
                  ))}

                <div className="admin-item-color-input">
                  <FormRow>
                    <FormInput
                      label="Select an additional Category (Optional)"
                      type="dropdown"
                      name="additionalCategory"
                      value={additionalCategory.category}
                      onChange={(e) => {
                        setAdditionalCategory({
                          ...additionalCategory,
                          category: e.target.value,
                        });
                        handleAdditionalCategoryChange(e);
                      }}
                      options={categories || []}
                    />
                    <FormInput
                      label="Select an additional Sub-Category"
                      type="dropdown"
                      name="additionalsubCategory"
                      value={additionalCategory.subCategory}
                      onChange={(e) =>
                        setAdditionalCategory({
                          ...additionalCategory,
                          subCategory: e.target.value,
                        })
                      }
                      options={additionalSubCategories || []}
                      defaultOption={"None"}
                    />
                  </FormRow>
                  <button
                    type="button"
                    onClick={handleAddAdditionalCategory}
                    className="add-color-button"
                  >
                    <FaPlus />
                  </button>
                </div>

                <FormRow>
                  <FormInput
                    label="Select the Sizes of the Product"
                    type="checkbox"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleCheckboxChange}
                    checkedOptions={formData.sizes || []}
                    options={sizes}
                    required={false}
                  />
                  <FormInput
                    label="Brand associated with Product"
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required={false}
                  />
                </FormRow>
                <FormRow>
                  <FormInput
                    label="Enter the Dimensions of the Product"
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    required={false}
                  />
                  <FormInput
                    label="Enter the Weight of the Product"
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required={false}
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="Tags"
                    description={
                      "Please enter the tags for the product to help with searching. Separate each with a comma."
                    }
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    required={false}
                  />
                </FormRow>

                <FormRow>
                  <FormInput
                    label="Additional Notes"
                    type="textarea"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    required={false}
                  />
                </FormRow>

                <div className="admin-item-form-row">
                  <div className="admin-item-form-group">
                    <label className="admin-item-label">Colors:</label>

                    <div className="admin-item-color-input">
                      <input
                        type="text"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        placeholder="Color Name"
                        className="admin-item-input"
                      />
                      <input
                        type="color"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        className="admin-item-color-picker"
                      />
                      {/* New: Preset Color Selection */}
                      {presetColors.length > 0 && (
                        <div className="admin-item-color-input admin-item-preset-color-selection">
                          <FormInput
                            label="Use Preset Color"
                            type="dropdownplus"
                            name="presetColor"
                            value={selectedPresetColor}
                            onChange={handleUsePresetColor}
                            options={
                              presetColors.length > 0
                                ? presetColors.map((color) => ({
                                    value: color.hexcode,
                                    label: `${color.name} (${color.hexcode})`,
                                  }))
                                : []
                            }
                            defaultOption="Select a preset color"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="add-color-button"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Display added colors */}
                    <div className="admin-item-color-list">
                      {formData.colors.map((color, index) => (
                        <div
                          key={index}
                          className="admin-item-color-item"
                          style={{
                            backgroundColor: color.hexcode,
                            padding: "10px",
                            borderRadius: "5px",
                            color: "#fff",
                          }}
                        >
                          <p className="admin-item-color-text">
                            {color.name} ({color.hexcode})
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className="remove-color-button"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-item-form-section">
                  <div className="admin-item-form-title">Image Upload</div>
                  <div className="admin-item-form-row">
                    <div className="admin-item-form-image-group">
                      <div className="admin-item-image-controls">
                        <label className="admin-item-label">Main Image:</label>
                        {CldUploadWidget && (
                          <CldUploadWidget
                            uploadPreset="your-upload-preset"
                            onSuccess={(result, { widget }) => {
                              const img = result.info.public_id;
                              setUpload(img);
                              widget.close();
                            }}
                          >
                            {({ open }) => {
                              function handleMainOnClick() {
                                open();
                              }
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    !formData.image
                                      ? handleMainOnClick()
                                      : toast.error(
                                          "Delete the Main Image First!"
                                        );
                                  }}
                                  className="admin-item-upload-button"
                                >
                                  Upload Main Image <FaUpload />
                                </button>
                              );
                            }}
                          </CldUploadWidget>
                        )}
                      </div>
                      {formData.image ? (
                        <div className="admin-item-image">
                          <CldImage
                            src={formData.image}
                            fill
                            alt="Product Image"
                            className="admin-item-image-preview"
                            defaultImage="404_lztxti.png"
                          />

                          <div
                            className="admin-image-controls"
                            onClick={() =>
                              lightboxRef.current?.openLightbox(formData.image)
                            }
                          >
                            <div className="admin-image-controls-shelf">
                              <div
                                className={`admin-image-control admin-image-control-trash`}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await handleImageDelete(formData.image);
                                }}
                              >
                                <FaTrashCan />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-item-image">
                          No Image Found <FaImagePortrait />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-item-form-row">
                    <div className="admin-item-form-group">
                      <div className="admin-items-image-controls">
                        <label className="admin-item-label">
                          Gallery Images:
                        </label>
                        {CldUploadWidget && (
                          <CldUploadWidget
                            uploadPreset="your-upload-preset"
                            onSuccess={(result, { widget }) => {
                              const img = result.info.public_id;

                              setUploadGallery([...galleryRef.current, img]);
                              console.log(uploadGallery);
                              widget.close();
                            }}
                            multiple={false}
                          >
                            {({ open }) => {
                              function handleGalleryOnClick() {
                                open();
                              }
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    galleryRef.current = [
                                      ...formData.galleryImages,
                                    ];
                                    setUploadGallery(formData.galleryImages);
                                    /*formData.galleryImages.length < 3
                                    ? handleGalleryOnClick()
                                    : toast.error(
                                        "This product has 3 Gallery Images. Please delete one to upload."
                                      );*/
                                    handleGalleryOnClick();
                                  }}
                                  className="admin-item-upload-button"
                                >
                                  Upload Gallery Images <FaUpload />
                                </button>
                              );
                            }}
                          </CldUploadWidget>
                        )}
                      </div>
                      <div className="gallery-preview">
                        {formData.galleryImages.length > 0 ? (
                          formData.galleryImages.map((img, index) => (
                            <div key={index} className="admin-item-image">
                              <CldImage
                                src={img}
                                fill
                                alt={`Gallery Image ${index + 1}`}
                                className="admin-item-image-preview"
                                defaultImage="404_lztxti.png"
                                onClick={() =>
                                  lightboxRef.current?.openLightbox(img)
                                }
                              />
                              <div
                                className="admin-image-controls"
                                onClick={() =>
                                  lightboxRef.current?.openLightbox(img)
                                }
                              >
                                <div className="admin-image-controls-shelf">
                                  <div
                                    className={`admin-image-control ${
                                      index == 0 && "inactive"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      index != 0 &&
                                        handleGalleryImageShift("left", index);
                                    }}
                                  >
                                    <FaArrowLeft />
                                  </div>
                                  <div
                                    className={`admin-image-control ${
                                      index ==
                                        formData.galleryImages.length - 1 &&
                                      "inactive"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      index !=
                                        formData.galleryImages.length - 1 &&
                                        handleGalleryImageShift("right", index);
                                    }}
                                  >
                                    <FaArrowRight />
                                  </div>
                                  <div
                                    className={`admin-image-control admin-image-control-trash`}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      await handleGalleryImageDelete(
                                        img,
                                        index
                                      );
                                    }}
                                  >
                                    <FaTrashCan />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="admin-item-image">
                            No Images Found <FaImagePortrait />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-item-form-row">
                  <div className="admin-item-form-group">
                    <label className="admin-item-label">
                      Color Image Variants:
                    </label>

                    <div className="admin-item-color-variant-input">
                      <FormInput
                        label="Color to connect to Image"
                        type="dropdown"
                        name="colorVariantColor"
                        value={colorImageVariant.color}
                        onChange={(e) => {
                          setColorImageVariant({
                            ...colorImageVariant,
                            color: e.target.value,
                          });
                        }}
                        defaultOption={"Select Color"}
                        options={
                          formData.colors.map((color) => color.name) || []
                        }
                      />
                      <div
                        className="admin-image-selector-button"
                        onClick={() => {
                          setShowSelectionImages(true);
                        }}
                      >
                        Select Image
                      </div>
                      {colorImageVariant.image && (
                        <div className="admin-image-selected-image-container">
                          <div className="admin-image-selected-image">
                            <CldImage
                              src={colorImageVariant.image}
                              fill
                              alt="admin-selected-image"
                            />
                          </div>
                        </div>
                      )}
                      {showSelectionImages && (
                        <>
                          <div className="admin-image-selection-instructions">
                            Click an image to link to your selected color:
                          </div>
                          <div className="admin-image-selection">
                            {formData.image ? (
                              <div className="admin-image-selection-container">
                                <div
                                  className="admin-image-selection-image"
                                  onClick={() => {
                                    setColorImageVariant({
                                      ...colorImageVariant,
                                      image: formData.image,
                                    });
                                    setShowSelectionImages(false);
                                  }}
                                >
                                  <CldImage
                                    src={formData.image}
                                    fill
                                    alt="admin-main-image"
                                  />
                                </div>
                                {formData.galleryImages.map(
                                  (galleryImage, i) => (
                                    <div
                                      className="admin-image-selection-image"
                                      key={`sel${i}`}
                                      onClick={() => {
                                        setColorImageVariant({
                                          ...colorImageVariant,
                                          image: galleryImage,
                                        });
                                        setShowSelectionImages(false);
                                      }}
                                    >
                                      <CldImage
                                        src={galleryImage}
                                        fill
                                        alt="admin-selection-image"
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="admin-image-selection-container">
                                <div>Please Enter A Main Image First.</div>
                              </div>
                            )}
                          </div>
                          <div className="cancel-selection-container">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setShowSelectionImages(false);
                              }}
                              className="cancel-selection-button"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                      <div className="admin-variant-button-container">
                        <button
                          type="button"
                          onClick={handleAddColorImageVariant}
                          className="admin-variant-color-button"
                        >
                          Add Color/Image Variant
                        </button>
                      </div>
                    </div>

                    {/* Display added image variants */}
                    <div className="admin-item-color-list">
                      {formData.colorImageVariants.map((variant, index) => (
                        <div
                          key={index}
                          className="admin-item-color-item-variant"
                        >
                          <p className="admin-item-color-text-variant">
                            {variant.color}
                          </p>
                          <div className="admin-image-selection-image">
                            <CldImage
                              src={variant.image}
                              fill
                              alt="admin-selected-image"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveColorImageVariant(index)}
                            className="remove-color-button-variant"
                          >
                            Remove Color Image Variation
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="admin-item-form-row">
                  <div className="admin-item-form-group">
                    <label className="admin-item-label">
                      Size Cost Variants:
                    </label>

                    <div className="admin-item-color-variant-input">
                      <FormInput
                        label="Select size to vary price"
                        type="dropdown"
                        name="colorVariantColor"
                        value={sizeCostVariant.size}
                        onChange={(e) => {
                          setSizeCostVariant({
                            ...sizeCostVariant,
                            size: e.target.value,
                          });
                        }}
                        defaultOption={"Select Size"}
                        options={sizes || []}
                      />

                      <FormInput
                        label="Enter Cost for selected size"
                        type="number"
                        name="cost"
                        value={sizeCostVariant.cost}
                        onChange={(e) => {
                          setSizeCostVariant({
                            ...sizeCostVariant,
                            cost: e.target.value,
                          });
                        }}
                        validationSchema={productSchema.shape.cost}
                      />

                      <div className="admin-variant-button-container">
                        <button
                          type="button"
                          onClick={handleAddSizeCostVariant}
                          className="admin-variant-color-button"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Display added image variants */}
                    <div className="admin-item-color-list">
                      {formData.sizeCostVariants.map((variant, index) => (
                        <div
                          key={index}
                          className="admin-item-color-item-variant"
                        >
                          <p className="admin-item-color-text-variant">
                            {variant.size}
                          </p>
                          <p className="admin-item-color-text-variant">
                            $ {Number(variant.cost).toFixed(2)}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleRemoveSizeCostVariant(index)}
                            className="remove-color-button-variant"
                          >
                            Remove Size Cost Variant
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {}

                <button
                  disabled={buttonLoading}
                  type="submit"
                  className="admin-item-complete-button"
                >
                  {!buttonLoading ? "Save Changes" : "Loading..."}
                </button>
              </form>
              <ErrorContainer errors={errors} />
            </div>
          ) : (
            <div className="admin-item-not-found">Item was not found</div>
          )
        ) : (
          <Loading />
        )}
        {<Lightbox ref={lightboxRef} />}
      </div>
    </main>
  );
};

export default Item;
