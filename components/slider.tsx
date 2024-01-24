
import c from "./../styles/Casepage.module.css";
import Link from "next/link";
import { useEffect, useState,useRef } from "react";
import Slot from "./../components/sliderslot";



const Slider = ({caseInfo, placeholders,howmanyPlaceholder, indexShift, repetitionCurve,won,multiplier}:any) => {
    const slider = useRef<HTMLDivElement>(null);
    const [sliderOffset, setSliderOffset] = useState(0);
    useEffect(() => {
        const updateOffsetLeft = () => {
          if (slider.current) {
            const currentOffsetLeft = slider.current.offsetLeft;
            setSliderOffset(currentOffsetLeft);
            if (placeholders === 0) {
              console.log("Bitti");
              console.log(currentOffsetLeft);
              clearInterval(intervalId);
            }
          }
        };
      
        const intervalId = setInterval(updateOffsetLeft, 10);
      
        return () => {
          clearInterval(intervalId);
        };
      }, [placeholders]);
    return ( 
    <div className={c.casepage_case_kernel} id={c.main}>
        <div id={c.index}>
            <span>&#9660;</span>
            <span>&#9650;</span>
        </div>
        <div id={c.index2}>
            <span>&#9660;</span>
            <span>&#9650;</span>
        </div>
        <div id={placeholders === howmanyPlaceholder ? c.slide : ""} className={c.casepage_case_kernel_spinner} ref={slider}
        style={{ transform: `translateX(${placeholders === howmanyPlaceholder ? indexShift : "0px"})`}}
        >
            {
                repetitionCurve ? repetitionCurve.map((e:any,i:any) =>
                    <Slot 
                        id={repetitionCurve ? "" : c.loading} i={i} 
                        won={won} caseInfo={caseInfo} e={e}
                        key={i} sliderOffset={sliderOffset}
                    />
                )
                : 
                [...Array(placeholders)].map((e,i)=>
                <button id={repetitionCurve ? "" : c.loading} key={i}>
                </button>
                )
            }
        </div>
    </div>
     );
}
 
export default Slider;