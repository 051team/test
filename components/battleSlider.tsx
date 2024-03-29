import { useEffect, useState,useRef } from "react";
import { isAnyArrayBuffer } from "util/types";
import { shuffleArray } from "../tools";
import c from "./../styles/Casepage.module.css";
import BattleSLOT from "./battle_slider_slot";


const BattleSlider = ({caseInfo,verticalSpin, multiWon,multiplier,play}:any) => {
    let howmany = 0;
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

    const reps:any = [];
    useEffect(()=>{
        if(caseInfo){
            for (let i = 0; i < multiplier; i++) {
                const rc = makeOccuranceRate(caseInfo.caseGifts);
                reps.push(rc)
            }
            setRepSets(reps);
        }

    },[caseInfo]);

    return (
    <>
    <div className={c.casepage_case_kernel} id={c.kernelvertical} style={{width:"fit-content"}}>
        
            <div
                className={c.casepage_case_kernel_verticalspinner} id={verticalSpin ? c.slideverticalbattle : ""}  ref={slider} >
            {
                 repetitionSets && repetitionSets[0].map((e:any,i:any) =>
                    <BattleSLOT 
                        id={""} i={i} 
                        caseInfo={caseInfo} e={e}
                        key={i} sliderOffsetVertical={sliderOffsetVertical}                         
                        bingoposition={50}
                        vertical={verticalSpin}
                        slidertoplay = {play}
                        won = {multiWon && multiWon[0]}
                        content = {caseInfo.caseGifts.find((gf:any) => gf.code === e.code)}
                    />
                )
            }
            </div>
            
        
    </div>

    </>
      );
}
 
export default BattleSlider;