import Image from "next/image";
import React, { Dispatch, Ref, RefObject, useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";

interface GiftHolderProps {
    gifts:any;
    setGifts: React.Dispatch<React.SetStateAction<any>>;
    giftId:number,
    setProblems:React.Dispatch<React.SetStateAction<any>>;
  }

const Gift_holder = ({gifts,setGifts,giftId,setProblems}:GiftHolderProps) => {
    const giftName = useRef<HTMLInputElement>(null);
    const giftPrice = useRef<HTMLInputElement>(null);
    const giftProbability = useRef<HTMLInputElement>(null);
    const giftImage = useRef<HTMLInputElement>(null);

    const [giftImageUrl, setGiftImageURL] = useState<string>();

    const showTemporaryGiftImage = () => {
        if(giftImage.current && giftImage.current.files){
            const caseImageURL = URL.createObjectURL(giftImage.current.files[0]);
            setGiftImageURL(caseImageURL);
        }
    }

    const handleInputChange = (img?:number) => {
        if(img === 1){
            showTemporaryGiftImage();
        }
        setTimeout(() => {
            const done = [giftName,giftPrice,giftProbability].every(r=>r.current?.value) && giftImage.current?.files;
            if(done){
                const giftInfo = {
                    giftName: giftName.current?.value,
                    giftPrice:giftPrice.current?.value,
                    giftProbability:giftProbability.current?.value,
                    giftId:giftId,
                    giftImage:giftImage.current?.files![0]
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
                console.log(giftId);
            }
        }, 500);
    }

    return ( 
        <div className={s.gift}>
        <button>
            <Image priority src={ giftImageUrl ??  gift} alt="Gift image" width={30} height={30}/>
            <input type="file" accept="image/*" ref={giftImage}  onChange={()=>handleInputChange(1)}/>
        </button>
        <input type="text" placeholder="..." ref={giftName} onChange={()=>handleInputChange()}  />
        <input type="number" placeholder="..." ref={giftPrice} onChange={()=>handleInputChange()} />
        <input type="number" placeholder="..." ref={giftProbability} onChange={()=>handleInputChange()}/>
    </div>
     );
}
 
export default Gift_holder;