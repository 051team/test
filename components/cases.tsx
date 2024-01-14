import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatter } from "../tools";


const Cases = () => {
    const [allCases, setAllCases] = useState<any[] | null>();
    const handleFetchCases = async () => {
                try {
                    const response = await fetch("/api/fetchcases");
                    try {
                        const resJson = await response.json();
                        const cases = resJson.data;
                        setAllCases(cases);
                        console.log(cases);
                    } catch (error) {
                        console.log("Response object not JSON",error)
                    }
                } catch (error) {
                    console.log("Fetch request failed...",error)
                }
    }
    useEffect(()=>{
        handleFetchCases();
    },[])
    return ( 
        <div className={h.home_cases}>
        <div className={h.home_cases_kernel}>
            <h1>POPULAR CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    allCases && allCases.filter( (c) => c.caseCategory === "popularcases").map((cs,index)=>
                    <Link href={`/cases/cs?cat=${cs.caseCategory}&name=${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>{cs.caseName}</h5>
                        <h4>{formatter(cs.casePrice)}</h4>
                    </div></Link>
                    )
                }
                {
                   !allCases && [...Array(5)].map((e,i)=>
                    <div className={h.home_cases_kernel_group_each} id={h.placeholder} key={i}>

                    </div>
                    )
                }
            </div>
            <br /><br />
            <h1>LIMITED EDITION</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    allCases && allCases.filter( (c) => c.caseCategory === "limitededition").map((cs,index)=>
                    <Link href={`/cases/cs?cat=${cs.caseCategory}&name=${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each} >
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>
                            {cs.caseName}
                        </h5>
                    </div></Link>
                    )
                }
                {
                    [...Array(5)].map((e,i)=>
                    <div className={h.home_cases_kernel_group_each} key={i}>
                        <Image priority={i < 5 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                        <h5>
                            Case name heree
                        </h5>
                    </div>
                    )
                }
            </div>
            <br /><br />
            <h1>HONORARY CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    allCases && allCases.filter( (c) => c.caseCategory === "honorarycases").map((cs,index)=>
                    <Link href={`/cases/cs?cat=${cs.caseCategory}&name=${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>
                            {cs.caseName}
                        </h5>
                    </div></Link>
                    )
                }
                {
                    [...Array(5)].map((e,i)=>
                    <div className={h.home_cases_kernel_group_each} key={i}>
                        <Image priority={i < 5 ? true : false} src={`/assets/honorary/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                        <h5>
                            Case name heree
                        </h5>
                    </div>
                    )
                }
            </div>
            <br /><br />
            <h1>DAO CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    allCases && allCases.filter( (c) => c.caseCategory === "daocases").map((cs,index)=>
                    <Link href={`/cases/cs?cat=${cs.caseCategory}&name=${cs.caseName}`} key={index}>
                    <div className={h.home_cases_kernel_group_each}>
                        <Image priority src={cs.caseImageURL} alt={cs.caseName} width={200} height={250} />
                        <h5>
                            {cs.caseName}
                        </h5>
                    </div></Link>
                    )
                }
                {
                    [...Array(10)].map((e,i)=>
                    <div className={h.home_cases_kernel_group_each} key={i}>
                        <Image priority={i < 5 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                        <h5>
                            Case name heree
                        </h5>
                    </div>
                    )
                }
            </div>
        </div>
    </div>
     );
}
 
export default Cases;