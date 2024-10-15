import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "@/components/sliders/sliderHandles/sliderHandle.css";
const SliderHandle = ({ disable, onClick, left }) => {
  const disabled = disable ? " arrow--disabled" : "";

  return (
    <div
      onClick={onClick}
      className={`arrow ${left ? "arrow--left" : "arrow--right"} ${disabled}`}
    >
      <div className={`handle-icon-container ${disabled}`}>
        <FontAwesomeIcon icon={left ? faArrowLeft : faArrowRight} />
      </div>
    </div>
  );
};

export default SliderHandle;
