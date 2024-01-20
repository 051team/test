import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef, useCallback } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator, compareObjects, formatter } from "../tools";


const Livedrop = () => {
    const [dropId, setDropId] = useState("");
    const [drops, setDrops] = useState<any[]>();   
    const [newDrops, setNewdrops] = useState<any[]>();

    // initial fetch to populate livedrop
    useEffect(()=>{
        const fetchDrops = async () => {
            try {
                const response = await fetch("/api/livedrops");
                if(!response.ok){alert("Fetch opearation failed!"); return}
                if(response.status === 200){
                    const allDrops = await response.json();
                    setDrops(allDrops);
                }else{
                    console.log(response.status, response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDrops();
    },[])

    const fetchNewDrops = async () => {
        try {
            const response = await fetch("/api/livedrops");
            if(!response.ok){alert("Fetch opearation failed!"); return}
            if(response.status === 200){
                const newAllDrops = await response.json();
                const itemsNotInOlds = newAllDrops.filter((newbie:any) => !drops?.some((old:any) => compareObjects(old, newbie)));
                if(itemsNotInOlds.length !== 0){
                    setNewdrops(itemsNotInOlds)
                }
            }else{
                console.log(response.status, response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        let intervalNewDrops:any;
        if(drops){
            intervalNewDrops = setInterval(()=>{
                fetchNewDrops();
            },5000)
        }
        return () => {
            clearInterval(intervalNewDrops);
        }
    },[drops])

    useEffect(()=>{
        if(newDrops){
            const dropInterval = setInterval(() => {
                setDropId(()=>"drop");
            }, 3000);
    
            return () => {
                clearInterval(dropInterval);
            };
        }
    },[newDrops])

    useEffect(()=>{
        if(dropId === "drop" && drops && newDrops && newDrops.length > 0){
            const newItem = newDrops[0]
            setDrops((prevInventory:any) => {
                return [newItem, ...prevInventory];
            });
            setNewdrops((prevNewDrops:any) => prevNewDrops.slice(1));
            setTimeout(() => {
                setDropId(()=>"");
            }, 1000);
        }
    },[dropId,newDrops]);

    return ( 
        <div className={h.home_navbar_slider} style={{width:drops ? (drops.length+1)*310 : "fit-content", minWidth:!drops ? "2300px" : "none"}}>
            <button key={99} id={h.usual} style={{zIndex:99}}>
                    <Image priority src={"/assets/live.png"} alt={"051 logo"} width={60} height={60} style={{filter:"brightness(1.9)"}} />
                    <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                        <span style={{fontWeight:"bolder"}}>LIVEDROP</span>
                    </div>
            </button>
            {
            drops && drops.map((e:any,i:number) =>
                <button id={ (i === 0 && dropId === "drop") ? h.drop : h.usual} key={i} style={{
                    backgroundImage: colorGenerator(e.giftPrice)
                }}>
                    <Image priority={i < 10 ? true : false} src={(e.giftURL)} alt={"051 logo"} width={45} height={45} />
                    <div id={h.text}>
                        <span>{e.giftName}</span>
                        <span>{formatter(e.giftPrice)}</span>
                    </div>
                </button>
                )
            }
                        {
            !drops && [...Array(20)].map((e:any,i:number) =>
                <button id={h.placeholder} key={i} style={{ width:"110px", height:"110px"
                }}>
                    
                </button>
                )
            }
        </div>
     );
}
 
export default Livedrop;