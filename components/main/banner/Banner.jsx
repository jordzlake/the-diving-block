import { BannerImages } from "@/lib/tempImages";
import Image from "next/image";
import "@/components/main/banner/banner.css";

const Banner = () => {
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
        <button className="banner-button">MORE ABOUT US</button>
      </div>
    </section>
  );
};

export default Banner;
