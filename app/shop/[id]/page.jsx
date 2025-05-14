"use client";
import { Loading } from "@/components/controls/loading/Loading";
import Slider from "@/components/sliders/Slider";
import {
  getProduct,
  getProducts,
  getProductsParameters,
} from "@/lib/productActions";
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
import ProductSection from "@/components/main/productSection/ProductSection";
export const dynamic = "force-dynamic";

const Item = () => {
  const { id } = useParams();
  const lightboxRef = useRef(null);
  const { addItem, orderItems } = useContext(OrderContext);

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
  const [soldOut, setSoldOut] = useState(false);
  const [almostSoldOut, setAlmostSoldOut] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(0);

  useEffect(() => {
    if (typeof window) {
      window.scrollTo(0, 0);
    }
    (async () => {
      try {
        const resProduct = await getProduct(id);
        const res = await getProductsParameters({
          order: "desc",
          limit: 12,
          tags: resProduct.tags,
        });
        console.log(res);
        const resFiltered = res.filter((item) => item._id != resProduct._id);
        setProducts(resFiltered);

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

  useEffect(() => {
    if (product?.inventory?.length) {
      const allSizesZero = product.inventory.every((item) => item.amount === 0);
      setSoldOut(allSizesZero);

      const anySizeLessThan3 = product.inventory.every(
        (item) => item.amount < 3
      );
      setAlmostSoldOut(anySizeLessThan3);
    } else if (product?.sizes?.length) {
      const allSizesAvailable = product.sizes.every((size) => size);
      setAlmostSoldOut(false);
      setSoldOut(false);
    } else {
      setSoldOut(false);
      setAlmostSoldOut(false);
    }
  }, [product, selectedAttributeColor, selectedAttributeSize]);

  useEffect(() => {
    if (product?.inventory && selectedAttributeColor && selectedAttributeSize) {
      const inventoryItem = product.inventory.find(
        (item) =>
          item.color === selectedAttributeColor &&
          item.size === selectedAttributeSize
      );
      if (inventoryItem) {
        setMaxQuantity(inventoryItem.amount);
        setSelectedAttributeAmount(
          Math.min(selectedAttributeAmount, inventoryItem.amount)
        );
      } else {
        setMaxQuantity(0);
      }
    } else {
      setMaxQuantity(product?.quantity || 0);
    }
  }, [selectedAttributeColor, selectedAttributeSize, product]);

  const handleAddItem = () => {
    setButtonLoading(true);
    if (product) {
      const item = product;
      let color = "";
      if (item.colors.length > 0) {
        if (selectedAttributeColor) {
          color = selectedAttributeColor;
        } else {
          setButtonLoading(false);
          setErrors(["You need to select a color!"]);
          return;
        }
      }
      let size;
      if (item.sizes.length > 0) {
        if (selectedAttributeSize) {
          size = selectedAttributeSize;
        } else {
          setButtonLoading(false);
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
        productId: product._id,
        item,
        color,
        size,
        amount,
        cartItemCost,
        orderItemTotal,
        maxQuantity,
      };

      const isItemInOrder = orderItems.some(
        (existingItem) =>
          existingItem.productId === orderItem.productId &&
          existingItem.color === orderItem.color &&
          existingItem.size === orderItem.size
      );

      if (!isItemInOrder) {
        addItem(orderItem);
        setButtonLoading(false);
        router.push("/cart");
      } else {
        setButtonLoading(false);
        setErrors(["This item is already in your cart!"]);
      }
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
              <Link
                href={`/shop?category=${encodeURI(
                  String(product.category)
                )}&p=1`}
              >
                {String(product.category)}
              </Link>
              <span className="item-breadcrumb-separator" />
              <Link href="/">{String(product.title)}</Link>
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
                  {soldOut && <p className="text-red-500">Sold Out!</p>}
                  {almostSoldOut && (
                    <p className="text-yellow-500">Almost Sold Out!</p>
                  )}
                  <form>
                    <div className="item-colors-container">
                      <span className="item-colors-text">Colors:</span>
                      <div className="item-colors">
                        {product.colors.map((color, i) => (
                          <div
                            onClick={() => {
                              setSelectedAttributeColor(color.name);
                              setSelectedAttributeSize("");
                              setSelectedAttributeAmount(1);
                              console.log("size", selectedAttributeSize);
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
                            }`}
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
                          setSelectedAttributeAmount(1);
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
                        value={selectedAttributeSize}
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
                        {selectedAttributeColor &&
                        product.inventory &&
                        product.inventory?.length > 0 // Check for selectedAttributeColor AND product.inventory
                          ? product.inventory
                              .filter(
                                (item) =>
                                  item.color === selectedAttributeColor &&
                                  item.amount > 0
                              ) // Filter based on the selected color
                              .map((item, i) => (
                                <option
                                  key={i}
                                  name="size"
                                  value={item.size}
                                  className={`item-color ${
                                    selectedAttributeSize &&
                                    selectedAttributeSize == item.size
                                      ? "item-size-selected"
                                      : ""
                                  }`}
                                >
                                  {item.size}
                                </option>
                              ))
                          : product.sizes.map(
                              (
                                size,
                                i // Render all sizes if no color is selected.
                              ) => (
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
                              )
                            )}
                      </select>
                    </div>

                    <div className="item-quantity-container">
                      <label htmlFor="quantity" className="item-quantity-text">
                        Select Quantity:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        max={maxQuantity}
                        min={1}
                        value={selectedAttributeAmount}
                        onChange={(e) => {
                          const newAmount = parseInt(e.target.value, 10);
                          setSelectedAttributeAmount(
                            Math.min(newAmount, maxQuantity)
                          );
                        }}
                      />
                    </div>
                    <button
                      className="item-add-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddItem();
                      }}
                      disabled={buttonLoading || soldOut}
                    >
                      {!buttonLoading
                        ? soldOut
                          ? "Sold Out!"
                          : "Add to basket"
                        : "Loading..."}
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
              {products.length > 0 && (
                <>
                  <h2>Related Products</h2>
                  <br />
                  <br />
                  <div>
                    <Slider objects={products} />
                  </div>
                </>
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
