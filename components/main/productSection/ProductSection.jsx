import "@/components/main/productSection/productSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductImages } from "@/lib/tempImages";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import StoreCard from "@/components/cards/store-card/Storecard";
import { Loading } from "@/components/controls/loading/Loading";
import { useRouter } from "next/navigation";

const ProductSection = ({ title, subtitle, content, buttonText }) => {
  const router = useRouter();
  return (
    <section className="product-section-container container">
      <div className="product-section-first">
        <div className="product-section-info">
          <h2 className="product-section-title">{title}</h2>
          <div className="product-section-divider-container">
            <div className="product-section-divider-left" />
            <div className="product-section-icon-container">
              <FontAwesomeIcon className="section-star-icon" icon={faHeart} />
            </div>
            <div className="product-section-divider-right" />
          </div>
        </div>
        {content.length > 0 ? (
          <div className="product-section-grid">
            {content
              .slice(6, 12)
              .map(
                (product, i) =>
                  product.images[0] && (
                    <StoreCard
                      key={product.id}
                      id={product.id}
                      url={product.images[0] ? product.images[0].src : ""}
                      name={product.name ? product.name : product.slug}
                      cost={product.price}
                    />
                  )
              )}
          </div>
        ) : (
          <Loading />
        )}
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
            {buttonText} <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      </div>
      <div className="product-section-second">
        <div className="product-section-second-image-container">
          <Image
            src={ProductImages[0].path}
            fill
            className="product-section-second-image"
            alt="product section second image"
          />
        </div>
        <h3 className="product-section-second-subtitle">{subtitle}</h3>
      </div>
    </section>
  );
};

export default ProductSection;
