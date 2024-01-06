import Image from "next/image";
import { useRef, useState } from "react";
import s from "../styles/Panel.module.css";

const Super_user = () => {
    const tabs = ["User Actions", "Coupons","Case Actions"];
    const [selectedTab, setTab] = useState("User Actions");
    const [activeUsers,setActiveUsers] = useState<any>(null);
    const [allCoupons,setAllCoupons] = useState<any>(null);

    const [modalOpen,setModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>()

    const couponName = useRef<HTMLInputElement>(null);
    const couponValue = useRef<HTMLInputElement>(null);
    const couponQuantity = useRef<HTMLInputElement>(null);
    const couponPerUser = useRef<HTMLInputElement>(null);
    const createcoupon = useRef<HTMLInputElement>(null);

    const handleFetchAll = async () => {
        setFeedback({message:"Fetching all users...",color:"gray"})
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchusers");
            const resJson = await response.json();
            if(resJson){
                console.log(resJson);
                setActiveUsers(resJson);
                setModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreate = async () => {
        const ready = [couponName, couponValue, couponQuantity, couponPerUser].every(inputRef => inputRef.current?.value);
        if(ready){
            setFeedback({message:"Creating new coupon...",color:"gray"});
            setModalOpen(true);
            const coupon = {
                couponName:couponName.current?.value,
                couponValue:parseFloat(couponValue.current!.value),
                couponQuantity:parseInt(couponQuantity.current!.value),
                couponPerUser:parseInt(couponPerUser.current!.value),
                disabled:false,
                usedXtimes:0
            }
            try {
                const response = await fetch("/api/createcoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                if(resJson){
                    console.log(resJson);
                    setFeedback({message:resJson.message,color:resJson.color});
                    setAllCoupons([...allCoupons,coupon]);
                    setTimeout(() => {
                        setModalOpen(pr=>!pr);
                        createcoupon.current!.checked = false;
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            confirm("All fields must be filled to create a coupon!")
        }
    }

    const handleFetchCoupons = async () => {
        if(allCoupons){
            createcoupon.current!.checked = false;
            return
        }
        setFeedback({message:"Fetching all coupons...",color:"gray"})
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchcoupons");
            const resJson = await response.json();
            if(resJson){
                console.log(resJson);
                if(resJson.data){
                    setAllCoupons(resJson.data)
                }
                setModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleDeleteCoupon = async (coupon:any) => {
        if(confirm(`Are you sure to delete the coupon titled ${coupon.couponName} ?`)){
            setFeedback({message:"Deleting coupon...",color:"gray"})
            setModalOpen(true);
            try {
                const response = await fetch("/api/delcoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                if(resJson){
                    setFeedback(resJson);
                    if(response.status === 200){
                        const updatedAllCoupons = allCoupons.filter((c:any)=>c.couponName !== coupon.couponName);
                        setAllCoupons(updatedAllCoupons);
                    }
                    setTimeout(() => {
                        setModalOpen(false);
                    }, 2000);
                    console.log(resJson);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleExpireCoupon = async (coupon:any) => {
        if(confirm(`Are you sure to expire the coupon titled ${coupon.couponName} ?`)){
            setFeedback({message:"Expiring coupon...",color:"gray"})
            setModalOpen(true);
            try {
                const response = await fetch("/api/expirecoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                console.log(resJson)
                if(resJson){
                    setFeedback(resJson);
                    if(response.status === 200){
                        const updatedAllCoupons = allCoupons.map((c:any) => {
                            if (c.couponName === coupon.couponName) {
                              return { ...c, disabled: true };
                            }
                            return c;
                        });
                        setAllCoupons(updatedAllCoupons);
                    }
                    setTimeout(() => {
                        setModalOpen(false);
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }




    return ( <>
    <div className={s.panel}>
        {
            modalOpen &&
            <div className={s.panel_modal}>
                <div className={s.panel_modal_kernel}>
                    <span className={s.loader}></span>
                    <h2 style={{color:feedback?.color ? feedback.color : "gray"}}>{feedback && feedback.message}</h2>
                </div>
            </div>
        }
        <div className={s.panel_kernel}>
            <div className={s.panel_kernel_tabs}>
                {
                    tabs.map((t,i)=>
                    <button key={i} value={t} onClick={()=>setTab(t)}>
                        {t}
                        {t === selectedTab && <span style={{color:t === selectedTab ? "darkorange" : "white"}} id={s.later}>&#x25BC;</span>}
                    </button>
                    )
                }
            </div>
            {
                selectedTab === "User Actions" && !activeUsers &&
                <div id={s.useractions}>
                    <button id={s.showall} onClick={handleFetchAll}>Show all users</button>
                </div>
            }
                        {
                selectedTab === "Coupons" &&
                <div id={s.coupons}>
                    <div id={s.options}>
                        <button id={s.showcoupons} onClick={handleFetchCoupons}>Show all coupons</button>
                        <label htmlFor="createcoupon">Create coupon</label> 
                        <input id="createcoupon" type="checkbox" ref={createcoupon} />
                        <span>&#x25BC;</span>
                        <div id={s.createcoupon}>
                            <input ref={couponName} type="text" placeholder="Coupon name..." />
                            <input ref={couponValue} type="number" min={1} max={100000} placeholder="Coupon value..." />
                            <input ref={couponQuantity} type="number" min={1} max={100000} placeholder="Quantity..." />
                            <input ref={couponPerUser} type="number" min={1} max={999} placeholder="Per user..." />
                            <button onClick={handleCreate}>CREATE COUPON</button>
                        </div>
                        
                            {
                                allCoupons &&
                                <div id={s.allcoupons}>
                                        <div key={-1} id={s.each} style={{background:"navy"}}>
                                            <p>Coupon name<h4 id={s.anchor}>&#x25BC;</h4></p>
                                            <p>Value</p>
                                            <p>Quantity</p>
                                            <p>Per user</p>
                                            <p>Used</p>
                                            <p>Active</p>
                                        </div>
                                    {
                                        allCoupons.map((coupon:any,i:any)=>
                                        <div key={i} id={s.each}>
                                            <p>{coupon.couponName}</p>
                                            <p>{coupon.couponValue}</p>
                                            <p>{coupon.couponQuantity}</p>
                                            <p>{coupon.couponPerUser}</p>
                                            <p>{coupon.usedXtimes}</p>
                                            <p style={{color:coupon.disabled ? "gray" : "lightgreen"}}>{coupon.disabled ? "no" : "yes"}</p>
                                            <button onClick={()=>handleDeleteCoupon(coupon)}>
                                                <Image alt="delete" src={"/delete.png"} width={25} height={25} priority/>
                                            </button>
                                            <button onClick={()=>handleExpireCoupon(coupon)} disabled={coupon.disabled}>
                                                <Image alt="expired" src={"/expired.png"} width={25} height={25} priority
                                                style={{filter:coupon.disabled ? "grayscale(90%)" : "none"}}
                                                />
                                            </button>
                                        </div>
                                        )
                                    }
                                </div>
                            }
                    </div>
                    <div>
                    </div>
                </div>
            }





            {
                selectedTab === "User Actions" && activeUsers &&
                <div id={s.activeusers}>
                        <div key={-1} id={s.user} style={{backgroundColor:"navy", padding:"5px",marginBottom:"10px"}}>
                            <span>Username</span>
                            <span>Email</span>
                            <span>CDP Balance</span>
                        </div>
                    {
                        activeUsers.map((user:any,i:any)=>
                        <>
                        <div key={i} id={s.user}>
                            <span>{user.cdpUser}</span>
                            <span>{user.cdpEmail}</span>
                            <span>{user.balance}</span>
                        </div>
                        </>
                        )
                    }
                </div>
            }
        </div>
    </div>
    </> );
}
 
export default Super_user;