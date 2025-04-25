"use client";

import "../admin.css";
import "./addItem.css";
import { useEffect, useRef, useState } from "react";
import { addProduct } from "@/lib/productActions";
import {
  FaArrowLeft,
  FaArrowRight,
  FaImagePortrait,
  FaPlus,
  FaTrashCan,
  FaUpload,
} from "react-icons/fa6";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Loading } from "@/components/controls/loading/Loading";
import AdminNavbar from "@/components/structure/adminNavbar/AdminNavbar";
import ScrollToTop from "@/components/blocks/scrollToTop/ScrollToTop";
import { getSettings } from "@/lib/settingActions";
import { deleteCloudinaryItems } from "@/lib/cloudinary";
import { Lightbox } from "@/components/controls/lightbox/Lightbox";
import FormInput from "@/components/controls/form/input/FormInput";
import FormRow from "@/components/controls/form/row/FormRow";
import { toast } from "react-toastify";
import { productSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const AddItem = () => {
  const router = useRouter();
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
  });
  const [colorInput, setColorInput] = useState("#000000");
  const [colorName, setColorName] = useState("");
  const [errors, setErrors] = useState([]);
  const [settings, setSettings] = useState({});
  const [upload, setUpload] = useState("");
  const [uploadGallery, setUploadGallery] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const settings = await getSettings();
        setSettings(settings[0]);
        console.log("settings", settings[0]);
        const itemCategories = settings[0].categories.map((cat) => cat.name);
        const itemSizes = settings[0].sizes || [];

        setCategories(itemCategories);
        setSubCategories(settings[0].categories[0].subCategories); // Default to first category's subcategories
        setFormData({
          ...formData,
          category: settings[0].categories[0].name || "",
          subCategory: settings[0].categories[0].subCategories[0] || "None",
        });
        console.log("subcategories", subCategories);
        itemSizes.length > 0 && setSizes(itemSizes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleGalleryUpload = (result) => {
    if ((formData.galleryImages || []).length < 3) {
      setFormData({
        ...formData,
        galleryImages: [
          ...(formData.galleryImages || []),
          result.info.public_id,
        ],
      });
    }
  };

  const handleAddColor = () => {
    if (colorInput && colorName && formData.colors.length < 5) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { name: colorName, hexcode: colorInput }],
      });
      setColorInput("#000000");
      setColorName("");
    }
  };

  const handleRemoveColor = (index) => {
    const newColorArray = formData.colors.filter((_, idx) => idx !== index);
    setFormData({ ...formData, colors: newColorArray });
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
    e.preventDefault();
    console.log("Form data:", formData);
    const data = { formData: formData };
    const result = await addProduct(data);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    toast.success("Added New Product Successfully");
    router.push("/admin/items");
  };

  return (
    <Suspense>
      <main className="admin-items admin-section">
        <ScrollToTop />
        <AdminNavbar />
        <div className="admin-container">
          {!loading ? (
            <div className="admin-item-content">
              <div className="admin-item-title">Adding a New Product</div>

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
                    label="Special Text for Promotion:"
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
                    value={formData.category}
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
                    label="Additional Notes:"
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
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="remove-color-button"
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
                          Gallery Images (Max 3):
                        </label>
                        <CldUploadWidget
                          uploadPreset="your-upload-preset"
                          onSuccess={(result, { widget }) => {
                            const img = result.info.public_id;
                            if (uploadGallery.length < 3)
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
                                onClick={(e) => {
                                  e.preventDefault();
                                  galleryRef.current = [
                                    ...formData.galleryImages,
                                  ];
                                  formData.galleryImages.length < 3
                                    ? handleGalleryOnClick()
                                    : toast.error(
                                        "This product has 3 Gallery Images. Please delete one to upload."
                                      );
                                }}
                                className="admin-item-upload-button"
                              >
                                Upload Gallery Images <FaUpload />
                              </button>
                            );
                          }}
                        </CldUploadWidget>
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

                <button type="submit" className="admin-item-complete-button">
                  Save Changes
                </button>
              </form>
              <ErrorContainer errors={errors} />
            </div>
          ) : (
            <Loading />
          )}
          {<Lightbox ref={lightboxRef} />}
        </div>
      </main>
    </Suspense>
  );
};

export default AddItem;
