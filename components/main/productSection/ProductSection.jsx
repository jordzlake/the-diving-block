"use client";

import "@/components/main/productSection/productSection.css";
import { ProductImages } from "@/lib/tempImages";
import Image from "next/image";
import StoreCard from "@/components/cards/store-card/Storecard";
import { Loading } from "@/components/controls/loading/Loading";
import { useRouter } from "next/navigation";
import { FaCaretRight, FaHeart } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/settingActions";
import { CalculateProductDiscounts } from "@/components/calculations/CalculateProductDiscounts";

const ProductSection = ({
  title,
  subtitle,
  content,
  buttonText,
  noImage = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState([]);
  useEffect(() => {
    content.length > 0 &&
      (async () => {
        try {
          setLoading(true);
          const settings = await getSettings();
          if (settings[0]) {
            const discountedItems = CalculateProductDiscounts(
              content,
              settings[0]
            );
            setNewContent(discountedItems);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
  }, [content]);

  return (
    <section className="product-section-container">
      {!loading ? (
        <>
          <div className="product-section-first">
            {!noImage && (
              <div className="product-section-info">
                <h2 className="product-section-title">{title}</h2>
                <div className="product-section-divider-container">
                  <div className="product-section-divider-left" />
                  <div className="product-section-icon-container">
                    <FaHeart />
                  </div>
                  <div className="product-section-divider-right" />
                </div>
              </div>
            )}
            {newContent.length > 0 ? (
              <div className="product-section-grid">
                {newContent.slice(0, 6).map((product, i) => (
                  <StoreCard
                    key={product._id}
                    spec={product.spec || undefined}
                    id={product._id}
                    image={product.image}
                    title={product.title}
                    cost={product.cost}
                    discount={product.discount}
                    category={product.category}
                    handleClick={() => router.push(`/shop/${product._id}`)}
                  />
                ))}
              </div>
            ) : content.length > 0 ? (
              <div className="product-section-grid">
                {content.slice(0, 6).map((product, i) => (
                  <StoreCard
                    key={product._id}
                    spec={product.spec || undefined}
                    id={product._id}
                    image={product.image}
                    title={product.title}
                    cost={product.cost}
                    discount={product.discount}
                    category={product.category}
                    small
                    handleClick={() => router.push(`/shop/${product._id}`)}
                  />
                ))}
              </div>
            ) : (
              <Loading />
            )}
            {!noImage && (
              <>
                <div
                  className="product-section-button-container"
                  onClick={() => {
                    router.push("/shop");
                  }}
                >
                  <button
                    className="product-section-button"
                    onClick={() => {
                      router.push("/shop");
                    }}
                  >
                    {buttonText} <FaCaretRight />
                  </button>
                </div>
              </>
            )}
          </div>
          {!noImage && (
            <div className="product-section-second">
              <div
                className="product-section-second-image-container"
                onClick={() => {
                  router.push("/shop?f=popular");
                }}
              >
                <Image
                  src={ProductImages[0].path}
                  fill
                  className="product-section-second-image"
                  alt="product section second image"
                />
              </div>
              <div className="product-section-subtitle-container">
                <h3 className="product-section-second-subtitle">{subtitle}</h3>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default ProductSection;
