import Image from "next/image";
import { tempSubCategoryImages } from "@/lib/tempCategoryImages";
import "@/components/main/subcategories/subcategories.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const SubCategories = () =>{
    return(
        <section className="subcategories-container section container">
            <div className="subcategories-first">
                <div className="subcategories-first-image-container">
                    <Image src={tempSubCategoryImages[0].url} fill alt="topimage" />
                </div>
                <div className="subcategories-first-image-container-content">
                    <h2 className="subcat-content-first">Best Sellers</h2>
                    <p className="subcat-content-second">Super Sales</p>
                    <p className="subcat-content-second">Shop <FontAwesomeIcon icon={faCaretRight} /></p>
                </div>
            </div>
            <div className="subcategories-second">
                <div className="subcategories-second-container">
                <div className="subcategories-second-image-container">
                    <Image src={tempSubCategoryImages[1].url} fill alt="bot first image" />
                    
                </div>
                <div className="subcategories-first-image-container-content">
                    <h2 className="subcat-content-first">Best Sellers</h2>
                    <p className="subcat-content-second">Super Sales</p>
                    <p className="subcat-content-second">Shop <FontAwesomeIcon icon={faCaretRight} /></p>
                </div>
                </div>
                <div className="subcategories-second-container">
                <div className="subcategories-third-image-container">
                    <Image src={tempSubCategoryImages[2].url} fill alt="bot second image" />
                </div>
                <div className="subcategories-first-image-container-content">
                    <h2 className="subcat-content-first">Best Sellers</h2>
                    <p className="subcat-content-second">Super Sales</p>
                    <p className="subcat-content-second">Shop <FontAwesomeIcon icon={faCaretRight} /></p>
                </div>
                </div>
            </div>
        </section>
    )
}

export default SubCategories;