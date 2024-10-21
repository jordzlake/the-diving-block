"use client";

import "@/components/sliders/slider.css";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "@/components/sliders/sliderOptions";
import StoreCard from "../cards/store-card/Storecard";
import sliderOptions from "@/components/sliders/sliderOptions";
import { useState } from "react";
import SliderHandle from "./sliderHandles/sliderHandle";

const Slider = ({ objects }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      defaultAnimation: {
        duration: 10000,
      },
      slides: { origin: "center", perView: 1 },
      created() {
        setLoaded(true);
      },
      breakpoints: {
        "(min-width: 480px)": {
          slides: { origin: "auto", perView: 1 },
        },
        "(min-width: 720px)": {
          slides: { origin: "auto", perView: 2 },
        },
        "(min-width: 1200px)": {
          slides: { origin: "auto", perView: 3 },
        },
        "(min-width: 1400px)": {
          slides: { origin: "auto", perView: 4 },
        },
      },
      created() {
        setLoaded(true);
      },
    },
    sliderOptions
  );

  return (
    <div className="slider-container">
      <div ref={sliderRef} className="keen-slider slider-wrapper">
        {objects.map((object, i) => (
          <div
            key={i}
            className={`keen-slider__slide ${"number-slide" + i} slider-indiv`}
          >
            <div className="card-wrapper">
              <StoreCard
                key={object.id}
                url={object.urls.raw}
                desc={
                  !object.alt_description ? object.alt_description : object.slug
                }
                cost="2000.00"
              />
            </div>
          </div>
        ))}
        {loaded && instanceRef.current && (
          <>
            <SliderHandle
              left
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <SliderHandle
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;
