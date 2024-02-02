import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Wrapper from "../components/wrapper";
import a from "../styles/BattleArena.module.css";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import Image from "next/image";
import BattleSlider from "../components/battleSlider";
import { useSession } from "next-auth/react";

const BattleArena = () => {
    const router = useRouter();
    const {data:session} = useSession();
    const {query} = router;
    const [battleInfo, setBattleInfo] = useState<any>();
    const allCases = useSelector((state:any)=> state.loginSlice.allCases);
    const casesInBattle = allCases && battleInfo && allCases.filter((c:any)=>battleInfo.casesinbattle.includes(c._id) );
    const [contentants,setContestants] = useState<any[]>(); 
    const slotFull = (i:number) => (contentants && contentants[i]);

    useEffect(()=>{
        if(session){
            setContestants([session.user]);
        }
    },[session])

    useEffect(()=>{
        const fetchBattle = async () => {
            const response = await fetch(`/api/fetchbattle?st=${query.st}`);
            if(response.status === 200){
                const resJson = await response.json();
                const battle = resJson.battle;
                setBattleInfo(battle);
            }
        }
        if(query.st){
            fetchBattle();
        }
    },[query]);

    return ( 
    <Wrapper title="Battle Arena">
        <div className={a.arena}>
            <div className={a.arena_kernel}>
                <div className={a.arena_kernel_inside}>
                    {
                        casesInBattle && casesInBattle.map((cs:any,index:any) =>
                            <Image src={cs.caseImageURL} alt="case" width={65} height={80} key={index} />
                        )
                    }
                    <div id={a.details}>
                        <div id={a.double}>
                            <p>ROUNDS</p>
                            <p style={{color:"crimson"}}>1/{(casesInBattle && casesInBattle.length) ?? "?"}</p>
                        </div>
                        <div id={a.double}>
                            <p>TOTAL PRICE</p>
                            <p style={{color:"lightgreen"}}>{(battleInfo && battleInfo.battleCost) ?? "$0:00"}</p>
                        </div>
                    </div>
                </div>
                <div className={a.arena_kernel_warriors} id={battleInfo ? "" : a.loading}>
                    {
                     casesInBattle && battleInfo && [...Array(battleInfo.playernumber)].map((w,i)=>
                     <>
                      <div className={a.arena_kernel_warriors_each}>
                        <div id={a.slider}>
                            {/* <BattleSlider caseInfo={casesInBattle[0]} multiplier={1} /> */}
                            {
                                slotFull(i) ? <div style={{background:"green",filter: "brightness(1.9)"}} id={a.placeholder}>&#10004;</div> 
                                            : <div style={{background:"purple",filter: "brightness(0.9)"}} id={a.placeholder}><span className={a.wait}></span></div> 
                            }
                        </div>
                        <div id={a.attendant}>
                            {
                                slotFull(i) ?
                                <>
                                <Image src={contentants![i].image} alt="attendant" width={40} height={40} />
                                <span>{contentants![i].name}</span>
                                </>
                                :
                                <span style={{color:"white",position:"relative",left:"20%", fontSize:"12px"}}>Waiting for player</span>
                            }
                        </div>
                      </div>
                      </>
                      )
                    }
                    {
                        !battleInfo && <Image src={"/swords.png"} alt="battle loading" width={100} height={100} />
                    }
                </div>
            </div>
        </div>
    </Wrapper>
     );
}
 
export default BattleArena;

function brightness(arg0: number): import("csstype").Property.Filter | undefined {
    throw new Error("Function not implemented.");
}
