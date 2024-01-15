import Image from "next/image";
import { useSession } from 'next-auth/react';
import Navbar from "../../components/navbar";
import c from "../../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Modal from "../../components/modal";
import { useDispatch,useSelector } from "react-redux";
import { note_balanceChange } from "../../redux/loginSlice";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "../../tools";

const Case_page = () => {
    const { data: session } = useSession();
    const [placeholders,setPlaceholders] = useState<number>(10);
    const router = useRouter();
    const {cat,name} = router.query;
    const [caseInfo, setCaseInfo] = useState<any>();
    const [won,setWon] = useState<any>();
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const [tempoText, setTempoText] = useState<string | null>();
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const [indexShift, setIndexShift] = useState<string>("0px");

    const dispatch = useDispatch();


    useEffect(()=>{
        const fetchCase = async () => {
            try {
                const response = await fetch(`/api/fetchcasetoopen?cat=${cat}&name=${name}`)
                if(response.status === 200){
                    const resJson = await response.json();
                    setCaseInfo(resJson.data);
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(cat && name){
            fetchCase();
        }
    },[cat,name])

    const handleOpenCase = async () => {
        if(!session){confirm("Login required");return}
        if(caseOpenDisabled){
            confirm("Insufficient balance!");
            return
        };
        setTempoText("Opening...");
        const response = await fetch("/api/opencase",{
            method:"POST",
            body:JSON.stringify({
                cat:cat,
                name:name,
                user:session?.user?.name,
                email:session?.user?.email
            })
        });
        if(response.status === 200){
            const resJson = await response.json();
            console.log(resJson.lucky);
            setWon(resJson.lucky);
            setPlaceholders(50);
            setTimeout(() => {
                dispatch(note_balanceChange((pr:any)=>!pr));
                const randomShift = generateRandomNumber();
                setIndexShift(`${-randomShift}px`)
            }, 1000);
            setTimeout(() => {
                setTempoText(null);
                setIndexShift("0px")
            }, 7000);
        }else{
            try {
                const resJson = await response.json();
                setFeedback(resJson);
                setTimeout(() => {
                    setFeedback(()=>undefined);
                }, 1500);
            } catch (error) {
                setFeedback({message:"Failed to open the case",color:"red"});
                setTimeout(() => {
                    setFeedback(()=>undefined);
                }, 1500);
            }
        }
    };

    const handleSellGift = async () => {
        if(!won || tempoText === "Selling..."){return};
        setTempoText("Selling...")
        try {
            const response = await fetch("/api/sellgift", {
                method:"POST",
                body:JSON.stringify({gift:won,user:session?.user})
            });
            try {
                if(response.status === 200){
                    const resJson = await response.json();
                    console.log(resJson);
                    dispatch(note_balanceChange((pr:any)=>!pr));
                    setTempoText(()=>"SOLD")
                    setTimeout(() => {
                        setTempoText(()=>null);
                        setWon(()=>null);
                        setPlaceholders(10);
                    }, 1000);
                }else{
                    console.log("Problem var", response)
                }
            } catch (error) {
                console.log("resJson failed");
            }

        } catch (error) {
            
        }
    }

    const caseOpenDisabled = !balance || !caseInfo || ( caseInfo && balance && caseInfo.casePrice > balance);
    const sliderVisible = !won || (tempoText && tempoText !== "Selling..." && tempoText !== "SOLD");
    const resultVisible = won && (!tempoText || tempoText === "Selling..." || tempoText === "SOLD");
    const sellButtonText = (tempoText === "Selling..." || tempoText === "SOLD") ? tempoText : `SELL FOR ${formatter(won && won.giftPrice)}`;
    const sellButtonDisabled = !!tempoText;
    const payButtonDisabled = (won || tempoText) ? true : false;
    const [repetitionCurve,setRepetitiveCurve] = useState<null | any[]>();

    const makeOccuranceRate = (gifts:any[]) => {
        const prices:any[] = [];
        const finals:any[] = [];
        const totalPrice = gifts.reduce((total,gift) => total + parseFloat(gift.giftProbability), 0);
        const unit = 50 / totalPrice;
        gifts.map((g,i) => prices.push(
             {probability:parseFloat(g.giftProbability),code:g.code}
        ));
        prices.sort();
        let reTotal = 0;

        gifts.map(gf=>reTotal = reTotal + Math.floor(unit*(parseFloat(gf.giftProbability))));

        prices.forEach((dual) => {
            const repetition = Math.floor(unit*(parseFloat(dual.probability)));
            for (let i = 0; i < repetition; i++) {
                finals.push(dual)
            }
        });

        if(reTotal < 50){
            const diffetence = 50 - reTotal;
            for (let i = 0; i < diffetence; i++) {
                finals.push(
                    prices[prices.length-1]
                )
            }
        }
        shuffleArray(finals);

        return finals
    }

    useEffect(()=>{
        if(caseInfo && !repetitionCurve){
            setRepetitiveCurve(makeOccuranceRate(caseInfo.caseGifts));
        }
    },[caseInfo]);

    return ( 
        <>
        <Navbar/>
        {
            feedback &&
            <Modal feedback={feedback} />
        }
        <div className={c.casepage}>
            <div id={c.black}></div>
            <div className={c.casepage_case}>
            <div id={c.caseDemo} className={ !caseInfo ? c.loading : ""}>
                {(caseInfo && caseInfo.caseName.toUpperCase()) ?? "LOADING..."}
                {
                    caseInfo && <Image src={caseInfo.caseImageURL} alt={"051 logo"} width={150} height={175} priority />
                }
            </div>
            {
            sliderVisible  &&
            <>
                    
                <div className={c.casepage_case_kernel}>
                    <div id={c.index}>
                        <span>&#9660;</span>
                        <span>&#9650;</span>
                    </div>
                    <div id={placeholders === 50 ? c.slide : ""} className={c.casepage_case_kernel_spinner} 
                    style={{ transform: `translateX(${placeholders === 50 ? indexShift : "0px"})`}}
                    >
                        {
                            repetitionCurve ? repetitionCurve.map((e,i) =>
                                <button id={repetitionCurve ? "" : c.loading} key={i}
                                    style={{
                                    backgroundImage: 
                                    (i !== 44 ) ? colorGenerator(caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftPrice) :
                                    (i === 44 && won) ? colorGenerator(won.giftPrice)
                                    : "none"
                                }}
                                >
                                    <Image src={(i === 44 && won) ? won.giftURL : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftURL}
                                        alt={"051 logo"} width={90} height={100} priority />
                                    <div id={c.text}>
                                        <span>{(won && i === 44) ? won.giftName : caseInfo.caseGifts.find((gf:any) => gf.code === e.code).giftName}</span>
                                    </div>
                                </button>
                            )
                            : 
                            [...Array(placeholders)].map((e,i)=>
                            <button id={repetitionCurve ? "" : c.loading} key={i}>
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
                        <button id={c.shaped2} style={{color:"white"}} onClick={handleOpenCase} disabled={payButtonDisabled}>
                            {
                                tempoText ? tempoText : 
                                (caseInfo && balance && (caseInfo.casePrice <= balance )) ? `Pay $${caseInfo.casePrice}`:
                                (caseInfo && balance && caseInfo.casePrice > balance) ? `+ $${caseInfo.casePrice - balance} needed` :
                                !session ? "Login required!" : (session && balance === 0) ? "No balance!" : "Please wait..."
                            }
                        </button>
                </div>
                <br />
                <br />
                {
                caseInfo && 
                <>
                <h3>
                    CASE CONTENT
                </h3>
                <div className={c.casepage_case_kernel} id={c.gifts}>
                    <div className={c.casepage_case_kernel_spinner} id={c.content} 
                        style={{justifyContent:caseInfo && caseInfo.caseGifts.length > 6 ? "flex-start" : "center" }}>
                    {
                        caseInfo.caseGifts.map((gf:any,i:number) =>
                        <button key={i} style={{
                            backgroundImage:colorGenerator(caseInfo.caseGifts[i].giftPrice)
                        }}>
                            <Image src={gf.giftURL} alt={"051 logo"} width={45} height={45} />
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

                }                    
            </>
            }


            {
            resultVisible &&
            <>
                <div className={c.casepage_case_result}>
                    <div id={c.btn} style={{backgroundImage:colorGenerator(won.giftPrice)}}>
                        <div id={c.chance}>Chance <br /> {won.giftProbability/100000*100}% </div>
                        <Image src={won.giftURL} alt={"won this gift"} width={90} height={100} />
                        <div id={c.text}>
                            <span>{won.giftName}</span>
                        </div>
                    </div>

                    <div id={c.ops}>
                        <button onClick={()=> {setPlaceholders(10);setWon(()=>null)}}>OPEN AGAIN <Image src={"/redo.png"} alt={"re-open the case"} width={20} height={20} /> </button>
                        <button disabled={sellButtonDisabled} onClick={handleSellGift}>{sellButtonText}</button>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h3>
                    CASE CONTENT
                </h3>
                <div className={c.casepage_case_kernel} id={c.gifts}>
                    <div className={c.casepage_case_kernel_spinner} id={c.content} 
                        style={{justifyContent:caseInfo && caseInfo.caseGifts.length > 6 ? "flex-start" : "center" }}>
                    {
                        caseInfo && caseInfo.caseGifts.map((gf:any,i:number) =>
                        <button key={i} style={{
                            backgroundImage:colorGenerator(caseInfo.caseGifts[i].giftPrice)
                        }}>
                            <Image src={gf.giftURL} alt={"051 logo"} width={45} height={45} />
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
            }


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
        </>
     );
}
 
export default Case_page;