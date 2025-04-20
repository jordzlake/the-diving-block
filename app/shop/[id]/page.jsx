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
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
export const dynamic = "force-dynamic";

const Item = () => {
  const { id } = useParams();
  const lightboxRef = useRef(null);
  const { addItem } = useContext(OrderContext);

  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [selectedAttributeAmount, setSelectedAttributeAmount] = useState(1);
  const [selectedAttributeColor, setSelectedAttributeColor] = useState("");
  const [selectedAttributeSize, setSelectedAttributeSize] = useState("");
  const { cart, setCart } = useContext(OrderContext);

  useEffect(() => {
    if (typeof window) {
      window.scrollTo(0, 0);
    }
    (async () => {
      try {
        const res = await getProducts();
        const resProduct = await getProduct(id);
        setProducts(res);
        setProduct(resProduct);
        setLoading(false);
        resProduct.image && setActiveImage(resProduct.image);
        console.log(resProduct);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddItem = () => {
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
      const orderItemTotal = amount * item.cost;

      const orderItem = {
        item,
        color,
        size,
        amount,
        orderItemTotal,
      };

      addItem(orderItem);
      router.push("/cart");
    } else {
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
                        activeImage
                          ? activeImage
                          : product.image
                          ? product.image
                          : "404_toij8l.png"
                      )
                    }
                  >
                    <CldImage
                      src={`${
                        activeImage
                          ? activeImage
                          : product.image
                          ? product.image
                          : "404_toij8l.png"
                      }`}
                      fill
                      alt={product.title}
                      defaultImage="404_toij8l.png"
                    />
                  </div>
                  <div className="item-image-gallery">
                    <div
                      className={`${product.image === activeImage && "active"} 
                            item-gallery-image-container`}
                      onClick={(e) => {
                        setActiveImage(product.image);
                      }}
                    >
                      <CldImage
                        src={`${product.image ? product.image : "404_toij8l"}`}
                        fill
                        alt={product.title}
                        defaultImage="404_toij8l.png"
                      />
                    </div>
                    {product.galleryImages.length > 0 &&
                      product.galleryImages.map((gi, i) => (
                        <div
                          className={`${gi === activeImage && "active"} 
                            item-gallery-image-container`}
                          onClick={() => {
                            setActiveImage(gi);
                          }}
                          key={gi}
                        >
                          <CldImage
                            src={`${gi ? gi : "404_toij8l"}`}
                            fill
                            alt={gi}
                            defaultImage="404_toij8l.png"
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="item-content-container">
                  <h1 className="item-content-title">{product.title}</h1>
                  <div className="item-content-separator" />
                  <div className="item-content-cost">
                    ${Number(product.cost).toFixed(2)}
                  </div>
                  <form>
                    <div className="item-colors-container">
                      <span className="item-colors-text">Colors:</span>
                      <div className="item-colors">
                        {product.colors.map((color, i) => (
                          <div
                            onClick={() =>
                              setSelectedAttributeColor(color.name)
                            }
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
                    >
                      Add to basket
                    </button>
                    <ErrorContainer errors={errors} />
                  </form>
                </div>
              </div>
              {product.description && (
                <div className="item-description-container">
                  <div className="item-description-title">Description</div>
                  <div className="item-description">{product.description}</div>
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
