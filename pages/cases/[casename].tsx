import Image from "next/image";
import { useSession } from 'next-auth/react';
import Navbar from "../../components/navbar";
import c from "../../styles/Casepage.module.css";
import _051 from "../../public/051.jpg";
import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import Modal from "../../components/modal";
import { useDispatch,useSelector } from "react-redux";
import { note_balanceChange, note_ownDrop, note_TotalCasesOpened } from "../../redux/loginSlice";
import { colorGenerator, formatter, generateRandomNumber, shuffleArray } from "../../tools";
import Universal_modal from "../../components/universal_modal";
import Notification from "../../components/notifybox";
import CaseContent from "../../components/casecontent";
import Odds from "../../components/odds";
import BottomBanner from "../../components/bottombanner";
import CaseInfo from "../../components/caseinfo";
import VerticalSlider from "../../components/vslider";
import Slider from "../../components/slider";

const Case_page = () => {
    const { data: session } = useSession();
    const [placeholders,setPlaceholders] = useState<number>(10);
    const [verticalplaceholders,setVerticalPlaceholders] = useState<number>(1);
    const howmanyPlaceholder = 100;
    const router = useRouter();
    const {cat,name} = router.query;
    const [caseInfo, setCaseInfo] = useState<any>();
    const [won,setWon] = useState<any>();
    const [multiWon,setMultiWon] = useState<any>();
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const [tempoText, setTempoText] = useState<string | null>();
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const [indexShift, setIndexShift] = useState<string>("0px");
    const universalModal = useSelector((state:any) => state.loginSlice.universal_modal);
    const totalCasesOpened = useSelector((state:any)=> state.loginSlice.totalCasesOpened);

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
                if(responseLiveDrop.status === 200){
                    setTimeout(() => {
                        dispatch(note_ownDrop(resJson.lucky));
                        dispatch(note_TotalCasesOpened(totalCasesOpened+1))
                    }, 4000);
                }
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

    const [multiplier,setMultplier] = useState<number | null>(2);
    const caseOpenDisabled = !balance || !caseInfo 
                            || ( caseInfo && balance && caseInfo.casePrice > balance)
                            || ( caseInfo && balance && multiplier && caseInfo.casePrice*multiplier > balance);
    const sliderVisible = (!multiWon && !won ) || (tempoText && tempoText !== "Selling..." && tempoText !== "SOLD" && tempoText !== "Failed to sell...");
    const verticalsliderVisible = (!multiWon && !won ) || (tempoText && tempoText !== "Selling..." && tempoText !== "SOLD" && tempoText !== "Failed to sell...");

    const resultVisible = won && (!tempoText || tempoText === "Selling..." || tempoText === "SOLD" || tempoText === "Failed to sell...");
    const multiresultVisible = multiWon && (!tempoText || tempoText === "Selling..." || tempoText === "SOLD" || tempoText === "Failed to sell...");

    const sellButtonText = (tempoText === "Selling..." || tempoText === "SOLD") ? tempoText : tempoText === "Failed to sell..." ? "Failed" 
                : `SELL FOR ${formatter(won && won.giftPrice)}`;
    const sellMultiButtonText = (tempoText === "Selling..." || tempoText === "SOLD") ? tempoText : tempoText === "Failed to sell..." ? "Failed" 
                : `SELL FOR ${formatter(multiWon && multiWon.reduce((accumulator:any, currentItem:any) => {
        return accumulator + parseFloat(currentItem.giftPrice)}, 0))}`;

    const sellButtonDisabled = tempoText ? true : false;
    const payButtonDisabled = (won || tempoText) ? true : false;
    const [repetitionCurve,setRepetitiveCurve] = useState<null | any[]>();

    const [horizontal,setHorizontal] = useState(true);
    const [vertical,setVertical] = useState(false);
    const XbuttonDisabled = tempoText ? true : false;


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

    const [verticalSpin,setVerticalSpin] = useState(false);


    const handleMultiIndex = (index:number) => {
        setMultplier(()=>index);
        setVertical(()=>true);
        setHorizontal(()=>false);
    }

    const handleOpenMultipleCase = async () => {
        if(!session){confirm("Login required");return}
        if(caseOpenDisabled){
            confirm("Insufficient balance!");
            return
        };
        setVerticalSpin(true);
        setTempoText("Opening...");
        try {
            const response = await fetch("/api/openmulticase",{
                method:"POST",
                body:JSON.stringify({
                    cat:cat,
                    name:name,
                    user:session?.user,
                    multiplier:multiplier
                })
            });
            if(response.status === 200){
                const resJson = await response.json();
                const wonItems = resJson.wonItems;
                setMultiWon(wonItems);
                setTimeout( async () => {
                    const responseLiveDrop = await fetch("/api/addtolivedrop",{
                        method:"POST",
                        body:JSON.stringify(wonItems)
                    })
                    if(response.status === 200){
                        dispatch(note_ownDrop(wonItems));
                        dispatch(note_TotalCasesOpened(totalCasesOpened+1))
                    }
                }, 7000);
            }else{
                console.log(response);
            }
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setTempoText(null);
            setVerticalSpin(false);
            dispatch(note_balanceChange((pr:boolean)=>!pr));
        }, 11000);
    }


    const handleMultiSellGift = async () => {
        if(!multiWon || tempoText === "Selling..."){return};
        setTempoText("Selling...");
        try {
            const response = await fetch("/api/sellmultigift", {
                method:"POST",
                body:JSON.stringify({gifts:multiWon,user:session?.user})
            });
            if(response.status === 200){
                setTempoText("SOLD");
                dispatch(note_balanceChange((pr:any)=>!pr));
                setTimeout(() => {
                    setTempoText(null);
                    setMultiWon(null);
                    setVertical(false);
                    setHorizontal(true);
                }, 2000);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <>
        <Navbar/>
        {
            feedback &&
            <Modal feedback={feedback} />
        }
        <div className={c.casepage}>
           <div id={c.bg}></div>
            <div className={c.casepage_case}>

            <CaseInfo caseInfo={caseInfo}/>
            
        {
            horizontal && sliderVisible &&
            <>
            <Slider 
                caseInfo = {caseInfo}
                placeholders = {placeholders}
                howmanyPlaceholder = {howmanyPlaceholder}
                indexShift = {indexShift}
                repetitionCurve = {repetitionCurve}
                won = {won}
                multiplier = {multiplier}
            />
            <div id={c.actions}>
                    <div id={c.shaped}>
                        <button disabled={XbuttonDisabled} onClick={()=>{setHorizontal(true);setVertical(false);setMultplier(null)}}>x1</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(2)}>x2</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(3)}>x3</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(4)}>x4</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(5)}>x5</button>
                    </div>
                    <button id={c.shaped2} style={{color:"white"}} 
                        onClick={ horizontal ? handleOpenCase : handleOpenMultipleCase} 
                        disabled={payButtonDisabled}>
                        {
                            tempoText ? tempoText : 
                            (caseInfo && balance && (caseInfo.casePrice <= balance )) && horizontal ? `Pay $${caseInfo.casePrice}`:
                            (caseInfo && balance && (caseInfo.casePrice*multiplier! <= balance )) && vertical ? `Pay $${caseInfo.casePrice*multiplier!}`:
                            (caseInfo && balance && (caseInfo.casePrice*multiplier! > balance )) && vertical ? `+ $${caseInfo.casePrice*multiplier! - balance} needed`:
                            (caseInfo && balance && caseInfo.casePrice > balance) ? `+ $${caseInfo.casePrice - balance} needed` :
                            !session ? "Login required!" : (session && balance === 0) ? "No balance!" : "Please wait..."
                        }
                    </button>
            </div> 
            </>
        }
        {
            vertical && verticalsliderVisible &&
            <>
            <VerticalSlider 
                caseInfo = {caseInfo}
                multiplier = {multiplier}
                verticalSpin={verticalSpin}
                multiWon={multiWon}
            /> 
            <div id={c.actions}>
                    <div id={c.shaped}>
                        <button disabled={XbuttonDisabled} onClick={()=>{setHorizontal(true);setVertical(false);setMultplier(null)}}>x1</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(2)}>x2</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(3)}>x3</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(4)}>x4</button>
                        <button disabled={XbuttonDisabled} onClick={()=>handleMultiIndex(5)}>x5</button>
                    </div>
                    <button id={c.shaped2} style={{color:"white"}} 
                        onClick={ horizontal ? handleOpenCase : handleOpenMultipleCase} 
                        disabled={payButtonDisabled}>
                        {
                            tempoText ? tempoText : 
                            (caseInfo && balance && (caseInfo.casePrice <= balance )) && horizontal ? `Pay $${caseInfo.casePrice}`:
                            (caseInfo && balance && (caseInfo.casePrice*multiplier! <= balance )) && vertical ? `Pay $${caseInfo.casePrice*multiplier!}`:
                            (caseInfo && balance && (caseInfo.casePrice*multiplier! > balance )) && vertical ? `+ $${caseInfo.casePrice*multiplier! - balance} needed`:
                            (caseInfo && balance && caseInfo.casePrice > balance) ? `+ $${caseInfo.casePrice - balance} needed` :
                            !session ? "Login required!" : (session && balance === 0) ? "No balance!" : "Please wait..."
                        }
                    </button>
            </div> 
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
        </>
        }
            
        {
        multiresultVisible &&
        <>
            <div className={c.casepage_case_kernel} id={c.main} style={{justifyItems:"center"}}>
                <div className={c.casepage_case_kernel_spinner}>
                    {
                        multiWon.map((wn:any,i:any)=> 
                        <button style={{backgroundImage:colorGenerator(wn.giftPrice)}} id={c.shinewon} key={i}
                        >
                            <Image src={wn.giftURL} alt={"051 logo"} width={90} height={100} />
                            <div id={c.luck}>
                                <span>Chance</span>
                                <span> %{wn.giftProbability/1000}</span>
                            </div>
                            <div id={c.text}>
                                <span>{wn.giftName}</span>
                                <span>${wn.giftPrice}</span>
                            </div>
                        </button>
                        )
                    }
                </div>
            </div>
            <div id={c.actions}>
                    <button id={c.shaped3} style={{color:"white"}}
                    onClick={()=> {setMultiWon(()=>null);setVertical(false); setHorizontal(true)}}
                    >
                        OPEN AGAIN <Image src={"/redo.png"} alt={"re-open the case"} width={20} height={20} />
                    </button>
                    <button id={c.shaped2} style={{color:"white"}} onClick={handleMultiSellGift} disabled={sellButtonDisabled}>
                        {sellMultiButtonText}
                    </button>
            </div>
        </>
        }

        { caseInfo && <CaseContent caseInfo = {caseInfo}/> } 
        < BottomBanner />
        </div>

        {
            universalModal && 
            <Universal_modal>
                <Odds caseInfo={caseInfo}/>
            </Universal_modal>
        }
        {/* <Notification /> */}
            
        </div>
        </>
     );
}
 
export default Case_page;