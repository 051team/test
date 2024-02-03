import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Wrapper from "../components/wrapper";
import a from "../styles/BattleArena.module.css";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import Image from "next/image";
import BattleSlider from "../components/battleSlider";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

const BattleArena = () => {
    const router = useRouter();
    const {data:session} = useSession();
    const {query} = router;
    const [battleInfo, setBattleInfo] = useState<any>();
    const allCases = useSelector((state:any)=> state.loginSlice.allCases);
    const casesInBattle = allCases && battleInfo && allCases.filter((c:any)=>battleInfo.casesinbattle.includes(c._id) );
    const [contentants,setContestants] = useState<any[]>(); 
    const slotFull = (i:number) => (contentants && contentants[i]);
    const [joining, setJoining] = useState<string | null>(null);
    const popSliders = contentants && battleInfo && contentants?.length === battleInfo.playernumber;

    useEffect(()=>{
        if(!contentants && session && battleInfo){
            if((session.user as any).id === battleInfo.boss){
                console.log((session.user as any).id, battleInfo.boss);
                setContestants([session?.user]);
            }
        }
    },[session,battleInfo]);

    useEffect(()=>{
        const fetchBattle = async () => {
            const response = await fetch(`/api/fetchbattle?st=${query.st}`);
            if(response.status === 200){
                const resJson = await response.json();
                const battle = resJson.battle;
                setBattleInfo(battle);
            }
        }
        if(query.st && !battleInfo){
            fetchBattle();
        }
    },[query]);

    // start listening "battle" channel
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: "eu",
        });
        const channel = pusher.subscribe("arena");
        channel.bind("arena-event", (data:any) => {
          console.log(data.newContestant);
          setContestants((pr:any)=>{
            return [...pr, data.newContestant]
          });
        });
    
        return () => {
          pusher.unsubscribe("arena");
        };
      }, []);
    
    const handleJoinBattle = async () => {
        if(!session || (session && contentants?.some((c)=>c.id === (session.user as any).id))){
            console.log("already in");
            return
        }
        setJoining("Joining Battle");
        const response = await fetch("/api/arena",{
            method:"POST",
            body:JSON.stringify({user:session?.user,battle:query.st})
        });
        setJoining(null);
    }

    return ( 
    <Wrapper title="Battle Arena">
        <div className={a.arena}>
            <div className={a.arena_kernel}>
                <div className={a.arena_kernel_inside}>
                    {
                        casesInBattle && casesInBattle.map((cs:any,index:any) =>
                            <Image src={cs.caseImageURL} alt="case" width={65} height={80} key={index} style={{marginRight:"10px"}} />
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
                <div className={a.arena_kernel_warriors} id={battleInfo ? "" : a.loading} key={-1}>
                    {
                     casesInBattle && battleInfo && [...Array(battleInfo.playernumber)].map((w,i)=>
                     <>
                      <div className={a.arena_kernel_warriors_each} key={i}>

                        {
                            popSliders &&
                            <div id={a.roll}>
                                <BattleSlider caseInfo={casesInBattle[0]} multiplier={1} />
                            </div>
                        }
                        {
                            !popSliders &&
                            <div id={a.beforeroll}>
                            {
                                slotFull(i) && <div style={{background:"green",filter: "brightness(1.9)"}} id={a.placeholder}>&#10004;</div> 
                            }
                            {
                                !slotFull(i) && 
                                <>                                                
                                    <div style={{background:"purple",filter: "brightness(0.9)"}} id={a.placeholder}>
                                        <span className={a.wait}></span>
                                    </div> 
                                    <button 
                                        style={{opacity:joining ? "0.3" : "1"}} 
                                        disabled={joining ? true : false} onClick={handleJoinBattle}>
                                            {joining ? joining : "JOIN BATTLE NOW"}
                                    </button>
                                </>
                            }
                            </div>
                        }

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
