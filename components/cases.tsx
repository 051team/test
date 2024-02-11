import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatter } from "../tools";
import { useSelector,useDispatch } from "react-redux";
import { note_searchResults } from "../redux/loginSlice";

const Cases = ({cases}:any) => {
    const searchResultNo = useSelector((state:any)=> state.loginSlice.searchResultNo);

    return ( 
        <div className={h.home_cases}>
        <div className={h.home_cases_kernel}>
            <h1>POPULAR CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    cases && [...cases].sort((a,b)=> a.caseIndex - b.caseIndex).filter( (c) => c.caseCategory === "popularcases").map((cs,index)=>
                    <Link href={`/cases/${cs.caseCategory}/${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>{cs.caseName}</h5>
                        <h4>{formatter(cs.casePrice)}</h4>
                    </div></Link>
                    )
                }
                {
                   !cases && [...Array(5)].map((e,i)=>
                    <div className={h.home_cases_kernel_group_each} id={h.placeholder} key={i}>

                    </div>
                    )
                }
            </div>
            <br /><br />
            <h1>DAO CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    cases && [...cases].filter( (c) => c.caseCategory === "daocases").map((cs,index)=>
                    <Link href={`/cases/${cs.caseCategory}/${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>{cs.caseName}</h5>
                        <h4>{formatter(cs.casePrice)}</h4>
                    </div></Link>
                    )
                }
            </div>
            <br /><br />
            <h1>HONORARY CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    cases && [...cases].filter( (c) => c.caseCategory === "honorarycases").map((cs,index)=>
                    <Link href={`/cases/${cs.caseCategory}/${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>{cs.caseName}</h5>
                        <h4>{formatter(cs.casePrice)}</h4>
                    </div></Link>
                    )
                }
            </div>
            <br /><br />
            <h1>COLLECTION CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    cases && [...cases].filter( (c) => c.caseCategory === "collectioncases").map((cs,index)=>
                    <Link href={`/cases/${cs.caseCategory}/${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each} >
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>{cs.caseName}</h5>
                        <h4>{formatter(cs.casePrice)}</h4>
                    </div></Link>
                    )
                }
            </div>
        </div>
    </div>
     );
}
 
export default Cases;