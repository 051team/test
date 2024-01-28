import { useEffect, useState,useRef } from "react";
import { isAnyArrayBuffer } from "util/types";
import { shuffleArray } from "../tools";
import c from "./../styles/Casepage.module.css";
import Slot from "./sliderslot";


const VerticalSlider = ({caseInfo,verticalSpin, multiWon,multiplier}:any) => {
    let howmany = 100;
    const slider = useRef<HTMLDivElement>(null);
    const [sliderOffsetVertical, setSliderOffsetVertical] = useState(0);

    useEffect(() => {
        const updateOffsetTop = () => {
          if (slider.current) {
            const currentOffsetTop = slider.current.offsetTop;
            setSliderOffsetVertical(currentOffsetTop);
            if (currentOffsetTop === - 8000 || !verticalSpin) {
              clearInterval(intervalId);
            }
          }
        };
      
        const intervalId = setInterval(updateOffsetTop, 10);
      
        return () => {
          clearInterval(intervalId);
        };
      }, [verticalSpin,multiplier]);


    const makeOccuranceRate = (gifts:any[]) => {
        const prices:any[] = [];
        const finals:any[] = [];
        const totalPrice = gifts.reduce((total,gift) => total + parseFloat(gift.giftProbability), 0);
        gifts.map((g,i) => prices.push(
             {probability:parseFloat(g.giftProbability),code:g.code}
        ));
        prices.sort();

        let reTotal = 0;

        const repForEach = Math.floor(howmany/gifts.length);
        const giftNumber = gifts.length;
        const minReps = giftNumber > 15 ? 4 : giftNumber > 9 ? 5 : giftNumber > 6 ? 7 : giftNumber > 2 ? 15 : 30;
        const unit = (howmany - minReps * giftNumber) / totalPrice;

        gifts.map(gf=>reTotal = reTotal + Math.floor(unit*(parseFloat(gf.giftProbability))));

        prices.forEach((dual) => {
            const repetition = Math.floor(unit*(parseFloat(dual.probability)));
            for (let i = 0; i < minReps; i++) {
                finals.push(dual)
            }
            for (let i = 0; i < repetition; i++) {
                finals.push(dual)
            }
        });

        if(reTotal < (howmany - minReps * giftNumber)){
            const diffetence = (howmany - minReps * giftNumber) - reTotal;
            for (let i = 0; i < diffetence; i++) {
                finals.push(
                    prices[prices.length-1]
                )
            }
        }
        shuffleArray(finals);
        shuffleArray(finals);
        //console.log(finals, finals.length)

        return finals
    }

    const [repetitionSets, setRepSets] = useState<any[]>();

    useEffect(()=>{
        const reps = [];
        if(caseInfo && multiplier){
            for (let i = 0; i < multiplier; i++) {
                const rc = makeOccuranceRate(caseInfo.caseGifts);
                reps.push(rc)
            }
            setRepSets(reps);
        }

    },[caseInfo, multiplier]);

    return (
    <>
        <div id={c.verticalindex}>
            <div id={c.indexes} style={{width:multiplier*200+((multiplier-1*2))+38}}>
                <span>&#9654;</span>
                <span>&#9664;</span>
            </div>
        </div>
        <div className={c.casepage_case_kernel} id={c.kernelvertical}>
            {
            repetitionSets &&  repetitionSets.map((repset,ii)=>
                <div className={c.casepage_case_kernel_verticalspinner} id={verticalSpin ? c.slidevertical : ""} key={ii} ref={slider} >
                {
                    repset && repset.map((e:any,i:any) =>
                        <Slot 
                            id={""} i={i} 
                            caseInfo={caseInfo} e={e}
                            key={i} sliderOffsetVertical={sliderOffsetVertical}                         
                            bingoposition={90}
                            vertical={true}
                            slidertoplay = {ii}
                            wonM ={multiWon && multiWon[ii]}
                        />
                    )
                }
                </div>
                )
            }
        </div>
    </>
      );
}
 
export default VerticalSlider;