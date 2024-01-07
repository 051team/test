import Image from "next/image";
import React, { Dispatch, Ref, RefObject, useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";

interface GiftHolderProps {
    setGiftsReady: React.Dispatch<React.SetStateAction<boolean>>;
    gifts:any;
    setGifts: React.Dispatch<React.SetStateAction<any>>;

  }

const Gift_holder = ({setGiftsReady,gifts,setGifts}:GiftHolderProps) => {
    const giftName = useRef<HTMLInputElement>(null);
    const giftPrice = useRef<HTMLInputElement>(null);
    const giftProbability = useRef<HTMLInputElement>(null);

    const handleInputChange = (input:RefObject<HTMLInputElement>) => {
        const done = [giftName,giftPrice,giftProbability].every(r=>r.current?.value);
        if(done){
            setGifts({
                ...gifts, canAddGift:true
            })
        }else{
            if(gifts.canAddGift === true){
                setGifts({
                    ...gifts, canAddGift:false
                })
            }
        }
    }

    return ( 
        <div className={s.gift}>
        <button><Image priority src={gift} alt="Gift image"/></button>
        <input type="text" placeholder="..." ref={giftName} onChange={()=>handleInputChange(giftName)}  />
        <input type="number" placeholder="..." ref={giftPrice} onChange={()=>handleInputChange(giftPrice)} />
        <input type="number" placeholder="..." ref={giftProbability} onChange={()=>handleInputChange(giftProbability)}/>
    </div>
     );
}
 
export default Gift_holder;