import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef, useCallback } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator, formatter } from "../tools";


const Livedrop = () => {
    const [dropId, setDropId] = useState("");
    const [drops, setDrops] = useState<any>();   
    const [test,setTest] = useState(false);

    // initial fetch to populate livedrop
    useEffect(()=>{
        const fetchDrops = async () => {
            try {
                const response = await fetch("/api/livedrops");
                if(!response.ok){alert("Fetch opearation failed!"); return}
                if(response.status === 200){
                    const allDrops = await response.json();
                    setDrops(allDrops.slice(allDrops.length-20,allDrops.length).reverse());
                }else{
                    console.log(response.status, response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDrops();
    },[])

    useEffect(()=>{
        const fetchDrops = async () => {
            try {
                const response = await fetch("/api/livedrops");
                if(!response.ok){alert("Fetch opearation failed!"); return}
                if(response.status === 200){
                    const allDrops = await response.json();
                    console.log(allDrops)
                }else{
                    console.log(response.status, response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDrops();
    },[test])

    //Livedrop actions
/*     useEffect(() => {
        const dropInterval = setInterval(() => {
            setDropId(()=>"drop");
        }, 3000);

        return () => {
            clearInterval(dropInterval);
        };
    }, []);

    useEffect(()=>{
        if(dropId === "drop" && inventory){
            const newItem = inventory[10];
            setInventory((prevInventory:any) => {
                const newItem = inventory[10];
                return [newItem, ...prevInventory];
            });
        }
    },[dropId]);

    useEffect(()=>{
        setTimeout(() => {
            setDropId("");
        }, 1000);
    },[dropId])    
*/

    return ( 
        <div className={h.home_navbar_slider} style={{width:(drops && drops.length+1)*310 ?? "fit-content", minWidth:!drops ? "2300px" : "none"}}>
            <button key={99} id={h.usual} onClick={()=>setTest(pr=>!pr)} >
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