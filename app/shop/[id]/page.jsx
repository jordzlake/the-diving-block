"use client";
import { Loading } from "@/components/controls/loading/Loading";
import Slider from "@/components/sliders/Slider";
import { getProduct, getProducts } from "@/lib/productActions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext, useRef } from "react";
import "@/app/shop/[id]/item.css";
import { useParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { OrderContext } from "@/components/contexts/OrderContext";
import { Lightbox } from "@/components/controls/lightbox/Lightbox";
import { getSettings } from "@/lib/settingActions";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import parse from "html-react-parser";
import { CalculateSingleProductDiscount } from "@/components/calculations/CalculateProductDiscounts";
export const dynamic = "force-dynamic";

const Item = () => {
  const { id } = useParams();
  const lightboxRef = useRef(null);
  const { addItem } = useContext(OrderContext);

  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [activeImage, setActiveImage] = useState({ index: 0, image: "" });
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [selectedAttributeAmount, setSelectedAttributeAmount] = useState(1);
  const [selectedAttributeColor, setSelectedAttributeColor] = useState("");
  const [selectedAttributeSize, setSelectedAttributeSize] = useState("");
  const { cart, setCart } = useContext(OrderContext);
  const [activeCost, setActiveCost] = useState(undefined);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (typeof window) {
      window.scrollTo(0, 0);
    }
    (async () => {
      try {
        const res = await getProducts();
        const resProduct = await getProduct(id);
        setProducts(res);

        const settings = await getSettings();
        if (settings[0]) {
          const discountedItem = CalculateSingleProductDiscount(
            resProduct,
            settings[0]
          );
          setProduct(discountedItem);
          console.log(discountedItem);
          resProduct.image &&
            setActiveImage({ index: 0, image: product.image });
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddItem = () => {
    setButtonLoading(true);
    if (product) {
      const item = product;
      let color = "";
      if (item.colors.length > 0) {
        if (selectedAttributeColor) {
          color = selectedAttributeColor;
        } else {
          setErrors(["You need to select a color!"]);
          return;
        }
      }
      let size;
      if (item.sizes.length > 0) {
        if (selectedAttributeSize) {
          size = selectedAttributeSize;
        } else {
          setErrors(["You need to select a size!"]);
          return;
        }
      }
      const amount = selectedAttributeAmount;
      if (amount <= 0) {
        setErrors(["Size needs to be more than 0!"]);
        return;
      }
      const cartItemCost =
        product.discount && product.discount > 0
          ? (
              (activeCost
                ? Number(activeCost).toFixed(2)
                : Number(product.cost).toFixed(2)) *
              ((100 - product.discount) / 100)
            ).toFixed(2)
          : activeCost
          ? Number(activeCost).toFixed(2)
          : Number(product.cost).toFixed(2);
      const orderItemTotal = amount * cartItemCost;

      const orderItem = {
        item,
        color,
        size,
        amount,
        cartItemCost,
        orderItemTotal,
      };

      addItem(orderItem);
      setButtonLoading(false);
      router.push("/cart");
    } else {
      setButtonLoading(false);
      setErrors(["This product does not exist!"]);
    }
  };

  return (
    <main>
      <section className="item-container container">
        {Object.keys(product).length > 0 ? (
          <div className="item-wrapper">
            <div className="item-breadcrumb-container">
              <Link href="/shop">Shop</Link>
              <span className="item-breadcrumb-separator" />
              <Link href="/shop">Category</Link>
              <span className="item-breadcrumb-separator" />
              <Link href="/shop">Item</Link>
            </div>
            <div className="item-display-container">
              <div className="item-information-container">
                <div className="item-images-container">
                  <div
                    className="item-image-container"
                    onClick={() =>
                      lightboxRef.current?.openLightbox(
                        activeImage.image
                          ? activeImage.image
                          : product.image
                          ? product.image
                          : "404_lztxti.png"
                      )
                    }
                  >
                    <CldImage
                      src={`${
                        activeImage.image
                          ? activeImage.image
                          : product.image
                          ? product.image
                          : "404_lztxti.png"
                      }`}
                      fill
                      alt={product.title}
                      defaultImage="404_lztxti.png"
                    />
                  </div>
                  <div className="item-image-gallery">
                    <div
                      className={`${activeImage.index === 0 && "active"} 
                            item-gallery-image-container`}
                      onClick={(e) => {
                        setActiveImage({ index: 0, image: product.image });
                      }}
                    >
                      <CldImage
                        src={`${product.image ? product.image : "404_lztxti"}`}
                        fill
                        alt={product.title}
                        defaultImage="404_lztxti.png"
                      />
                    </div>
                    {product.galleryImages.length > 0 &&
                      product.galleryImages.map((gi, i) => (
                        <div
                          className={`${
                            i + 1 === activeImage.index && "active"
                          } 
                            item-gallery-image-container`}
                          onClick={() => {
                            setActiveImage({ index: i + 1, image: gi });
                          }}
                          key={gi}
                        >
                          <CldImage
                            src={`${gi ? gi : "404_lztxti"}`}
                            fill
                            alt={gi}
                            defaultImage="404_lztxti.png"
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="item-content-container">
                  <h1 className="item-content-title">{product.title}</h1>
                  <div className="item-content-separator" />
                  <div className="item-content-cost">
                    $
                    {product.discount && product.discount > 0
                      ? (
                          (activeCost
                            ? Number(activeCost).toFixed(2)
                            : Number(product.cost).toFixed(2)) *
                          ((100 - product.discount) / 100)
                        ).toFixed(2)
                      : activeCost
                      ? Number(activeCost).toFixed(2)
                      : Number(product.cost).toFixed(2)}
                  </div>
                  <form>
                    <div className="item-colors-container">
                      <span className="item-colors-text">Colors:</span>
                      <div className="item-colors">
                        {product.colors.map((color, i) => (
                          <div
                            onClick={() => {
                              setSelectedAttributeColor(color.name);
                              console.log(product.colorImageVariants);

                              if (product.colorImageVariants?.length > 0) {
                                const colorImage =
                                  product.colorImageVariants.find(
                                    (variant) => variant.color === color.name
                                  );
                                let index = 0;
                                if (
                                  colorImage &&
                                  colorImage.image != product.image
                                ) {
                                  product.galleryImages.find((img, i) => {
                                    if (img === colorImage.image) {
                                      console.log(i);
                                      index = i + 1;
                                    }
                                  });
                                }
                                console.log("col img", colorImage);
                                if (colorImage?.image) {
                                  setActiveImage({
                                    index: index,
                                    image: colorImage.image,
                                  });
                                }
                              }
                            }}
                            key={i}
                            style={{
                              backgroundColor:
                                selectedAttributeColor &&
                                selectedAttributeColor == color.name
                                  ? color.hexcode
                                  : "#FFF",
                            }}
                            className={`item-color  ${
                              selectedAttributeColor &&
                              selectedAttributeColor == color.name
                                ? "item-color-selected"
                                : ""
                            }
                          `}
                          >
                            <span className="item-color-name">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="item-sizes-container">
                      <span className="item-sizes">Sizes:</span>
                      <select
                        className="item-sizes-select"
                        name="size"
                        onChange={(e) => {
                          setSelectedAttributeSize(e.target.value);
                          if (product.sizeCostVariants.length > 0) {
                            const sizeFound = product.sizeCostVariants.find(
                              (sz) => sz.size == e.target.value
                            );
                            if (sizeFound) {
                              setActiveCost(sizeFound.cost);
                            } else {
                              setActiveCost(undefined);
                            }
                          }
                          console.log(e.target.value);
                        }}
                        id="size"
                      >
                        <option
                          name="size"
                          value={""}
                          className={`item-color ${
                            selectedAttributeSize && selectedAttributeSize == ""
                              ? "item-size-selected"
                              : ""
                          }`}
                        >
                          --
                        </option>
                        {product.sizes.map((size, i) => (
                          <option
                            key={i}
                            name="size"
                            value={size}
                            className={`item-color ${
                              selectedAttributeSize &&
                              selectedAttributeSize == size
                                ? "item-size-selected"
                                : ""
                            }`}
                          >
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="item-quantity-container">
                      <label htmlFor="quantity" className="item-quantity-text">
                        Select Quantity:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        max={product.quantity}
                        min={1}
                        value={selectedAttributeAmount}
                        onChange={(e) => {
                          setSelectedAttributeAmount(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="item-add-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddItem();
                      }}
                      disabled={buttonLoading}
                    >
                      {!buttonLoading ? "Add to basket" : "Loading..."}
                    </button>
                    <ErrorContainer errors={errors} />
                  </form>
                </div>
              </div>
              {product.description && (
                <div className="item-description-container">
                  <div className="item-description-title">Description</div>
                  <div className="item-description">
                    {parse(String(product.description))}
                  </div>
                </div>
              )}
            </div>
            <div className="item-related-products-container">
              <h2>Related Products</h2>
              {products.length > 0 ? (
                <div>
                  <Slider objects={products} />
                </div>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </section>
      {<Lightbox ref={lightboxRef} />}
    </main>
  );
};

export default Item;
