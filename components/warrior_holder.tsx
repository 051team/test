
import a from "../styles/BattleArena.module.css";
import Image from "next/image";
import BattleSlider from "../components/battleSlider";
import { useSession } from "next-auth/react";
import { useState } from "react";




const Warrior = ({contestants, battleResults,popSliders,handleLeaveBattle,i,
                 battleStarted,casesInBattle,showJoinButton,joining,handleJoinBattle}:any) => {
    const slotFull = (i:number) => (contestants && contestants[i]);
    const {data:session} = useSession();

    const [round,setRound] = useState(0);

    return (     
        <div className={a.arena_kernel_warriors_each} key={i}>

        {
            popSliders &&
            <div id={a.roll}>
                <BattleSlider 
                    caseInfo={casesInBattle[round]} 
                    multiplier={1} 
                    verticalSpin={battleStarted} 
                    multiWon={battleResults ? [battleResults[i].contestantWons[round].won] : null}
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
            battleResults &&
            <div id={a.playerwons}>
                <div id={a.each}>
                    <Image src={battleResults[i].contestantWons[round].won.giftURL} alt="won gift" width={70} height={80} />
                    <span>{ battleResults[i].contestantWons[round].won.giftName}</span>
                </div>
                <button style={{color:"white"}} onClick={()=>setRound(1)}>TEST</button>
            </div>
            }                            
      </div>
     );
}
 
export default Warrior;