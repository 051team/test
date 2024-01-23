import c from "./../styles/Casepage.module.css";
import Image from "next/image";
import { formatter } from "../tools";


const Odds = ({caseInfo}:any) => {
    return ( 
    <div id={c.odds}>
        <div id={c.row} key={99999} style={{backgroundColor:"black"}}>
            <span>Item</span>
            <span></span>
            <span>Price</span>
            <span>Chance</span>
        </div>
        {
            caseInfo && caseInfo.caseGifts.map((gf:any,i:number) =>
            <div id={c.row} key={i} style={{backgroundColor:i%2 ? "black" : "rgb(25 25 25)"}}>
                <Image src={gf.giftURL} alt={"XXX"} width={50} height={50} priority />
                <span>{gf.giftName}</span>
                <span style={{fontWeight:"bold"}}>{formatter(gf.giftPrice)}</span>
                <span>%{gf.giftProbability/100000*100}</span>
            </div>
            )
        }
    </div>
     );
}
 
export default Odds;