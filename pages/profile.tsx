import Image from "next/image";
import Navbar from "../components/navbar";
import p from "../styles/Profile.module.css";
import { useSession } from 'next-auth/react';
import { useSelector } from "react-redux";
import { formatter } from "../tools";
import { useEffect, useState } from "react";

const Profile = () => {
    const { data: session } = useSession();
    const username = session?.user?.name || "...";
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const [inventory,setInventory] = useState<any>();

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
                        setInventory(resJson);
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
                    <span>INVENTORY</span>
                </div>
                <div className={p.profile_kernel_inventory}>
                    {
                        
                        inventory ? inventory.map((item:any,i:number)=>
                        <button key={i}>
                            <Image src={item.giftURL} alt={"inventory item"} width={45} height={45} />
                            <div id={p.act}>
                                <div id={p.dollar}>$</div>
                            </div>
                            <div id={p.text}>
                                <span>{item.giftName}</span>
                                <span>{formatter(item.giftPrice)}</span>
                            </div>
                        </button>
                        )
                        :
                        [...Array(6)].map((item:any,i:number)=>
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
                </div>
            </div>
        </div>
     );
}
 
export default Profile;