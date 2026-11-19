"use client";

import { BannerImages } from "@/lib/tempImages";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/settingActions";
import "@/components/main/banner/banner.css";
import { FaCaretRight } from "react-icons/fa6";

const Banner = ({ settings }) => {
  const router = useRouter();
  // When the server passes settings as a prop, render the correct banner on the
  // first paint (no flash of the main banner before the promo loads).
  const [hideMainBanner, setHideMainBanner] = useState(
    settings?.hideMainBanner === true
  );
  const [promo, setPromo] = useState(settings?.promoBanner || null);

  useEffect(() => {
    // Already have server-provided settings — skip the client fetch entirely.
    if (settings) return;
    (async () => {
      try {
        const fetched = await getSettings();
        if (fetched && fetched[0]) {
          setHideMainBanner(fetched[0].hideMainBanner === true);
          setPromo(fetched[0].promoBanner || null);
        }
      } catch (err) {
        // Fall back to the default main banner if settings can't be fetched.
      }
    })();
  }, [settings]);

  const handler = (e) => {
    e.preventDefault();
    router.push("/about");
  };

  const promoHref = () => {
    if (!promo) return "/shop";
    if (promo.link) return promo.link;
    if (promo.category) {
      let href = `/shop?category=${encodeURIComponent(promo.category)}&p=1`;
      if (promo.subCategory) {
        href += `&subCategory=${encodeURIComponent(promo.subCategory)}`;
      }
      return href;
    }
    return "/shop";
  };

  const goToPromo = () => router.push(promoHref());

  const showPromo = promo && promo.enabled && promo.image;

  return (
    <>
      {!hideMainBanner && (
        <section className="banner-container">
          <div className="banner-background-image">
            <Image src={BannerImages[0].path} fill alt="desktop banner image" />
          </div>
          <div className="banner-background-image-mobile">
            <Image src={BannerImages[1].path} fill alt="mobile banner image" />
          </div>
          <div className="banner-content container fade-in-below">
            <h1 className="banner-content-title">THE DIVING BLOCK</h1>
            <p className="banner-content-description">
              was established in 2018 with the purpose of providing a local
              supply of swimwear
            </p>
            <button className="banner-button" onClick={handler}>
              MORE ABOUT US <FaCaretRight />
            </button>
          </div>
        </section>
      )}

      {showPromo && (
        <section
          className={`promo-banner-container ${
            promo.imageMobile ? "has-mobile" : ""
          }`}
          onClick={goToPromo}
          role="link"
          tabIndex={0}
          aria-label="View promotional products"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToPromo();
            }
          }}
        >
          <CldImage
            src={promo.image}
            fill
            alt="Promotional banner"
            className="promo-banner-image promo-banner-desktop"
            defaultImage="404_lztxti.png"
          />
          <CldImage
            src={promo.imageMobile || promo.image}
            fill
            alt="Promotional banner"
            className="promo-banner-image promo-banner-mobile"
            defaultImage="404_lztxti.png"
          />
        </section>
      )}
    </>
  );
};

export default Banner;
