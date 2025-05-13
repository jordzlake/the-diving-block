import "@/components/cards/store-card/storecard.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

const StoreCard = ({
  url,
  title,
  cost,
  id,
  spec,
  image,
  handleClick,
  small,
  tiny,
  discount,
}) => {
  const router = useRouter();
  return (
    <div
      className="image-card"
      style={small ? { width: "13em" } : tiny ? { width: "10em" } : {}}
      onClick={() => {
        handleClick ? handleClick() : url && router.push(url);
      }}
    >
      {spec && <div className="image-special-text">{spec}</div>}

      {discount && <div className="image-discount-text">{`-${discount}%`}</div>}

      <div className="image-container">
        <CldImage
          src={`${image ? image : "404_lztxti"}`}
          fill
          alt={title}
          defaultImage="404_lztxti.png"
        />
      </div>
      <h3 className="image-title">{title}</h3>
      {discount && discount > 0 ? (
        <>
          <p className="image-desc">
            ${Number(cost * ((100 - discount) / 100)).toFixed(2)}
          </p>
        </>
      ) : (
        <p className="image-desc">${Number(cost).toFixed(2)}</p>
      )}
      {/* {<p className="image-discount">${discount}</p>} */}
    </div>
  );
};

export default StoreCard;
