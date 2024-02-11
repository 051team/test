
import a from "../styles/BattleArena.module.css";
import Image from "next/image";
import BattleSlider from "../components/battleSlider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatter } from "../tools";




const Warrior = ({contestants, resultsforEach,popSliders,handleLeaveBattle,i,round,setRound,winner,battlecost,
                 battleStarted,casesInBattle,showJoinButton,joining,handleJoinBattle}:any) => {
    const slotFull = (i:number) => (contestants && contestants[i]);
    const {data:session} = useSession();

    //const [round,setRound] = useState(0);
    const [roundResult,setRoundResult] = useState<any>();
    const [spin,setSpin] = useState(false);
    const [caseInfo, setCaseInfo] = useState<any>(); 
    const [wonSoFar, setWonSoFar] = useState<any[]>();
    const totalRevenue = wonSoFar ? wonSoFar.reduce((acc,val)=>{return acc + parseFloat(val.giftPrice)},0) : 0;
    const [theend,setTheEnd] = useState(false);

    useEffect(() => {
        if (resultsforEach && resultsforEach.contestantWons.length > 0) {
          let currentRound = round;
          setCaseInfo(casesInBattle[currentRound])
          setTimeout(() => {
            setSpin(true);
            setRoundResult([resultsforEach.contestantWons[currentRound].won]);
          }, 2000);
          setTimeout(() => {
            setWonSoFar((pr:any) => {
            const updatedWonSoFar = pr? [...pr,resultsforEach.contestantWons[currentRound].won] : [resultsforEach.contestantWons[currentRound].won]
            return updatedWonSoFar
          })
          }, 7000);
          const updateRound = () => {
            currentRound++;
            if (currentRound < resultsforEach.contestantWons.length) {
              setCaseInfo(casesInBattle[currentRound])
              setSpin(false);
              setTimeout(() => {
                if(i === 0){
                    setRound(currentRound);
                }
                setRoundResult([resultsforEach.contestantWons[currentRound].won]);
                setSpin(true);
              }, 2000); // Delay to simulate a pause between spins, adjust as needed
              setTimeout(() => {
                setWonSoFar((pr:any) => {
                const updatedWonSoFar = pr? [...pr,resultsforEach.contestantWons[currentRound].won] : [resultsforEach.contestantWons[currentRound].won]
                return updatedWonSoFar
              })
              }, 7000);
      
              setTimeout(updateRound, 9000);
            } else {
              setTheEnd(true)
            }
          };
      
          // Schedule the first round update after the initial display
          const timeoutId = setTimeout(updateRound, 9000); // Adjust time as needed      
          return () => clearTimeout(timeoutId);
        }
      }, [resultsforEach]);

    return (     

    <div className={a.arena_kernel_warriors_each} key={i}>
            {
                popSliders &&
                <div id={a.roll}>
                    <BattleSlider 
                        caseInfo={caseInfo} 
                        multiplier={1} 
                        verticalSpin={spin} 
                        multiWon={roundResult}
                        play={i}
                    />
                </div>
            }
            {
                !popSliders &&
                <div id={a.beforeroll}>
                {
                    slotFull(i) && contestants && contestants![i].id === (session?.user as any).id && 
                    <button onClick={handleLeaveBattle} id={a.exit}>EXIT</button>
                }
    
                {
                    slotFull(i) && <div style={{background:"green",filter: "brightness(1.9)"}} id={a.placeholder}>&#10004;</div> 
                }
                {
                    !slotFull(i) && 
                    <>                                                
                        <div style={{background:"purple",filter: "brightness(0.9)"}} id={a.placeholder}>
                            <span className={a.wait}></span>
                        </div> 
                        {
                            showJoinButton &&
                            <button 
                            style={{opacity:joining ? "0.3" : "1"}} 
                            disabled={joining ? true : false} onClick={handleJoinBattle}>
                                {joining ? joining : "JOIN BATTLE NOW"}
                            </button>
                        }
    
                    </>
                }
                </div>
            }
    
            <div id={a.attendant}>
                {
                    slotFull(i) ?
                    <>
                    <Image src={contestants![i].image} alt="attendant" width={40} height={40} />
                    <span>{contestants![i].name}</span>
                    <span>Total: {formatter(totalRevenue)}</span>
                    </>
                    :
                    <span style={{color:"white",position:"relative",left:"20%", fontSize:"12px"}}>Waiting for player</span>
                }
            </div>
            {
                theend &&
                <div id={a.winner}>
                    <div>

                    <h1 style={{color:winner && winner.totalWonGiftPrices === totalRevenue ? "gold" : "crimson"}}>
                        {winner && winner.totalWonGiftPrices === totalRevenue ? "WON" : "LOST"}
                    </h1>
                            <span style={{color:winner && winner.totalWonGiftPrices === totalRevenue ? "gold" : "crimson"}}>
                                {winner && winner.totalWonGiftPrices === totalRevenue   
                                        ? formatter(totalRevenue) : formatter(battlecost*0.01)}
                            </span>
                    </div>
                </div>

            }
            {
            wonSoFar &&
            <div id={a.playerwons}>
                {
                    wonSoFar.map((w,i) =>
                    <div id={a.each} key={i}>
                        <Image src={w.giftURL} alt="won gift" width={70} height={80} />
                        <span>{ w.giftName}</span>
                        <span>{ formatter(w.giftPrice)}</span>
                    </div>
                    )
                }
            </div>
            }                            
    </div>
     );
}
 
export default Warrior;