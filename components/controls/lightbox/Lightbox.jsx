"use client";

import { useState, forwardRef, useImperativeHandle, use } from "react";
import "./lightbox.css";
import { CldImage } from "next-cloudinary";

export const Lightbox = forwardRef((props, ref) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageSrc, setLightboxImageSrc] = useState(null);

  const openLightbox = (imageSrc) => {
    setLightboxImageSrc(imageSrc);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImageSrc("");
  };

  useImperativeHandle(ref, () => ({
    openLightbox,
    closeLightbox,
  }));

  return (
    <>
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close-button" onClick={closeLightbox}>
            &times;
          </span>
          <CldImage
            src={lightboxImageSrc}
            fill
            alt={`Lightbox Image`}
            id="lightbox-image"
            defaultImage="404_toij8l.png"
          />
        </div>
      )}
    </>
  );
});

Lightbox.displayName = "LightBox";
