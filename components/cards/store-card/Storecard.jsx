import "@/components/cards/store-card/storecard.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const StoreCard = ({ url, name, cost, id }) => {
  const router = useRouter();
  return (
    <div
      className="image-card"
      onClick={() => {
        router.push(`/shop/` + id);
      }}
    >
      <div className="image-container">
        <Image src={url} alt="" fill />
      </div>
      <h3 className="image-title">{name}</h3>
      <p className="image-desc">${cost}</p>
    </div>
  );
};

export default StoreCard;
