"use client"

import "@/components/main/section/section.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import StoreCard from "@/components/cards/store-card/Storecard";

const Section = ({title,subtitle,linebreak,content}) => {

    return (
        <section className="section-container container">
            <div className="section-info">
                <h2 className="section-title">
                    {title}
                </h2>
                <p className="section-subtitle">
                    {subtitle}
                </p>
                {
                linebreak && 
                <div className="section-linebreak">
                    <div className="section-starLeft-border"/>
                    <div className="section-star-icon-container">
                     <FontAwesomeIcon className="section-star-icon" icon={faStar} />
                    </div>
                     <div className="section-starRight-border"/>
                </div>
                }
               {content.length != 0 && <div className="section-content">
                    {
                        content.map((image)=>(
                            <StoreCard key={image.id} url={image.urls.raw} desc={!image.alt_description ? image.alt_description : image.slug} cost="2000.00"/>
                        ))
                    }
                </div>}
            </div>  
        </section>
    );
}

export default Section;