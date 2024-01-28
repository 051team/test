import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatter } from "../tools";
import { useSelector,useDispatch } from "react-redux";
import { note_searchResultNo } from "../redux/loginSlice";

const Cases = () => {
    const [allCases, setAllCases] = useState<any[] | null>(null);
    const searchBy = useSelector((state:any)=>state.loginSlice.searchBy);
    const searchResultNo = useSelector((state:any)=> state.loginSlice.searchResultNo);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        if(allCases && searchBy !== ""){
            const numberofResults = allCases.filter( (c) => c.caseCategory === "popularcases")
                                            .filter((e) => e.caseName.toLowerCase().includes(searchBy)).length;
            console.log("no", numberofResults)
            if(numberofResults === 0){
                dispatch(note_searchResultNo(0));
            }else{
                dispatch(note_searchResultNo(numberofResults));
            }
        }
        if(searchBy === ""){
            dispatch(note_searchResultNo(null));
        }
    },[searchBy])

    const handleFetchCases = async () => {
                try {
                    const response = await fetch("/api/fetchcases");
                    try {
                        const resJson = await response.json();
                        const cases = resJson.data;
                        if(allCases === null){
                            setAllCases(cases);
                        }
                        console.log(cases)
                    } catch (error) {
                        console.log("Response object not JSON",error)
                    }
                } catch (error) {
                    console.log("Fetch request failed...",error)
                }
    }

    useEffect(()=>{
        if(!allCases){
            handleFetchCases();
        }
    },[])

    return ( 
        <div className={h.home_cases}>
        <div className={h.home_cases_kernel}>
            <h1>POPULAR CASES</h1>
            <div className={h.home_cases_kernel_group}>
                {
                    allCases && allCases.sort((a,b)=> a.caseIndex - b.caseIndex).filter( (c) => c.caseCategory === "popularcases").filter((e) => e.caseName.toLowerCase().includes(searchBy)).map((cs,index)=>
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
                {
                    (searchResultNo === 0) &&
                    <h1 style={{fontWeight:"400", color:"crimson", fontSize:"larger", filter:"brightness(1.2)"}}>No items found!</h1>
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
            </div>
        </div>
    </div>
     );
}
 
export default Cases;