
import a from "../styles/BattleArena.module.css";
import Image from "next/image";
import BattleSlider from "../components/battleSlider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";




const Warrior = ({contestants, resultsforEach,popSliders,handleLeaveBattle,i,round,setRound,
                 battleStarted,casesInBattle,showJoinButton,joining,handleJoinBattle}:any) => {
    const slotFull = (i:number) => (contestants && contestants[i]);
    const {data:session} = useSession();

    //const [round,setRound] = useState(0);
    const [roundResult,setRoundResult] = useState<any>();
    const [spin,setSpin] = useState(false);
    const [caseInfo, setCaseInfo] = useState<any>(); 
    const [wonSoFar, setWonSoFar] = useState<any[]>();

    useEffect(() => {
        if (resultsforEach && resultsforEach.contestantWons.length > 0) {
          let currentRound = 0;
          setSpin(true);
          setRoundResult([resultsforEach.contestantWons[currentRound].won]);
          setTimeout(() => {
            setWonSoFar((pr:any) => {
            const updatedWonSoFar = pr? [...pr,resultsforEach.contestantWons[currentRound].won] : [resultsforEach.contestantWons[currentRound].won]
            return updatedWonSoFar
          })
          }, 7000);
          const updateRound = () => {
            currentRound++;
            if (currentRound < resultsforEach.contestantWons.length) {
              setSpin(false);
              setTimeout(() => {
                if(i === 0){
                    setRound(currentRound);
                }
                setRoundResult([resultsforEach.contestantWons[currentRound].won]);
                setSpin(true);
              }, 1000); // Delay to simulate a pause between spins, adjust as needed
              setTimeout(() => {
                setWonSoFar((pr:any) => {
                const updatedWonSoFar = pr? [...pr,resultsforEach.contestantWons[currentRound].won] : [resultsforEach.contestantWons[currentRound].won]
                return updatedWonSoFar
              })
              }, 7000);
      
              setTimeout(updateRound, 7000);
            } else {
              //setSpin(false);
            }
          };
      
          // Schedule the first round update after the initial display
          const timeoutId = setTimeout(updateRound, 7000); // Adjust time as needed
      
          // Cleanup function to clear the timeout if the component unmounts
          return () => clearTimeout(timeoutId);
        }
      }, [resultsforEach]);
      

    useEffect(()=>{
        if(casesInBattle){
            setCaseInfo(casesInBattle[round]);
        }
    },[casesInBattle,round])

    return (     

    <div className={a.arena_kernel_warriors_each} key={i}>
            {
                popSliders &&
                <div id={a.roll}>
                    <BattleSlider 
                        caseInfo={casesInBattle[round]} 
                        multiplier={1} 
                        verticalSpin={spin} 
                        multiWon={roundResult ? roundResult : null}
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
                    </>
                    :
                    <span style={{color:"white",position:"relative",left:"20%", fontSize:"12px"}}>Waiting for player</span>
                }
            </div>
                {
                wonSoFar &&
                <div id={a.playerwons}>
                    {
                        wonSoFar.map((w,i) =>
                        <div id={a.each} key={i}>
                            <Image src={w.giftURL} alt="won gift" width={70} height={80} />
                            <span>{ w.giftName}</span>
                        </div>
                        )
                    }
                </div>
                }                            
    </div>
     );
}
 
export default Warrior;