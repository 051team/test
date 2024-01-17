import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator } from "../tools";


const Livedrop = () => {
    const { data: session } = useSession();
    const hopit = useRef<HTMLInputElement>(null);
    const [dropId, setDropId] = useState("");

    const [inventory,setInventory] = useState<any>();
    
    const handleDrop = () => {
            if(hopit.current){
                hopit.current.checked = true;
            }
            setDropId(()=>"drop");
            const randomIndex = Math.floor(Math.random() * inventory.length-1);
            const newItem = inventory[randomIndex];
            setInventory(()=>[newItem,...inventory])
            setTimeout(() => {
                setDropId("");
                hopit.current!.checked = false;
            }, 1000);
    }

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
                        const propertyAddedResJson = resJson.map((item:any) => {
                            return { ...item, isSold: item.isSold !== true ? false : item.isSold }});
                        const sortedResJson = propertyAddedResJson.sort((a:any,b:any)=> {return a.isSold - b.isSold});
                        console.log(resJson);
                        console.log(sortedResJson)
                        setInventory(sortedResJson);
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
        <div className={h.home_navbar_slider} style={{width:(inventory && inventory.length+1)*110}}>
        <button key={99} onClick={handleDrop} id={h.usual}>
                <Image priority src={"/assets/live.png"} alt={"051 logo"} width={60} height={60} style={{filter:"brightness(1.9)"}} />
                <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                    <span style={{fontWeight:"bolder"}}>LIVEDROP</span>
                </div>
        </button>
        <input id="cx" type="checkbox" ref={hopit} />
        {
           inventory && inventory.map((e:any,i:number) =>
            <button id={ (i === 0 && dropId === "drop") ? h.drop : h.usual} key={i} style={{
                backgroundImage: e.giftId === 1 ? "linear-gradient(rgb(5 5 18), #0b1649)" : 
                                 e.giftId === 2 ?   "linear-gradient(rgb(16 2 16), #2b0741)" :
                                 e.giftId === 3 ?   "linear-gradient(rgb(3 8 3), #072f1c)" :
                                 e.giftId === 4 ?   "linear-gradient(rgb(28 17 2), #a37610)" :
                                 e.giftId === 5 ?   "linear-gradient(rgb(8 1 1), #4b051f)" :
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
    </div>
     );
}
 
export default Livedrop;