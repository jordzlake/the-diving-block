import "@/components/sliders/sliderHandles/sliderHandle.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
const SliderHandle = ({ disable, onClick, left }) => {
  const disabled = disable ? " arrow--disabled" : "";

  return (
    <div
      onClick={onClick}
      className={`arrow ${left ? "arrow--left" : "arrow--right"} ${disabled}`}
    >
      <div className={`handle-icon-container ${disabled}`}>
        {left ? <FaArrowLeft /> : <FaArrowRight />}
      </div>
    </div>
  );
};

export default SliderHandle;
