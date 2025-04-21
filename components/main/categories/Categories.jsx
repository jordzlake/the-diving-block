import Link from "next/link";
import "@/components/main/categories/categories.css";
import { tempCategoryImages } from "@/lib/tempCategoryImages";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa6";

const Categories = () => {
  const router = useRouter();

  return (
    <section className="categories-container">
      <div className="categories-content">
        <div
          className="category-image-1-container category-image"
          onClick={() => {
            router.push("/shop?category=ladies");
          }}
        >
          <Image src={tempCategoryImages[0].url} fill alt="category1" />
          <div className="category-image-text-container">
            <p className="category-image-text">Ladies</p>
            <p className="category-image-subtext">
              Shop{" "}
              <span className="chev">
                <FaChevronRight />
              </span>
            </p>
          </div>
        </div>
        <div
          className="category-image-2-container category-image"
          onClick={() => {
            router.push("/shop?category=men");
          }}
        >
          <Image src={tempCategoryImages[1].url} fill alt="category2" />
          <div className="category-image-text-container">
            <p className="category-image-text">Men</p>
            <p className="category-image-subtext">
              Shop{" "}
              <span className="chev">
                <FaChevronRight />
              </span>
            </p>
          </div>
        </div>
        <div
          className="category-image-3-container category-image"
          onClick={() => {
            router.push("/shop?category=kids");
          }}
        >
          <Image src={tempCategoryImages[2].url} fill alt="category3" />
          <div className="category-image-text-container">
            <p className="category-image-text">Kids</p>
            <p className="category-image-subtext">
              Shop{" "}
              <span className="chev">
                <FaChevronRight />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
