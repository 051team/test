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
import Warrior from "../components/warrior_holder";

const BattleArena = () => {
    const router = useRouter();
    const {data:session} = useSession();
    const {query} = router;
    const [battleInfo, setBattleInfo] = useState<any>();
    const allCases = useSelector((state:any)=> state.loginSlice.allCases);
    const casesInBattle = allCases && battleInfo && allCases.filter((c:any)=>battleInfo.casesinbattle.includes(c._id) );
    const [contestants,setContestants] = useState<any[]>(); 
    const slotFull = (i:number) => (contestants && contestants[i]);
    const [joining, setJoining] = useState<string | null>(null);
    const popSliders = contestants && battleInfo && contestants?.length === battleInfo.playernumber;
    const [battleStarted, setBattleStarted] = useState(false);
    const [battleResults, setBattleResults] = useState<any>(null);
    const showJoinButton = !(session && contestants?.some((c)=>c.id === (session.user as any).id));
    const [winner,setWinner] = useState<any>();
    const [turnover,setTurnerover] = useState<any>();

    useEffect(()=>{
        const fetchBattle = async () => {
            const response = await fetch(`/api/fetchbattle`,{
                method:"POST",
                body:query.st?.toString()
            });
            if(response.status === 200){
                const resJson = await response.json();
                const battle = resJson.battle;
                console.log(resJson)
                setBattleInfo(battle);
                setContestants(resJson.contestants)
            }
        }
        if(query.st){
            fetchBattle();
        }
    },[query]);

    // start listening "battle" channel
    useEffect(() => {
        // Make sure query.st is not undefined or null before proceeding
          if (!query.st) {
              console.log('query.st is not defined yet.');
              return;
          }
          const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
              cluster: "eu",
            });
            const channel = pusher.subscribe("arena");
            channel.bind(query.st!.toString(), (data:any) => {
              console.log(data.newContestant);
              setContestants((pr:any)=>{
                return [...pr, data.newContestant]
              });
            });
            channel.bind(`player-quit${query.st}`, (data:any) => {
                console.log(data.wholeft, typeof data.wholeft, "WHOLEFT and type of WHOLEFT");
                if(data.wholeft === null){
                    router.push("/");
                }else{
                    setContestants((pr:any)=>{
                        const updatedContestants = pr.filter((c:any)=> c.id !== data.wholeft);
                        return updatedContestants
                    });
                }
            });
            channel.bind(`result${query.st}`, (data:any) => {
                console.log(data.battleResults, "BATTLE RESULTS ARRIVED VIA SOCKET");
                setBattleResults(data.battleResults);
                setWinner(data.winner);
                setTurnerover(data.turnover);
            });
            return () => {
              pusher.unbind_all();
              pusher.unsubscribe("arena");
              pusher.disconnect();
            };
    }, [query.st]);    
    

    useEffect(()=>{
        if(battleInfo && contestants){
            if(battleInfo.playernumber === contestants.length){
                console.log("battle full,can start");
                setBattleStarted(true);
            }
        }
    },[battleInfo, contestants]);
    
    const handleJoinBattle = async () => {
        if(!session || (session && contestants?.some((c)=>c.id === (session.user as any).id))){
            console.log("already in");
            return
        }
        if(battleStarted){
            return
        }
        setJoining("Joining Battle");
        const response = await fetch("/api/joinbattle",{
            method:"POST",
            body:JSON.stringify({user:session?.user,battle:query.st})
        });
        setJoining(null);
    }

    const handleLeaveBattle = async () => {
        alert("function fired for leave battle");
        try {
            const response = await fetch("/api/leavebattle",{
                method:"POST",
                body:JSON.stringify({user:session?.user,battle:query.st})
            });
            if(response.status === 200){
                const resJson = await response.json();
                console.log(resJson);
            }else{
                console.log("handleLeaveBattle response status:",response.status)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [round,setRound] = useState(0);

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
                            <p style={{color:"crimson"}}>{round+1}/{(casesInBattle && casesInBattle.length) ?? "?"}</p>
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
                        <Warrior 
                            contestants={contestants} 
                            resultsforEach ={battleResults && battleResults[i]}
                            popSliders = {popSliders}
                            handleLeaveBattle ={handleLeaveBattle}
                            i={i}
                            battleStarted = {battleStarted}
                            casesInBattle = {casesInBattle}
                            showJoinButton = {showJoinButton}
                            joining = {joining}
                            handleJoinBattle = {handleJoinBattle}
                            round={round}
                            setRound={setRound}
                            winner={winner}
                            turnover={turnover}
                            battlecost = {battleInfo && battleInfo.battleCost}
                        />
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
