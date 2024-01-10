import Image from "next/image";
import Navbar from "../../components/navbar";
import c from "../../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const Case_page = () => {
    const [placeholders,setPlaceholders] = useState<number>(10);
    const router = useRouter();
    const {cat,name} = router.query;
    const [caseInfo, setCaseInfo] = useState<any>();

    useEffect(()=>{
        const fetchCase = async () => {
            try {
                const response = await fetch(`/api/fetchcasetoopen?cat=${cat}&name=${name}`)
                if(response.status === 200){
                    const resJson = await response.json();
                    setCaseInfo(resJson.data);
                    console.log(resJson.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(cat && name){
            fetchCase();
        }
    },[cat,name])

    const mockLotteryDraw = () => {
        if(!caseInfo){return}
        let balls:number[] = [];
        for (let i = 0; i < caseInfo.caseGifts.length; i++) {
            const gift = caseInfo.caseGifts[i];
            const probability = gift.giftProbability;
            const price = gift.giftPrice;
            console.log(probability);
            for (let ind = 0; ind < probability; ind++) {
                balls.push(price);
            }
        }
        const chosenIndex = Math.floor(Math.random() * balls.length);
        const selectedBall = balls[chosenIndex];
        console.log("Result:",selectedBall,balls.length);
    }

    const handleShuffle = () => {
        setPlaceholders(50);
    };

    const makeNumber = (n:number,lng:number) => {
        const remainder = n%lng;
        return remainder
    }

    return ( 
        <div className={c.casepage}>
            <div id={c.black}></div>
            <div className={c.casepage_case}>
                <h3 onClick={mockLotteryDraw}>
                    {(caseInfo && caseInfo.caseName.toUpperCase()) ?? "LOADING..."}
                    <div id={c.index}>
                        <span>&#9660;</span>
                        <span>&#9650;</span>
                    </div>
                </h3>
                <div className={c.casepage_case_kernel}>
                    <div className={c.casepage_case_kernel_spinner} style={{position:"relative", left:-(placeholders-10)*125}}>
                    {
                       caseInfo && [...Array(placeholders)].map((e,i) =>
                        <button key={i} style={{
                            backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), darkorange)"
                                                    : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), lightgreen)"
                                                    : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), purple)"
                                                    : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
                        }}>
                            <Image src={caseInfo.caseGiftImageUrls[makeNumber((i+1),caseInfo.caseGifts.length)]} alt={"051 logo"} width={45} height={45} />
                            <div id={c.text}>
                                <span>Gift name</span>
                            </div>
                        </button>
                        )
                    }
                    </div>
                </div>
                <div id={c.actions}>
                        <div id={c.shaped}>
                            <button>x1</button>
                            <button>x2</button>
                            <button>x3</button>
                            <button>x4</button>
                            <button>x5</button>
                        </div>
                        <button id={c.shaped2} style={{color:"white"}} onClick={handleShuffle}>
                            Pay $35.50
                        </button>
                </div>
                <br />
                <br />


                <h3>
                    CASE CONTENT
                </h3>
                <div className={c.casepage_case_kernel} id={c.gifts}>
                    <div className={c.casepage_case_kernel_spinner} id={c.content} 
                        style={{justifyContent:caseInfo && caseInfo.caseGifts.length > 6 ? "flex-start" : "center" }}>
                    {
                        caseInfo && caseInfo.caseGifts.map((e:any,i:number) =>
                        <button key={i} style={{
                            backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), darkorange)"
                                                    : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), blue)"
                                                    : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), purple)"
                                                    : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
                        }}>
                            <Image src={caseInfo.caseGiftImageUrls[i]} alt={"051 logo"} width={45} height={45} />
                            <div id={c.text}>
                                <span>{caseInfo.caseGifts[i].giftName}</span>
                                <span>${caseInfo.caseGifts[i].giftPrice}</span>
                            </div>
                        </button>
                        )
                    }
                    </div>
                </div>






                <div className={c.casepage_case_kernel} id={c.bottombanner}>
                    <Image src={_051} alt={"051 logo"} width={63} height={35} />
                    <div>
                        <Link href={"/"}>AFFILIATE PROGRAM </Link>
                        <Link href={"/"}>PROJECT PARTNERSHIP </Link>
                        <Link href={"/"}>CUSTOMER SUPPORT </Link>
                        <Link href={"/"}>PROVABLY FAIR </Link>
                    </div>
                    <div id={c.right}>
                        <span>&#x2622;</span>
                        <span>&#x211A;</span>
                        <span>&#x213F;</span>
                        <span>&#x260E;</span>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Case_page;