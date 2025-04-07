"use client";
import { Loading } from "@/components/controls/loading/Loading";
import Slider from "@/components/sliders/Slider";
import { getProduct, getProducts } from "@/lib/productActions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/components/controls/Contexts/CartProvider";
import "@/app/shop/[id]/item.css";
import { useParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
export const dynamic = "force-dynamic";

const Item = () => {
  const { id } = useParams();

  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAttributeColor, setSelectedAttributeColor] = useState("");
  const [selectedAttributeSize, setSelectedAttributeSize] = useState("");
  const { cart, setCart } = useContext(CartContext);

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
        console.log(resProduct);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

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
                <div className="item-image-container">
                  <CldImage
                    src={`${product.image ? product.image : "404_toij8l"}`}
                    fill
                    alt={product.title}
                    defaultImage="404_toij8l.png"
                  />
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
                            className={`item-color  ${
                              selectedAttributeColor &&
                              selectedAttributeColor == color.name
                                ? "item-color-selected"
                                : ""
                            }
                          `}
                          >
                            {color.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="item-sizes-container">
                      <span className="item-sizes">Sizes:</span>
                      <select
                        className="item-sizes-select"
                        name="size"
                        id="size"
                      >
                        {product.sizes.map((size, i) => (
                          <option
                            key={i}
                            name="size"
                            onClick={(e) =>
                              setSelectedAttributeSize(e.target.value)
                            }
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
                        defaultValue={1}
                        name="quantity"
                        max={product.quantity}
                        min={1}
                      />
                    </div>
                    <button className="item-add-btn">Add to basket</button>
                  </form>
                  <div className="item-description"></div>
                </div>
              </div>
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
    </main>
  );
};

export default Item;
