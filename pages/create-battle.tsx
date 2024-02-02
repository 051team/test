import Wrapper from "../components/wrapper";
import b from "../styles/Battles.module.css";
import Image from "next/image";
import gamer from "../public/gamer.png";
import crazy from "../public/crazy.png";
import bot from "../public/bot.png";
import cost from "../public/cost.png";
import swords from "../public/swords.png";
import { useSelector } from "react-redux";
import Universal_modal from "../components/universal_modal";
import { useDispatch } from "react-redux";
import { note_notification, note_universal_modal } from "../redux/loginSlice";
import React, { useEffect, useState } from "react";
import { formatter } from "../tools";
import { useSession } from "next-auth/react";


const CreateBattle = () => {
    const {data:session} = useSession();
    const universalModal = useSelector((state:any)=>state.loginSlice.universal_modal);
    const allCases = useSelector((state:any)=>state.loginSlice.allCases);
    const dispatch = useDispatch();
    const [casesinBattle, setCasesinBattle] = useState<any[] | null>([]);
    const [battleConfig, setBattleConfig] = useState<{players:number,withbots:boolean,crazymode:boolean}>
                                                    ({players:2,withbots:false,crazymode:false});
    const caseAdded = (ccase:any) => casesinBattle?.some((e)=>e._id === ccase._id);
    const totalBattleCost = casesinBattle?.reduce((total,cas)=>{ return total + cas.casePrice},0);

    const [tempoText,setTempo] = useState<null | {message:string,color:string} >(null);
    
    const handleAddCasetoBattle = (c:any,e:any) => {
        e.stopPropagation()
        if(casesinBattle && casesinBattle.some((it)=>it._id === c._id )){
            console.log("already added");
            const newCases = casesinBattle.filter((e)=>e._id !== c._id);
            setCasesinBattle(newCases);
        }else{
            const {_id, caseName, casePrice, caseImageURL } = c;
            const needed = {_id, caseName, casePrice, caseImageURL }
            setCasesinBattle((prevCases:any) => [...prevCases, needed]);
        }
    }

    const handlePlayerNumber = (e:any) => {
        setBattleConfig({...battleConfig, players:e.target.value})
    }
    const handleWithBots = (e:any) => {
        const withBots = e.target.checked;
        setBattleConfig({...battleConfig, withbots:withBots})
    }
    const handleCrazyMode = (e:any) => {
        const cazryMod = e.target.checked;
        setBattleConfig({...battleConfig, crazymode:cazryMod})
    }

    const handleCreateBattle = async () => {
        const battleInfoReady = casesinBattle && casesinBattle?.length > 0;
        if(!battleInfoReady){
            dispatch(note_notification("No case added yet!"));
            setTimeout(() => {
                dispatch(note_notification(null));
            }, 2000);
            return
        }
        setTempo({message:"Creating Battle...",color:"silver"})
        try {
            const response = await fetch("/api/createbattle",{
                method:"POST",
                body:JSON.stringify({casesinBattle:casesinBattle,battleConfig:battleConfig, boss:session?.user})
            });
            if(response.status === 200){
                const resJson = await response.json();
                const stamp = resJson.stamp;
                window.location.href = `/battle-arena?st=${stamp}`;
            }

        } catch (error) {
            console.log("C1111", error)
        }
    }

    return ( 
        <Wrapper title="Create new battle">
            <div className={b.battles}>
                <div className={b.battles_kernel}>
                    {
                        tempoText && <div id={b.shield}><h3 style={{color:tempoText.color}}>{tempoText.message}</h3></div>
                    }
{/*                     <h1 style={{color:"white"}}>
                        {battleConfig.players} - 
                        {battleConfig.withbots ? "bots on" : "bots off"} - 
                        {battleConfig.crazymode ? "crazymode on" : "crazymode off"}
                    </h1> */}
                    <div className={b.battles_kernel_options}>
                        <span id={b.double}>
                            <Image alt="players" src={gamer} width={30} height={30} /> 
                                PLAYERS
                        </span>
                        <div id={b.radios}>
                            <input name="players" type="radio" defaultChecked value={2} onChange={(e)=>handlePlayerNumber(e)} />
                            <input name="players" type="radio" value={3} onChange={(e)=>handlePlayerNumber(e)}/>
                            <input name="players" type="radio" value={4} onChange={(e)=>handlePlayerNumber(e)}/>
                            <input name="players" type="radio" value={0} onChange={(e)=>handlePlayerNumber(e)}/>
                        </div>
                        <span id={b.double}>
                            <Image alt="play with bots" src={bot} width={35} height={35} /> 
                            PLAY WITH BOTS
                            <input id="activatebots" type="checkbox" onChange={(e)=>handleWithBots(e)} />
                            <label htmlFor="activatebots"></label>
                        </span>
                        <span id={b.double}>
                            <Image alt="crazy mode" src={crazy} width={35} height={35} /> 
                            CRAZY MODE
                            <input id="activatecrazy" type="checkbox" onChange={(e)=>handleCrazyMode(e)} />
                            <label htmlFor="activatecrazy"></label>
                        </span>
                        <span id={b.double}>
                            <Image alt="battle cost" src={cost} width={35} height={35} /> 
                            BATTLE COST: <span style={{color:"white"}}>{formatter(totalBattleCost)}</span>
                        </span>
                    </div>
                    <div className={b.battles_kernel_createbattle}>
                        <button disabled={allCases ? false : true} onClick={handleCreateBattle}>CREATE BATTLE FOR {formatter(totalBattleCost)}</button>
                    </div>
                    <div id={b.newbattle}>
                        {
                            casesinBattle && casesinBattle.length > 0 &&
                            casesinBattle.map((c,i)=>
                                <div id={b.added} key={i}>
                                    <Image alt="case image" src={c.caseImageURL} width={212} height={250} />
                                    <button onClick={()=>setCasesinBattle((prev:any)=>{return prev.filter((e:any)=>e !== c)})}>X</button>
                                    <span>
                                        <p>{c.caseName}</p>
                                        <p>{formatter(c.casePrice)}</p>
                                    </span>
                                </div>
                            )
                        }
                        <button id={b.addcase} disabled={allCases ? false : true} onClick={(e)=>{e.stopPropagation();dispatch(note_universal_modal(true))}}>
                            <div>
                                <Image alt="battle cost" src={swords} width={100} height={100} /> 
                                <h3>ADD CASE</h3>
                                <span></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            {
                universalModal &&
                <Universal_modal>
                    <div className={b.cases}>
                        <div id={b.options}>
                            <h4>ADD CASE</h4>
                            {
                                casesinBattle && casesinBattle?.length > 0 &&
                                <button onClick={()=>dispatch(note_universal_modal(false))}>DONE</button>
                            }
                            <h4 id={b.cost}>BATTLE COST: <span style={{color:"greenyellow"}}>{formatter(totalBattleCost)}</span></h4>
                        </div>
                        <div id={b.kernel}>
                        {
                        allCases.map((c:any,i:any)=>
                        <button id={b.each} key={i} onClick={(e)=>handleAddCasetoBattle(c,e)}>
                            {caseAdded(c) && <div id={b.added}> &#10003; </div>}
                            <Image alt="case image" src={c.caseImageURL} width={200} height={300} />
                            <span>{c.caseName} <br /> {formatter(c.casePrice)}</span>
                        </button>
                        )
                        }
                        </div>
                    </div>
                </Universal_modal>
            }
        </Wrapper>
        );
}
 
export default CreateBattle;