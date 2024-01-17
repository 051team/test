import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef, useCallback } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator } from "../tools";


const Livedrop = () => {
    const { data: session } = useSession();
    const [dropId, setDropId] = useState("");

    const [inventory,setInventory] = useState<any>(null);
    
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
    },[dropId]) */

    useEffect(()=>{
        const fetchInventory = async () => {
            try {
                const response = await fetch(`/api/fetchinventory?name=${session?.user?.name}&email=${session?.user?.email}`);
                if(!response.ok){
                    alert("Couldn't fetch inventory")
                }
                try {
                    const resJson = await response.json();
                    if(response.status === 200){
                        console.log(resJson);
                        if(!inventory){
                            setInventory(resJson);
                        }
                    }
                } catch (error) {
                    console.log("Response not in json format")
                }
            } catch (error) {
                console.log("Problem var!!!",error)
            }
        }
        if(session){
            fetchInventory();
        }
    },[session]);

    return ( 
        <div className={h.home_navbar_slider} style={{width:(inventory && inventory.length+1)*110 ?? "fit-content", minWidth:!inventory ? "2300px" : "none"}}>
            <button key={99} id={h.usual}>
                    <Image priority src={"/assets/live.png"} alt={"051 logo"} width={60} height={60} style={{filter:"brightness(1.9)"}} />
                    <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                        <span style={{fontWeight:"bolder"}}>LIVEDROP</span>
                    </div>
            </button>
            {
            inventory && inventory.map((e:any,i:number) =>
                <button id={ (i === 0 && dropId === "drop") ? h.drop : h.usual} key={i} style={{
                    backgroundImage: e.giftId && e.giftId === 1 ? "linear-gradient(rgb(5 5 18), #0b1649)" : 
                                    e.giftId && e.giftId === 2 ?   "linear-gradient(rgb(16 2 16), #2b0741)" :
                                    e.giftId && e.giftId === 3 ?   "linear-gradient(rgb(3 8 3), #072f1c)" :
                                    e.giftId && e.giftId === 4 ?   "linear-gradient(rgb(28 17 2), #a37610)" :
                                    e.giftId && e.giftId === 5 ?   "linear-gradient(rgb(8 1 1), #4b051f)" :
                                    "linear-gradient(rgb(8 1 1), gold)"
                }}>
                    <Image priority={i < 10 ? true : false} src={(inventory && inventory[i].giftURL )?? "/loading.png"} alt={"051 logo"} width={45} height={45} />
                    <div id={h.text}>
                        <span>Item no</span>
                        <span>$ 0.50</span>
                    </div>
                </button>
                )
            }
                        {
            !inventory && [...Array(20)].map((e:any,i:number) =>
                <button id={h.placeholder} key={i} style={{ width:"110px", height:"110px"
                }}>
                    
                </button>
                )
            }
        </div>
     );
}
 
export default Livedrop;