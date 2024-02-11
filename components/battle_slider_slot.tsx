import Image from "next/image";
import c from "./../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import { useEffect, useState,useRef } from "react";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "./../tools";

const BattleSLOT = ({id,e,i,caseInfo,won,sliderOffset,sliderOffsetVertical,vertical, bingoposition,slidertoplay,content}:any) => {
    const currentSlot = useRef<HTMLButtonElement>(null);
    const [slotOffet, setSlotOffet] = useState<number>(0);
    const [passed, setPassed] = useState<boolean>(false);

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
        <>
        {
            content &&     <button id={id} key={i} ref={currentSlot}
            style={{
            backgroundImage: 
            (i !== bingoposition ) ? colorGenerator(content.giftPrice) :
            (i === bingoposition && (won)) ? colorGenerator((won).giftPrice)
            : colorGenerator(content.giftPrice)
        }}
        >
            <Image src={(i === bingoposition && (won)) ? (won).giftURL : content.giftURL}
                alt={"051 logo"} width={90} height={100} priority />
            <div id={c.text}>
                <span>{((won) && i === bingoposition) ? (won).giftName : content.giftName}</span>
                <span>{((won) && i === bingoposition) ? formatter((won).giftPrice) : ""}</span>
            </div>
        </button>
        }
        
        </>
     );
}
 
export default BattleSLOT;