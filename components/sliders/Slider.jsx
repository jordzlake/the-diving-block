"use client";

import "@/components/sliders/slider.css";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import "@/components/sliders/sliderOptions";
import StoreCard from "../cards/store-card/Storecard";
import sliderOptions from "@/components/sliders/sliderOptions";
import { useEffect, useState } from "react";
import SliderHandle from "./sliderHandles/sliderHandle";
import { useRouter } from "next/navigation";
import { CalculateProductDiscounts } from "@/components/calculations/CalculateProductDiscounts";
import { Loading } from "../controls/loading/Loading";
import { getSettings } from "@/lib/settingActions";

const Slider = ({ objects }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState([]);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      defaultAnimation: {
        duration: 5000,
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

  useEffect(() => {
    objects.length > 0 &&
      (async () => {
        try {
          setLoading(true);
          const settings = await getSettings();
          if (settings[0]) {
            const discountedItems = CalculateProductDiscounts(
              objects,
              settings[0]
            );
            setNewContent(discountedItems);
          }
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
  }, [objects]);

  return (
    <div className="slider-container">
      {!loading && newContent.length > 0 ? (
        <div ref={sliderRef} className="keen-slider slider-wrapper">
          {newContent.map((object, i) => (
            <div
              key={i}
              className={`keen-slider__slide ${
                "number-slide" + i
              } slider-indiv`}
            >
              <div className="card-wrapper">
                <StoreCard
                  key={object._id}
                  id={object._id}
                  spec={object.spec || undefined}
                  image={object.image}
                  title={object.title}
                  cost={object.cost}
                  discount={object.discount}
                  category={object.category}
                  handleClick={() => router.push(`/shop/${object._id}`)}
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
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Slider;
