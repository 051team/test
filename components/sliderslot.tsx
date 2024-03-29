import Image from "next/image";
import c from "./../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import { useEffect, useState,useRef } from "react";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "./../tools";

const Slot = ({id,e,i,caseInfo,won,sliderOffset,sliderOffsetVertical,vertical,wonM, bingoposition,slidertoplay}:any) => {
    const currentSlot = useRef<HTMLButtonElement>(null);
    const [slotOffet, setSlotOffet] = useState<number>(0);
    const [passed, setPassed] = useState<boolean>(false);

    console.log("slider",i)

    useEffect(() => {
        if (currentSlot.current && i > 4) {
          const currentOffsetLeft = currentSlot.current.offsetLeft;
          setSlotOffet(currentOffsetLeft);
        }
    }, []);

    useEffect(() => {
        if(sliderOffset && slotOffet && !passed && !vertical){
            if((-sliderOffset+806) > slotOffet){
                setPassed(true);
                const tick = new Audio("/tick1.mp3");
                tick.playbackRate = 1;
                tick.loop = false;
                tick.play();
            }
        }
      }, [sliderOffset,vertical]);

      useEffect(() => {
        if(sliderOffsetVertical && slidertoplay === 0){
            if(sliderOffsetVertical < -(i*200+100) && !passed){
                setPassed(true);
                const tick = new Audio("/tick1.mp3");
                tick.playbackRate = 1;
                tick.loop = false;
                tick.play();
            }
        }
      }, [sliderOffsetVertical]);
      

    return ( 
    <button id={id} key={i} ref={currentSlot}
        style={{
        backgroundImage: 
        (i !== bingoposition ) ? colorGenerator(caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftPrice) :
        (i === bingoposition && (won ?? wonM)) ? colorGenerator((won ?? wonM).giftPrice)
        : colorGenerator(caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftPrice)
    }}
    >
        <Image src={(i === bingoposition && (won ?? wonM)) ? (won ?? wonM).giftURL : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftURL}
            alt={"051 logo"} width={90} height={100} priority />
        <div id={c.text}>
            <span>{((won ?? wonM) && i === bingoposition) ? (won ?? wonM).giftName : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftName}</span>
        </div>
    </button>
     );
}
 
export default Slot;