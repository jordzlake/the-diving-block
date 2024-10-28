"use client";
import { Loading } from "@/components/controls/loading/Loading";
import Slider from "@/components/sliders/Slider";
import { getProduct, getProducts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@/app/shop/[id]/item.css";

const Item = ({ params }) => {
  const { id } = params;
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  window.scrollTo(0, 0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        const resProduct = await getProduct(id);
        setProducts(res);
        setProduct(resProduct);
        setLoading(false);
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
                  <Image src={product.images[0].src} fill alt="" />
                </div>
                <div className="item-content-container">
                  <h1 className="item-content-title">{product.name}</h1>
                  <div className="item-content-separator" />
                  <div className="item-content-cost">$ {product.price}</div>
                  <form action="submit">
                    {product.attributes &&
                      product.attributes.some((obj) => obj.id === 2) && (
                        <div className="item-colors-container">
                          <span className="item-colors-text">Colors:</span>
                          <div className="item-colors">
                            {product.attributes
                              .find((obj) => obj.id === 2)
                              ?.options.map((color) => (
                                <div key={color} className="item-color">
                                  {color}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    {product.attributes &&
                      product.attributes.some((obj) => obj.id === 1) && (
                        <div className="item-sizes-container">
                          <span className="item-sizes">Sizes:</span>
                          <select
                            className="item-sizes-select"
                            name="size"
                            id="size"
                          >
                            {product.attributes
                              .find((obj) => obj.id === 1)
                              ?.options.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    <div className="item-quantity-container">
                      <label htmlFor="quantity" className="item-quantity-text">
                        Select Quantity:
                      </label>
                      <input
                        type="number"
                        defaultValue={1}
                        name="quantity"
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
