import Image from "next/image";
import { useSession } from 'next-auth/react';
import Navbar from "../../components/navbar";
import c from "../../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import Link from "next/link";
import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import Modal from "../../components/modal";
import { useDispatch,useSelector } from "react-redux";
import { note_balanceChange, note_universal_modal } from "../../redux/loginSlice";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "../../tools";
import Universal_modal from "../../components/universal_modal";
import Slot from "../../components/sliderslot";

const Case_page = () => {
    const { data: session } = useSession();
    const [placeholders,setPlaceholders] = useState<number>(10);
    const howmanyPlaceholder = 100;
    const router = useRouter();
    const {cat,name} = router.query;
    const [caseInfo, setCaseInfo] = useState<any>();
    const [won,setWon] = useState<any>();
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const [tempoText, setTempoText] = useState<string | null>();
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const [indexShift, setIndexShift] = useState<string>("0px");
    const universalModal = useSelector((state:any) => state.loginSlice.universal_modal);

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
                user:session?.user
            })
        });
        if(response.status === 200){
            const resJson = await response.json();
            console.log(resJson.lucky);
            setWon(resJson.lucky);
            setPlaceholders(howmanyPlaceholder);
            setTimeout(() => {
                dispatch(note_balanceChange(((pr:boolean)=>!pr)));
                const randomShift = generateRandomNumber();
                setIndexShift(`${-randomShift}px`);
            }, 1000);
            setTimeout( async () => {
                const responseLiveDrop = await fetch("/api/addtolivedrop",{
                    method:"POST",
                    body:JSON.stringify(resJson.lucky)
                })
                console.log(responseLiveDrop);
            }, 7000);
            setTimeout(() => {
                setTempoText(null);
                setIndexShift("0px");
            }, 11000);
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
                    dispatch(note_balanceChange((pr:boolean)=>!pr));
                    setTempoText(()=>"SOLD")
                    setTimeout(() => {
                        setTempoText(()=>null);
                        setWon(()=>null);
                        setRepetitiveCurve(makeOccuranceRate(caseInfo.caseGifts));
                        setPlaceholders(10);
                    }, 1000);
                }else{
                    console.log("Problem var", response);
                    setTempoText("Failed to sell...");
                    setTimeout(() => {
                        setTempoText(()=>null);
                    }, 1500);
                }
            } catch (error) {
                console.log("resJson failed");
            }

        } catch (error) {
            
        }
    }

    const caseOpenDisabled = !balance || !caseInfo || ( caseInfo && balance && caseInfo.casePrice > balance);
    const sliderVisible = !won || (tempoText && tempoText !== "Selling..." && tempoText !== "SOLD" && tempoText !== "Failed to sell...");
    const resultVisible = won && (!tempoText || tempoText === "Selling..." || tempoText === "SOLD" || tempoText === "Failed to sell...");
    const sellButtonText = (tempoText === "Selling..." || tempoText === "SOLD") ? tempoText : tempoText === "Failed to sell..." ? "Failed" : `SELL FOR ${formatter(won && won.giftPrice)}`;
    const sellButtonDisabled = !!tempoText;
    const payButtonDisabled = (won || tempoText) ? true : false;
    const [repetitionCurve,setRepetitiveCurve] = useState<null | any[]>();


    const makeOccuranceRate = (gifts:any[]) => {
        const prices:any[] = [];
        const finals:any[] = [];
        const totalPrice = gifts.reduce((total,gift) => total + parseFloat(gift.giftProbability), 0);
        gifts.map((g,i) => prices.push(
             {probability:parseFloat(g.giftProbability),code:g.code}
        ));
        prices.sort();

        let reTotal = 0;

        const repForEach = Math.floor(howmanyPlaceholder/gifts.length);
        const giftNumber = gifts.length;
        const minReps = giftNumber > 15 ? 4 : giftNumber > 9 ? 5 : giftNumber > 6 ? 7 : giftNumber > 2 ? 15 : 30;
        const unit = (howmanyPlaceholder - minReps * giftNumber) / totalPrice;

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

        if(reTotal < (howmanyPlaceholder - minReps * giftNumber)){
            const diffetence = (howmanyPlaceholder - minReps * giftNumber) - reTotal;
            for (let i = 0; i < diffetence; i++) {
                finals.push(
                    prices[prices.length-1]
                )
            }
        }
        shuffleArray(finals);
        shuffleArray(finals);
        console.log(finals, finals.length)

        return finals
    }

    useEffect(()=>{
        if(caseInfo && !repetitionCurve){
            setRepetitiveCurve(makeOccuranceRate(caseInfo.caseGifts));
        }
    },[caseInfo]);


    const slider = useRef<HTMLDivElement>(null);
    const [sliderOffset, setSliderOffset] = useState(0);


    useEffect(() => {
        const updateOffsetLeft = () => {
          if (slider.current) {
            const currentOffsetLeft = slider.current.offsetLeft;
            setSliderOffset(currentOffsetLeft);
            if (placeholders === 0) {
              console.log("Bitti");
              console.log(currentOffsetLeft);
              clearInterval(intervalId);
            }
          }
        };
      
        const intervalId = setInterval(updateOffsetLeft, 10);
      
        return () => {
          clearInterval(intervalId);
        };
      }, [placeholders]);

    return ( 
        <>
        <Navbar/>
        {
            feedback &&
            <Modal feedback={feedback} />
        }
        <div className={c.casepage}>
{/*             <div id={c.black}></div>
 */}            <div id={c.bg}></div>
            <div className={c.casepage_case}>
            {
            /* !resultVisible &&  */
            <div id={c.caseDemo} className={ !caseInfo ? c.loading : ""}>
                <span>{(caseInfo && caseInfo.caseName.toUpperCase()) ?? ""}</span>
                {
                    caseInfo && <Image src={caseInfo.caseImageURL} alt={"051 logo"} width={200} height={270} priority />
                }
            </div>
            }
            {
            sliderVisible  &&
            <>
                    
                <div className={c.casepage_case_kernel} id={c.main}>
                    <div id={c.index}>
                        <span>&#9660;</span>
                        <span>&#9650;</span>
                    </div>
                    <div id={c.index2}>
                        <span>&#9660;</span>
                        <span>&#9650;</span>
                    </div>
                    <div id={placeholders === howmanyPlaceholder ? c.slide : ""} className={c.casepage_case_kernel_spinner} ref={slider}
                    style={{ transform: `translateX(${placeholders === howmanyPlaceholder ? indexShift : "0px"})`}}
                    >
                        {
                            repetitionCurve ? repetitionCurve.map((e,i) =>
                                <Slot 
                                    id={repetitionCurve ? "" : c.loading} i={i} 
                                    won={won} caseInfo={caseInfo} e={e}
                                    key={i} sliderOffset={sliderOffset}
                                />
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
                }                    
            </>
            }

            {
            resultVisible &&
            <>
                    
                <div className={c.casepage_case_kernel} id={c.main} style={{justifyItems:"center"}}>
                    <div className={c.casepage_case_kernel_spinner}>
                        <button style={{backgroundImage:colorGenerator(won.giftPrice)}} id={c.shinewon}
                        >
                            <Image src={won.giftURL} alt={"051 logo"} width={90} height={100} />
                            <div id={c.luck}>
                                <span>Chance</span>
                                <span> %{won.giftProbability/1000}</span>
                            </div>
                            <div id={c.text}>
                                <span>{won.giftName}</span>
                                <span>${won.giftPrice}</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div id={c.actions}>
                        <button id={c.shaped3} style={{color:"white"}}
                        onClick={()=> {setPlaceholders(10);setWon(()=>null);setRepetitiveCurve(makeOccuranceRate(caseInfo.caseGifts));}}
                        >
                            OPEN AGAIN <Image src={"/redo.png"} alt={"re-open the case"} width={20} height={20} />
                        </button>
                        <button id={c.shaped2} style={{color:"white"}} onClick={handleSellGift} disabled={sellButtonDisabled}>
                            {sellButtonText}
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
                }                    
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

            {
                universalModal && 
                <Universal_modal>
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
                </Universal_modal>
            }
            
        </div>
        </>
     );
}
 
export default Case_page;