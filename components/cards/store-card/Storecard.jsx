import "@/components/cards/store-card/storecard.css";
import Image from "next/image";

const StoreCard = ({url,desc,cost}) =>{
    return (
        <div className="image-card">
            <div className="image-container">
                <Image src={url} alt="" fill/>
            </div>
            <h3 className="image-title">{desc}</h3>
            <p className="image-desc">${cost}</p>
        </div>
    )
}

export default StoreCard;