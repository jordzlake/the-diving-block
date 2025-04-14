import "@/components/cards/store-card/storecard.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

const StoreCard = ({
  url,
  title,
  cost,
  id,
  image,
  discount,
  handleClick,
  small,
}) => {
  const router = useRouter();
  return (
    <div
      className="image-card"
      style={small && { width: "8em" }}
      onClick={() => {
        handleClick ? handleClick() : url && router.push(url);
      }}
    >
      <div className="image-container">
        <CldImage
          src={`${image ? image : "404_toij8l"}`}
          fill
          alt={title}
          defaultImage="404_toij8l.png"
        />
      </div>
      <h3 className="image-title">{title}</h3>
      <p className="image-desc">${cost}</p>
      {/* {<p className="image-discount">${discount}</p>} */}
    </div>
  );
};

export default StoreCard;
