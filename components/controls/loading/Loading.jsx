import "@/components/controls/loading/loading.css";
import PuffLoader from "react-spinners/PuffLoader";

export const Loading = () => {
  return (
    <div className="loading-container">
      <span>
        <PuffLoader color="#fc065f" />
      </span>
    </div>
  );
};
