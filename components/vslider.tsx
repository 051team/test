import { useEffect, useState } from "react";
import { isAnyArrayBuffer } from "util/types";
import { shuffleArray } from "../tools";
import c from "./../styles/Casepage.module.css";
import Slot from "./sliderslot";


const VerticalSlider = ({caseInfo,verticalSpin, placeholders,sliderOffset,won,multiplier}:any) => {
    let howmany = 0;

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
            console.log(reps);
        }

    },[caseInfo, multiplier])
    return (
    <div className={c.casepage_case_kernel} id={c.kernelvertical}>
        <span id={c.leftindex}>&#9654;</span>
        <span id={c.rightindex}>&#9664;</span>
        {
           repetitionSets &&  repetitionSets.map((repset,i)=>
            <div className={c.casepage_case_kernel_verticalspinner} id={verticalSpin ? c.slidevertical : ""} key={i} >
            {
                repset && repset.map((e:any,i:any) =>
                    <Slot 
                        id={c.loading} i={i} 
                        won={won} caseInfo={caseInfo} e={e}
                        key={i} sliderOffset={sliderOffset}                         
                        bingoposition={40}
                    />
                )
            }
            </div>
            )
        }
    </div>

      );
}
 
export default VerticalSlider;