import Image from "next/image";
import React, { Dispatch, Ref, RefObject, useRef, useState } from "react";
import s from "../styles/Editcase.module.css";
import defimage from "../public/assets/camera.png";
import del from "../public/delete.png";
interface GiftHolderProps {
    gifts:any;
    setGifts: React.Dispatch<React.SetStateAction<any>>;
    giftId:number,
    setProblems:React.Dispatch<React.SetStateAction<any>>;
    gift:any
  }

const Gift_holder_Editor = ({gift,gifts,setGifts,giftId,setProblems}:GiftHolderProps) => {
    const giftName = useRef<HTMLInputElement>(null);
    const giftPrice = useRef<HTMLInputElement>(null);
    const giftProbability = useRef<HTMLInputElement>(null);
    const giftImage = useRef<HTMLInputElement>(null);

    const [giftImageUrl, setGiftImageURL] = useState<string>(gift.giftURL);

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
            let done:boolean = [giftName,giftPrice,giftProbability].every(r=>r.current?.value);
            done = (giftImage.current?.files) ? true : (gift.giftURL) ? true : false;
            if(done){
                const giftInfo = {
                    giftName: giftName.current?.value ,
                    giftPrice:giftPrice.current?.value,
                    giftProbability:giftProbability.current?.value || 0,
                    giftId:giftId,
                    giftImage:giftImage.current?.files![0] || giftImageUrl
                }
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
    const handleDelGift = (e:any) => {
        const newGifts = gifts.addedgifts.filter((gf:any)=>gf.giftId !== gift.giftId);
        setGifts((pr:any) => ({
            ...gifts, canAddGift:true, addedgifts:newGifts
        }));
    }
    return ( 
        <>
        {
            gifts &&
            <div className={s.gift}>
            <button>
                <Image priority src={ gift.giftURL ??  (giftImageUrl ?? defimage)} alt="Gift image" width={30} height={30}/>
                <input type="file" accept="image/*" ref={giftImage}  onChange={()=>handleInputChange(1)}/>
            </button>
            <input type="text" placeholder="..." defaultValue={gift.giftName} ref={giftName} onChange={()=>handleInputChange()}  />
            <input type="number" placeholder="..." defaultValue={gift.giftPrice} min={1} ref={giftPrice} onChange={()=>handleInputChange()} />
            <input type="number" placeholder="..." defaultValue={gift.giftProbability} ref={giftProbability} onChange={()=>handleInputChange()}/>
            <button onMouseDown={handleDelGift}><Image src={del} alt={"delete gift"} width={30} height={30}/></button>
            </div>

        }
        </>
     );
}
 
export default Gift_holder_Editor;