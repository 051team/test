import c from "./../styles/Casepage.module.css";
import Image from "next/image";
import { note_universal_modal } from "./../redux/loginSlice";
import { useDispatch,useSelector } from "react-redux";
import { colorGenerator } from "../tools";


const CaseContent = ({caseInfo}:any) => {
    const dispatch = useDispatch();
    return ( 
        <>
        
        <h3>
            CASE CONTENT
        </h3>
        <div className={c.casepage_case_kernel} id={c.gifts}>
            <div className={c.casepage_case_kernel_spinner} id={c.content}>
            <button id={c.odds} onClick={()=>dispatch(note_universal_modal(true))}>CHECK ODDS RANGE</button>
            {
                caseInfo.caseGifts.map((gf:any,i:number) =>
                <button id={c.each} key={i} style={{
                    backgroundImage:colorGenerator(caseInfo.caseGifts[i].giftPrice)
                }}>
                    <Image src={gf.giftURL} alt={"051 logo"} width={90} height={100} />
                    <div id={c.luck}>
                        <span>Chance</span>
                        <span> %{gf.giftProbability/1000}</span>
                    </div>
                    <div id={c.text}>
                        <span>{gf.giftName}</span>
                        <span>${gf.giftPrice}</span>
                    </div>
                </button>
                )
            }
            </div>
        </div>
        </>
     );
}
 
export default CaseContent;