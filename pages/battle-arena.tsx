import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Wrapper from "../components/wrapper";
import a from "../styles/BattleArena.module.css";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import Image from "next/image";

const BattleArena = () => {
    const router = useRouter();
    const {query} = router;
    const [battleInfo, setBattleInfo] = useState<any>();
    const allCases = useSelector((state:any)=> state.loginSlice.allCases);
    const casesInBattle = allCases && battleInfo && allCases.filter((c:any)=>battleInfo.casesinbattle.includes(c._id) );
    console.log(casesInBattle)

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
                            <Image src={cs.caseImageURL} alt="case" width={65} height={80} />
                        )
                    }
                </div>
                <div className={a.arena_kernel_warriors}>
                    {
                      battleInfo && [...Array(battleInfo.playernumber)].map((w,i)=>
                      <div className={a.arena_kernel_warriors_each}>

                      </div>
                      )
                    }
                </div>
            </div>
        </div>
    </Wrapper>
     );
}
 
export default BattleArena;