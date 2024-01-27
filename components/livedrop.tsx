import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef, useCallback } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator, compareObjects, formatter } from "../tools";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Pusher from "pusher-js";

const Livedrop = () => {
    const [dropId, setDropId] = useState("");
    const [drops, setDrops] = useState<any>(null);   
    const ownDrop = useSelector((state:any)=> state.loginSlice.ownDrop);
    const dispatch = useDispatch();
    const [reserve,setReserve] = useState<any[]>([]);

    // add new drops to the live drop, listening to drop channel
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: "eu",
        });
        const channel = pusher.subscribe("drop");
        channel.bind("drop-event", (data:any) => {
          //console.log(data.itemtoAddtoLivedrop);
          const dropReceived = data.itemtoAddtoLivedrop;
          if (Array.isArray(dropReceived)) {
            // Spread the dropReceived array to add its items individually
            setReserve(reserve => [...dropReceived, ...reserve]);
            setPumpingGoingOn(false);
            } else {
                // Add a single item
                setReserve(reserve => [dropReceived, ...reserve]);
                setPumpingGoingOn(false);
            }
        });
    
        return () => {
          pusher.unsubscribe("drop");
        };
      }, []);
    

    const [isPumpingGoingOn, setPumpingGoingOn] = useState<boolean>(true);
    useEffect(() => {
        const addItem = (item: any) => {
            if(!isPumpingGoingOn){
                setPumpingGoingOn(true);
                setDropId(()=>"drop");
                setDrops((previous: any) => {
                    const updatedDrops = [item, ...previous.slice(0, previous.length - 1)];
                    return updatedDrops;
                });
                setTimeout(() => {
                    setDropId("");
                    setReserve(reserve => reserve.slice(1));
                }, 1000);
            }
        };
        reserve.forEach((item:any, index:any) => {
            setTimeout(() => {addItem(item);setPumpingGoingOn(false);}, index * 1200);
        });
    }, [isPumpingGoingOn]);



    // initial fetch to populate livedrop
    useEffect(()=>{
        const fetchDrops = async () => {
            try {
                const response = await fetch("/api/livedrops");
                if(!response.ok){alert("Fetch opearation failed!"); return}
                if(response.status === 200){
                    const allDrops = await response.json();
                    setDrops(allDrops);
                    console.log(allDrops)
                }else{
                    console.log(response.status, response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(!drops){
            fetchDrops();
        }
    },[])

    return ( 
        <div className={h.home_navbar_slider} style={{width:drops ? (drops.length+1)*110 : "fit-content", minWidth:!drops ? "2300px" : "none"}}>
            <button key={99} id={h.usual} style={{zIndex:99}}>
                    <Image priority src={"/assets/live.png"} alt={"051 logo"} width={60} height={60} style={{filter:"brightness(1.9)"}} />
                    <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                        <span style={{fontWeight:"bolder"}}>LIVEDROP {drops && drops.length}</span>
                        <span>{reserve.length}</span>
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