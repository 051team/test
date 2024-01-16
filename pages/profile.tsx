import Image from "next/image";
import Navbar from "../components/navbar";
import p from "../styles/Profile.module.css";
import { useSession } from 'next-auth/react';
import { useSelector,useDispatch } from "react-redux";
import { formatter } from "../tools";
import { useEffect, useRef, useState } from "react";
import { note_balanceChange } from "../redux/loginSlice";

const Profile = () => {
    const { data: session } = useSession();
    const username = session?.user?.name || "...";
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const bchange = useSelector((state:any) => state.loginSlice.bchange);
    const dispatch = useDispatch();
    const [inventory,setInventory] = useState<any>();
    const [tempoText,setTempoText] = useState<{text:string,no:number} | null>();
    const [filterItems, setFilter] = useState<boolean>(true);
    const slider = useRef<HTMLInputElement>(null);

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

    const handleSell = async (i:number,gift:any) => {
        setTempoText({text:"Selling...",no:i});
        try {
            const response = await fetch("/api/sellgift",{
                method:"POST",
                body:JSON.stringify({user:session?.user,gift:gift})
            })
            if(response.status === 200){
                const resJson = await response.json();
                setTempoText({text:"SOLD*",no:i});
                dispatch(note_balanceChange((pr:boolean)=>!pr));
                setTimeout(() => {
                    setTempoText(()=>null);
                }, 1000);
                const updatedInventory = inventory.map((e:any, i:number) => (e === gift ? { ...e, isSold: true } : e));
                setInventory(updatedInventory);
                console.log("UPDATED",updatedInventory);
            }else{
                console.log(response);
                setTempoText(null);
            }
        } catch (error) {
            console.log("Problem var",error)
        }
    }

    const handleSliderChange = () => {
        setFilter((pr)=>!pr);
    }
    const handleShowAll = () => {
        setFilter(false);
        if(slider.current && slider.current.checked){
            slider.current.checked = false;
        }
    }

    return ( 
        <div className={p.profile}>
            <div id={p.black}></div>
            <Navbar />
            <div className={p.profile_kernel}>
                <div className={p.profile_kernel_card}>
                    <Image src={"/assets/2.png"} alt="profile image" width={100} height={100} />
                    <div id={p.info}>
                        <h3>{username.toUpperCase()}</h3>
                        <h4>{formatter(balance)}</h4>
                    </div>
                </div>
                <div className={p.profile_kernel_line}>
                    <span id={p.title}>INVENTORY {tempoText && tempoText.text}</span>
                    <div id={p.sorting}>
                        <span>Show Active Items</span>
                        <div>
                            <label htmlFor="showactive"></label>
                            <input onChange={handleSliderChange} type="checkbox" id={"showactive"} defaultChecked ref={slider}/>
                            <div id={p.shift}>
                                <div id={p.ball}></div>
                            </div>
                        </div>
                        <button onClick={handleShowAll}>Show All</button>
                    </div>
                </div>
                <div className={p.profile_kernel_inventory}>
                    {
                        
                        inventory ? (filterItems ? inventory.filter((e:any) => e.isSold === false) : inventory).map((item:any,i:number)=>
                        <button key={i}>
                            <Image src={item.giftURL} alt={"inventory item"} width={90} height={100} />
                            <div id={p.act}>
                                <div id={p.dollar}>$</div>
                                <button style={{opacity:item.isSold ? "0" : "1"}} disabled={item.isSold ?? false} id={p.sell} 
                                    onClick={()=>handleSell(i,item)}>SELL</button>
                            </div>
                            <div id={p.text}>
                                {
                                    (tempoText && tempoText.no === i ) ?
                                    <span id={tempoText.text === "Selling..." ? p.shine : ""}>{tempoText.text}</span>          
                                                                        :
                                    <>
                                    <span>{item.giftName}</span>
                                    <span>{formatter(item.giftPrice)}</span>
                                    {
                                    item.isSold && 
                                        <span style={{fontWeight:"600",color:"crimson"}}>SOLD</span>
                                    }
                                    </>
                                }
                            </div>
                        </button>
                        )
                        :
                        [...Array(7)].map((item:any,i:number)=>
                        <button key={i}>
                            <Image src={"/loading.png"} alt={"inventory loading"} width={45} height={45} />
                            <div id={p.act}>
                                <div id={p.dollar}>$</div>
                            </div>
                            <div id={p.text}>
                                <span>loading...</span>
                            </div>
                        </button>
                        )
                    }
                    {
                        inventory && inventory.length === 0 && <h1>No items in the inventory</h1>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Profile;