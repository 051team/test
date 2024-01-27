import h from "../styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState,useRef, useCallback } from "react";
import _051 from "../public/051.jpg";
import { useSession } from 'next-auth/react';
import { colorGenerator, compareObjects, formatter } from "../tools";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { note_ownDrop } from "../redux/loginSlice";
import Pusher from "pusher-js";

const Livedrop = () => {
    const [dropId, setDropId] = useState("");
    const [drops, setDrops] = useState<any>(null);   
    const ownDrop = useSelector((state:any)=> state.loginSlice.ownDrop);
    const dispatch = useDispatch();

    const [timefromPusher,setTime] = useState("");
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: "eu",
        });
    
        const channel = pusher.subscribe("chat");
    
        channel.bind("chat-event", (data:any) => {
          console.log(data.currentTime)
          setTime(data.currentTime)
        });
    
        return () => {
          pusher.unsubscribe("chat");
        };
      }, []);

      const handleTestPusher = async () => {
        const response = fetch("/api/pusher", {
            method:"POST",
            body:"HELLO PUSHER"
         })
      };


    //handle drop after case opening and animation
    useEffect(()=>{
        if(ownDrop && Array.isArray(ownDrop)){
            const addItem = (item: any) => {
                setDrops((previous: any) => {
                    setDropId(()=>"drop");
                    const updatedDrops = [item, ...previous.slice(0, previous.length - 1)];
                    setTimeout(() => {
                        setDropId("");
                    }, 1000);
                    return updatedDrops;
                });
            };
    
            ownDrop.forEach((item, index) => {
                setTimeout(() => addItem(item), index * 1200);
            });
            dispatch(note_ownDrop(null));
        }
        else if(ownDrop && typeof ownDrop === "object"){
            setDrops((previous:any)=>{
                const updatedDrops = [ownDrop, ...previous.slice(0,previous.length-1)];
                return updatedDrops;
            })
            setDropId("drop");
            setTimeout(() => {
                setDropId("");
            }, 1000);
            dispatch(note_ownDrop(null));
        }
    },[ownDrop])

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

    const [gift,setGift] = useState<any>();
    const [ES,setES] = useState<EventSource>();
    
/* 
    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
        setES(eventSource);
        const addItem = (item: any) => {
            setDrops((previous: any) => {
                setDropId(()=>"drop");
                const updatedDrops = [item, ...previous.slice(0, previous.length - 1)];
                setTimeout(() => {
                    setDropId("");
                }, 1000);
                return updatedDrops;
            });
        };
        eventSource.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            dispatch(note_TotalCasesOpened(totalCasesOpened+2))
            console.log(eventData)
            eventData.forEach((item:any, index:any) => {
                setTimeout(() => addItem(item), index * 1200);
            });
        };
        return () => {
          eventSource.close();
        };
      }, [totalCasesOpened]); */
    

    return ( 
        <div className={h.home_navbar_slider} style={{width:drops ? (drops.length+1)*110 : "fit-content", minWidth:!drops ? "2300px" : "none"}}>
            <button key={99} id={h.usual} style={{zIndex:99}} onClick={handleTestPusher}>
                    <Image priority src={"/assets/live.png"} alt={"051 logo"} width={60} height={60} style={{filter:"brightness(1.9)"}} />
                    <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                        <span style={{fontWeight:"bolder"}}>LIVEDROP {drops && drops.length}</span>
                        <span>{timefromPusher}</span>
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