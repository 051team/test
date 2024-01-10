import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useState,useRef } from "react";
import _051 from "../public/051.jpg";
import safe from "../public/safe.png";
import sword from "../public/sword.png";
import dolar from "../public/dolar.png";
import profile from "../public/profile.png";
import logout from "../public/logout.png";
import { formatter } from "../tools";
import crazy from "../public/assets/promo.png";

const Navbar = ({setPromoModalOpen, promoModal,setFeedback,setFeedbackModalOpen}:any) => {
    const { data: session } = useSession();
    const [sessionWithBalance, setSessionWithBalance] = useState<any>(null);
    const [balanceChange,setBalanceChange] = useState<boolean>(false);
    const core = useRef<HTMLDivElement>(null);
    const promo = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        const fetch_create_user = async () => {
            try {
                const response = await fetch("/api/user",{
                    method:"POST",
                    body:JSON.stringify(session)
                });
                const resJson = await response.json();
                const userBalance = resJson.balance;
                if(userBalance){
                    const balancedSession = {...session, user:{...session!.user, balance:userBalance}};
                    setSessionWithBalance(balancedSession);
                }else{
                    const balancedSession = {...session, user:{...session!.user, balance:0}};
                    setSessionWithBalance(balancedSession);
                }

                
            } catch (error) {
                console.log(error)
            }
        }
        if(session){
            fetch_create_user();
        }
    },[session,balanceChange]);

    useEffect(()=>{
        const handleOutsideClick = (e:any) => {
            if (!core.current?.contains(e.target) && e.target.tagName !== 'BUTTON') {
                setPromoModalOpen(false);
            }
        }
        window.addEventListener("click", handleOutsideClick)
    },[]);


    const handleLogIn = () => {
        if(!session){
            signIn()
        }
    }
    const handleUseCoupon = async () => {
        if(promo.current?.value && session){
            setFeedbackModalOpen((pr:boolean)=>!pr);
            setFeedback({message:"Uploading balance from the coupon", color:"gray"});
            try {
                const response = await fetch("/api/usecoupon",{
                    method:"POST",
                    body:JSON.stringify({promo:promo.current.value,user:session.user?.name})
                   });
                   if(response.status === 200){
                    const resJson = await response.json();
                    console.log(resJson);
                    setFeedback(()=>resJson);
                    setBalanceChange(pr=>!pr);
                    setPromoModalOpen((pr:any)=>!pr);
                    setTimeout(() => {
                        setFeedbackModalOpen((pr:boolean)=>!pr)
                    }, 1500);
                   }else{
                    const resJson = await response.json();
                    console.log(resJson)
                    setFeedback(()=>resJson);
                    setPromoModalOpen((pr:any)=>!pr);
                    setTimeout(() => {
                        setFeedbackModalOpen((pr:boolean)=>!pr)
                    }, 1500);
                   }
            } catch (error) {
                console.log("Sorun lu ki:",error)
            }
        }else{
            if(!session){
                confirm("Login required!");
            }else{
                confirm("Please enter promo code");
            }
            
        }
    }
    return ( 
    <>
            {
                promoModal &&
                <div className={h.home_modal}>
                    <div className={h.home_modal_kernel} ref={core}>
                        <button id={h.close} onClick={()=>setPromoModalOpen(false)}>x</button>
                        <div id={h.row1}>
                            <Image src={crazy} alt={"crazy professor"} width={156} height={192} priority />
                            <div id={h.right}>
                                <h3>PROMO CODE</h3>
                                <span>Enter &quot;051BETA&quot; promo code</span><br />
                                <span id={h.bottom}>and activate $1000 BETA balance.</span>
                            </div>
                        </div>
                        <div id={h.row2}>
                            <input type="text" placeholder="Enter promo code..." ref={promo} />
                            <button onClick={handleUseCoupon}>APPLY</button>
                        </div>
                    </div>
                </div>
            }
        <div className={h.home_navbar}>
            <div className={h.home_navbar_top}>
                <span id={h.each}><span id={h.dot}>&#x2022;</span> 2551 <span style={{color:"#00bc3e"}}>Online</span> </span>
                <span id={h.each}><span>&#9729;</span> $56,124 <span style={{color:"#009fb3"}}>24h Volume</span></span>
                <span id={h.each}><span>&#9729;</span> $1,245,621 <span style={{color:"#009fb3"}}>30D Volume</span></span>
                <span id={h.each}><span>&#9729;</span> $1,245,621 <span style={{color:"#009fb3"}}>Case Opened</span></span>
            </div>
            <div className={h.home_navbar_bottom}>
                <Image src={_051} alt={"051 logo"} width={90} height={50} />
                <input type="text" placeholder="Search for safe..." />
                <button onClick={handleLogIn} id={h.profile}>
                    <input type="checkbox" id="open"/>
                    <label htmlFor="open"></label>
                    {
                        !session &&
                        <span><strong>Sign In</strong></span>
                    }
                    {
                        session && 
                        <>
                        <span> <strong>{session && session.user?.name} <br />{sessionWithBalance && formatter(sessionWithBalance.user.balance)}  </strong> </span>
                        <Image src={session!.user!.image as string} alt={"discord profile image"} width={50} height={50} />
                        <div id={h.dropdown}>
                            <div>
                                <Image src={profile} alt={"profile icon"} width={25} height={25} />
                                <span>Profile</span>
                            </div>
                            <div onClick={()=>signOut()}>
                                <Image src={logout} alt={"logout icon"} width={25} height={25} />
                                <span>Sign out</span>
                            </div>
                        </div>
                        </>
                    }
                </button>
                <button id={h.deposit} onClick={()=>setPromoModalOpen(true)}>DEPOSIT</button>
            </div>
            <div className={h.home_navbar_slider}>
                <button key={99}>
                        <Image priority src={"/assets/live.png"} alt={"051 logo"} width={45} height={45} style={{filter:"brightness(1.2)"}} />
                        <div id={h.text} style={{position:"relative",top:"-15px", color:"darkorange"}}>
                            <span><strong>LIVEDROP</strong></span>
                        </div>
                    </button>
                {
                    [...Array(20)].map((e,i) =>
                    <button key={i} style={{
                        backgroundImage:i%2 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), #cb7900)"
                                                : i%3 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), #772677)"
                                                : i%5 === 0 ? "linear-gradient(to bottom, rgb(26, 25, 25), #006c7d)"
                                                : "linear-gradient(to bottom, rgb(26, 25, 25), #00a262)"
                    }}>
                        <Image priority={i < 10 ? true : false} src={`/assets/${i > 10 ? i-10 : i === 0 ? 1: 11-i}.png`} alt={"051 logo"} width={45} height={45} />
                        <div id={h.text}>
                            <span>Item no</span>
                            <span>$ 0.50</span>
                        </div>
                    </button>
                    )
                }
            </div>
            <div className={h.home_navbar_tabs}>
                <div className={h.home_navbar_tabs_kernel}>
                    <button id={h.join}>JOIN <strong>051DAO</strong> AND WIN MORE</button>
                    <div id={h.right}>
                        <button>
                            <Image src={safe} alt={"cases"} width={20} height={20} />
                            CASES
                        </button>
                        <button>
                            <Image src={sword} alt={"battles"} width={20} height={20} />
                            BATTLES
                        </button>
                        <button>
                            <Image style={{filter:"brightness(1.2)"}} src={dolar} alt={"free cases"} width={20} height={20} />
                            FREE CASES
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
     );
}
 
export default Navbar;