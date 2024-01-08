import Image from "next/image";
import React, { Dispatch, Ref, RefObject, useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";

interface GiftHolderProps {
    setGiftsReady: React.Dispatch<React.SetStateAction<boolean>>;
    gifts:any;
    setGifts: React.Dispatch<React.SetStateAction<any>>;
    giftId:number

  }

const Gift_holder = ({setGiftsReady,gifts,setGifts,giftId}:GiftHolderProps) => {
    const giftName = useRef<HTMLInputElement>(null);
    const giftPrice = useRef<HTMLInputElement>(null);
    const giftProbability = useRef<HTMLInputElement>(null);

    const handleInputChange = (input:RefObject<HTMLInputElement>) => {
        setTimeout(() => {
            const done = [giftName,giftPrice,giftProbability].every(r=>r.current?.value);
            if(done){
                const giftInfo = {
                    giftName: giftName.current?.value,
                    giftPrice:giftPrice.current?.value,
                    giftProbability:giftProbability.current?.value,
                    giftId:giftId
                }
                //console.log(giftInfo);
                const newGifts = gifts.addedgifts.map((gf:any)=>gf.giftId === giftId ? giftInfo : gf);
                setGifts((pr:any) => ({
                    ...gifts, canAddGift:true, addedgifts:newGifts
                }))
            }else{
                if(gifts.canAddGift === true){
                    setGifts({
                        ...gifts, canAddGift:false
                    })
                }
            }
        }, 500);
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