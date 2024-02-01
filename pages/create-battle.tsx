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
import { note_universal_modal } from "../redux/loginSlice";
import { useEffect, useState } from "react";
import { formatter } from "../tools";


const CreateBattle = () => {
    const universalModal = useSelector((state:any)=>state.loginSlice.universal_modal);
    const allCases = useSelector((state:any)=>state.loginSlice.allCases);
    const dispatch = useDispatch();
    const [casesinBattle, setCasesinBattle] = useState<any[] | null>([]);
    
    const handleAddCasetoBattle = (c:any,e:any) => {
        e.stopPropagation()
        if(casesinBattle && casesinBattle.includes(c)){
            console.log("already added");
            const newCases = casesinBattle.filter((e)=>e!==c);
            setCasesinBattle(newCases);
        }else{
            setCasesinBattle((prevCases:any) => [...prevCases, c]);
        }
    }

    const caseAdded = (ccase:any) => casesinBattle?.some((e)=>e === ccase);
    const totalBattleCost = casesinBattle?.reduce((total,cas)=>{ return total + cas.casePrice},0);

    return ( 
        <Wrapper title="Create new battle">
            <div className={b.battles}>
                <div className={b.battles_kernel}>
                    <div className={b.battles_kernel_options}>
                        <span id={b.double}>
                            <Image alt="players" src={gamer} width={30} height={30} /> 
                                PLAYERS
                        </span>
                        <div id={b.radios}>
                            <input name="players" type="radio" defaultChecked />
                            <input name="players" type="radio" />
                            <input name="players" type="radio" />
                            <input name="players" type="radio" />
                        </div>
                        <span id={b.double}>
                            <Image alt="play with bots" src={bot} width={35} height={35} /> 
                            PLAY WITH BOTS
                            <input id="activatebots" type="checkbox" />
                            <label htmlFor="activatebots"></label>
                        </span>
                        <span id={b.double}>
                            <Image alt="crazy mode" src={crazy} width={35} height={35} /> 
                            CRAZY MODE
                            <input id="activatecrazy" type="checkbox" />
                            <label htmlFor="activatecrazy"></label>
                        </span>
                        <span id={b.double}>
                            <Image alt="battle cost" src={cost} width={35} height={35} /> 
                            BATTLE COST: <span style={{color:"white"}}>{formatter(totalBattleCost)}</span>
                        </span>
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
                        <button id={b.addcase} onClick={(e)=>{e.stopPropagation();dispatch(note_universal_modal(true))}}>
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