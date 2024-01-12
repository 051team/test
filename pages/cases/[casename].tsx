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
import { formatter, generateRandomNumber } from "../../tools";

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

    const dispatch = useDispatch();


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

    const makeNumber = (n:number,lng:number) => {
        const remainder = n%lng;
        return remainder
    }

    const handleOpenCase = async () => {
        if(!session){confirm("Login required");return}
        if(caseOpenDisabled){
            confirm("Insufficient balance!");
            return
        };
        setTempoText("Opening");
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
            setTempoText("Opening..")
            setPlaceholders(50);
            setTimeout(() => {
                dispatch(note_balanceChange((pr:any)=>!pr));
            }, 500);
            setTimeout(() => {
                setTempoText(null);
            }, 8000);
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

    const handleSellGift =async () => {
        if(!won || tempoText === "Selling gift..."){return};
        setTempoText("Selling gift...")
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
                <h3>
                    {(caseInfo && caseInfo.caseName.toUpperCase()) ?? "LOADING..."}
                    <div id={c.index}>
                        <span>&#9660;</span>
                        <span>&#9650;</span>
                    </div>
                </h3>
            {
            (!won || (tempoText && tempoText !== "Selling gift...") )&&
            <>
                    
                <div className={c.casepage_case_kernel}>
                    <div className={c.casepage_case_kernel_spinner} style={{position:"relative", left:placeholders === 10 ? -(placeholders-10)*125 : -(((placeholders-10)*125)+generateRandomNumber())}}>
                    {
                       [...Array(placeholders)].map((e,i) =>
                        <button key={i} style={{
                            backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), darkorange)"
                                                    : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), lightgreen)"
                                                    : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), purple)"
                                                    : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
                        }}>
                            <Image src={
                               !caseInfo ? "/loading.png" : ( won && i === 44) ? won.giftURL : (caseInfo && caseInfo.caseGifts) ? caseInfo.caseGifts[makeNumber((i+1),caseInfo.caseGifts.length)].giftURL : ""} 
                            alt={"051 logo"} width={45} height={45} priority />
                            <div id={c.text}>
                                <span>{ !caseInfo ? "loading.." : (won && i === 44) ? won.giftName : caseInfo.caseGifts[makeNumber((i+1),caseInfo.caseGifts.length)].giftName}</span>
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
                        <button id={c.shaped2} style={{color:"white"}} onClick={handleOpenCase} disabled={won ? true : tempoText ? true : false}>
                {
                    tempoText ? tempoText : 
                    (caseInfo && balance && (caseInfo.casePrice <= balance )) ? `Pay $${caseInfo.casePrice}`:
                    (caseInfo && balance && caseInfo.casePrice > balance) ? `+ $${caseInfo.casePrice - balance} needed` :
                    !session ? "Login required!" : "Please wait..."
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
                            backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), darkorange)"
                                                    : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), blue)"
                                                    : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), purple)"
                                                    : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
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
            won && (!tempoText || tempoText === "Selling gift...") &&
            <>
                <div className={c.casepage_case_result}>
                    <div id={c.btn}>
                        <div id={c.chance}>Chance <br /> 30% </div>
                        <Image src={won.giftURL} alt={"won this gift"} width={90} height={90} />
                        <div id={c.text}>
                            <span>{won.giftName}</span>
                        </div>
                    </div>

                    <div id={c.ops}>
                        <button onClick={()=> {setPlaceholders(10);setWon(()=>null)}}>OPEN AGAIN <Image src={"/redo.png"} alt={"re-open the case"} width={20} height={20} /> </button>
                        <button onClick={handleSellGift}>{tempoText === "Selling gift..." ? tempoText : `SELL FOR ${formatter(won.giftPrice)}`}</button>
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
                            backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), darkorange)"
                                                    : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), blue)"
                                                    : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), purple)"
                                                    : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
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