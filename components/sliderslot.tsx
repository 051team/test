import Image from "next/image";
import c from "./../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import { useEffect, useState,useRef } from "react";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "./../tools";

const Slot = ({id,e,i,caseInfo,won,sliderOffset,vertical, bingoposition,slidertoplay}:any) => {
    let startRate = 2;
    let minRate = 0.2;
    let step = 0.1;

    const currentSlot = useRef<HTMLButtonElement>(null);
    const [slotOffet, setSlotOffet] = useState<number>();
    const [passed, setPassed] = useState<boolean>(false);

    useEffect(() => {
        if (currentSlot.current && i > 4) {
          const currentOffsetLeft = currentSlot.current.offsetLeft;
          setSlotOffet(currentOffsetLeft);
        }
    }, []);

    useEffect(() => {
        if(sliderOffset && slotOffet && !passed){
            if((-sliderOffset+806) > slotOffet){
                setPassed(true);
                const tick = new Audio("/tick1.mp3");
                tick.playbackRate = 1;
                tick.loop = false;
                tick.play();
            }
        }
      }, [sliderOffset,passed]);

      useEffect(() => {
        if(sliderOffset && vertical && slidertoplay === 0){
            if(sliderOffset < -(i*200+100) && !passed){
                setPassed(true);
                const tick = new Audio("/tick1.mp3");
                tick.playbackRate = 1;
                tick.loop = false;
                tick.play();
            }
        }
      }, [sliderOffset,vertical]);
      

    return ( 
    <button id={id} key={i} ref={currentSlot}
        style={{
        backgroundImage: 
        (i !== bingoposition ) ? colorGenerator(caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftPrice) :
        (i === bingoposition && won) ? colorGenerator(won.giftPrice)
        : colorGenerator(caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftPrice)
    }}
    >
        <Image src={(i === bingoposition && won) ? won.giftURL : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftURL}
            alt={"051 logo"} width={90} height={100} priority />
        <div id={c.text}>
            <span>{(won && i === bingoposition) ? won.giftName : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftName}</span>
            <span>{i}</span>
        </div>
    </button>
     );
}
 
export default Slot;