import { BannerImages } from "@/lib/tempImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "@/components/main/banner/banner.css";

const Banner = () => {
  const router = useRouter();

  const handler = (e) => {
    e.preventDefault();
    router.push("/about");
  };

  return (
    <section className="banner-container">
      <div className="banner-background-image">
        <Image src={BannerImages[0].path} fill alt="desktop banner image" />
      </div>
      <div className="banner-background-image-mobile">
        <Image src={BannerImages[1].path} fill alt="desktop banner image" />
      </div>
      <div className="banner-content container fade-in-below">
        <h1 className="banner-content-title">THE DIVING BLOCK</h1>
        <p className="banner-content-description">
          was established in 2018 with the purpose of providing a local supply
          of swimwear
        </p>
        <button className="banner-button" onClick={handler}>
          MORE ABOUT US <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
    </section>
  );
};

export default Banner;
