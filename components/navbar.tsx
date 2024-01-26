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
import { useSelector,useDispatch } from "react-redux";
import { note_balanceChange, note_balance, note_searchBy, note_activeUserCount } from "./../redux/loginSlice";
import Link from "next/link";
import Livedrop from "./livedrop";

type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id: string;
  };

const Navbar = () => {
    const { data: session } = useSession();

    const core = useRef<HTMLDivElement>(null);
    const promo = useRef<HTMLInputElement>(null);
    const [promoModal,setPromoModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>();

    const dispatch = useDispatch();
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const bChange = useSelector((state:any) => state.loginSlice.balanceChange);

    const search = useRef<HTMLInputElement>(null);
    const searchResultNo = useSelector((state:any)=> state.loginSlice.searchResultNo);
    const resultText = (searchResultNo && searchResultNo !== 0) ? searchResultNo + " items found!" : (searchResultNo === 0) ? "No items found" : "";
    const activeUserCount = useSelector((state:any) => state.loginSlice.activeUserCount);

    //Updated user count regularly
    useEffect(()=>{
        const updateUserCount = async () => {
            const response = await fetch(`/api/user?count=${true}`);
            if(response.status === 200){
                const resJson = await response.json();
                dispatch(note_activeUserCount(resJson.activeUserCount))
            }
        }
        if(!activeUserCount){
            updateUserCount();
        }
        const interval = setInterval(()=>{
            updateUserCount();
        },5000);
        return () => {
            clearInterval(interval)
        }
    },[])

    // fetch user balance and handle login
    useEffect(()=>{
        const fetch_create_user = async () => {
            try {
                const response = await fetch("/api/user",{
                    method:"POST",
                    body:JSON.stringify(session)
                });
                const resJson = await response.json();
                const userBalance = resJson.balance;
                const activeUserCount = resJson.activeUserCount;
                if( resJson && userBalance){
                    dispatch(note_balance((userBalance)));
                    dispatch(note_activeUserCount(activeUserCount));
                }else{
                    dispatch(note_balance(0));
                    dispatch(note_activeUserCount(activeUserCount));
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(session){
            fetch_create_user();
        }
    },[session,bChange]);

    //handle outside modal click
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
            signIn('discord');
        }
    }

    const handleUseCoupon = async () => {
        if(promo.current?.value && session){
            setFeedback({message:"Uploading balance from the coupon", color:"gray"});
            try {
                const response = await fetch("/api/usecoupon",{
                    method:"POST",
                    body:JSON.stringify({promo:promo.current.value,user:session?.user})
                   });
                   if(response.status === 200){
                    const resJson = await response.json();
                    console.log(resJson);
                    setFeedback(()=>resJson);
                    dispatch(note_balanceChange((pr:boolean) => !pr));
                   }else{
                    const resJson = await response.json();
                    console.log(resJson)
                    setFeedback(()=>resJson);
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


    const handleSearch = () => {
        setTimeout(() => {
            if(search.current){
                dispatch(note_searchBy(search.current!.value.toLocaleLowerCase()));
            }
        }, 500);
    }

    const handleLogOut = async () => {
        if(session){
            const user = session.user as User;
            const logoutResponse = await fetch(`/api/user?who=${user.id}`);
            const resJson = await logoutResponse.json();
            console.log(resJson);
            if(logoutResponse.status === 200){
                dispatch(note_activeUserCount(activeUserCount-1));
                signOut();
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
                            <button onClick={handleUseCoupon}>
                                {feedback && feedback.message.includes("Uploading") ? <span style={{fontSize:"small", color:"silver"}}>Confirming...</span> : "APPLY" }
                            </button>
                            {
                                feedback &&
                                <div id={h.text} style={{color:feedback.color}}>
                                    {feedback.message}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        <div className={h.home_navbar}>
            <div className={h.home_navbar_top}>
                <span id={h.each}><span id={h.dot}>&#x2022;</span> {activeUserCount ?? ""} <span style={{color:"#00bc3e"}}>Online</span> </span>
                <span id={h.each}><span>&#9729;</span> {/* {totalCaseCount && totalCaseCount.total} */}<span style={{color:"#009fb3"}}>Case Opened</span></span>
            </div>
            <div className={h.home_navbar_bottom}>
                <Link href={"/"}>
                <Image src={_051} alt={"051 logo"} width={90} height={50} /></Link>
                <input type="text" placeholder="Search for case..." onChange={handleSearch} ref={search} />
                <span id={h.found} style={{color:searchResultNo === 0 ? "crimson" : "green"}}>{resultText}</span>
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
                        <span><strong>{session && session.user?.name} <br />
                            {balance ? formatter(balance)  : ""} {balance === 0 && "$0.00"} </strong> 
                        </span>
                        <Image src={session!.user!.image as string} alt={"discord profile image"} width={50} height={50} />
                        <div id={h.dropdown}>
                            <Link href={"/profile"}>
                            <div>
                                <Image src={profile} alt={"profile icon"} width={25} height={25} />
                                <span>Profile</span>
                            </div></Link>
                            <div onClick={handleLogOut}>
                                <Image src={logout} alt={"logout icon"} width={25} height={25} />
                                <span>Sign out</span>
                            </div>
                        </div>
                        </>
                    }
                </button>
                <button id={h.deposit} onClick={()=>setPromoModalOpen(true)}>DEPOSIT</button>
            </div>
            <Livedrop />
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