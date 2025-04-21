import Image from "next/image";
import { tempSubCategoryImages } from "@/lib/tempCategoryImages";
import "@/components/main/subcategories/subcategories.css";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

const SubCategories = () => {
  const router = useRouter();
  return (
    <section className="subcategories-container section">
      <div className="subcategories-first">
        <div
          className="subcategories-first-container"
          onClick={() => {
            router.push("/shop?f=sale");
          }}
        >
          <div className="subcategories-first-image-container">
            <Image src={tempSubCategoryImages[0].url} fill alt="topimage" />
          </div>
          <div className="subcategories-first-container-content">
            <h2 className="subcat-content-first">Best Sellers</h2>
            <p className="subcat-content-second">Super Sales</p>
            <p className="subcat-content-third">
              Shop <FaChevronRight />
            </p>
          </div>
        </div>
      </div>
      <div className="subcategories-second">
        <div className="subcategories-second-container">
          <div
            className="subcategories-second-image-container"
            onClick={() => {
              router.push("/shop?category=swimgear");
            }}
          >
            <Image
              src={tempSubCategoryImages[1].url}
              fill
              alt="bot first image"
            />
          </div>
          <div className="subcategories-second-container-content">
            <h2 className="subcat-content-first">Gear Up With</h2>
            <p className="subcat-content-second">Swim Gear</p>
            <p className="subcat-content-third">
              Shop <FaChevronRight />
            </p>
          </div>
        </div>
        <div className="subcategories-third-container">
          <div
            className="subcategories-third-image-container"
            onClick={() => {
              router.push("/shop?category=beachcasual");
            }}
          >
            <Image
              src={tempSubCategoryImages[2].url}
              fill
              alt="bot second image"
            />
          </div>
          <div className="subcategories-third-container-content">
            <h2 className="subcat-content-first">Just Add Water</h2>
            <p className="subcat-content-second">Beach Casual</p>
            <p className="subcat-content-third">
              Shop <FaChevronRight />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubCategories;
