import h from "../styles/Wrapper1.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useState,useRef } from "react";
import _051 from "../public/051.png";
import gitbook from "../public/gitbook.svg";
import discord from "../public/discord.png";
import twitter from "../public/twitter.png";
import safe from "../public/safe.png";
import wallet from "../public/wallet.png";
import gun from "../public/item-value.png";
import sword from "../public/sword.png";
import dolar from "../public/dolar.png";
import profile from "../public/suitcase.png";
import logout from "../public/disconnect.png";
import { formatter } from "../tools";
import crazy from "../public/assets/promo.png";
import { useSelector,useDispatch } from "react-redux";
import { note_balanceChange, note_balance, note_activeUserCount,note_notification, note_searchResults, note_allCases, note_universal_modal, note_cashable } from "./../redux/loginSlice";
import Link from "next/link";
import Livedrop from "./livedrop";
import useSWR from 'swr';
import Universal_modal from "./universal_modal";
import mad from "../public/assets/IMG.png";
import {logins} from "../tools";

type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id: string;
  };

const Navbar = () => {
    const fetcher = (url:string) => fetch(url).then(r => r.json());
    const { data:totalCaseCount, error, isLoading } = useSWR('/api/totalopenedcase', fetcher, { refreshInterval: 3000 })
    const { data: session } = useSession();
    const allCases:any = useSelector((state:any)=>state.loginSlice.allCases);
    const cashable:any = useSelector((state:any)=>state.loginSlice.cashable);
    
    const core = useRef<HTMLDivElement>(null);
    const promo = useRef<HTMLInputElement>(null);
    const [promoModal,setPromoModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>();

    const dispatch = useDispatch();
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const bChange = useSelector((state:any) => state.loginSlice.balanceChange);
    const umodal = useSelector((state:any) => state.loginSlice.universal_modal);

    const search = useRef<HTMLInputElement>(null);
    const searchResults = useSelector((state:any)=>state.loginSlice.searchResults);
    const resultText = (searchResults && searchResults.length > 0) ? `${searchResults.length} items founds` 
                        : (searchResults && searchResults.length === 0) ? "No item matched!"  : "";
    const activeUserCount = useSelector((state:any) => state.loginSlice.activeUserCount);
    const notification = useSelector((state:any)=> state.loginSlice.notification);
    const cursor = notification && notification === "SOON" ? "not-allowed" : "pointer";

    const payment_methods = [
        {name:"SOL", image:"/payment/sol.png"},{name:"USDC", image:"/payment/usdc.png"},{name:"USDT", image:"/payment/usdt.png"},
        {name:"BONK", image:"/payment/bonk.png"},{name:"JUP", image:"/payment/jup.png"},{name:"ETH", image:"/payment/eth.png"},
        {name:"SEI", image:"/payment/sei.png"},
    ]

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
        },30000);
        return () => {
            clearInterval(interval)
        }
    },[])

    useEffect(()=>{
        const fetchCashableAmount = async () => {
            const response = await fetch("/api/fetchinventory?active=true",{
                method:'POST',
                body:JSON.stringify(session?.user)
            })
            if(response.status === 200){
                const resJson = await response.json();
                console.log(resJson);
                const cashable = resJson.reduce((tot:number,item:any) => {return tot + parseFloat(item.giftPrice)},0 );
                dispatch(note_cashable(cashable));
            }
        }
        if(session){
            fetchCashableAmount();
        }
    },[session, bChange])

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
                if( resJson && userBalance){
                    dispatch(note_balance((userBalance)));
                }else{
                    dispatch(note_balance(0));
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

    const handleFetchCases = async () => {
                try {
                    const response = await fetch("/api/fetchcases");
                    try {
                        const resJson = await response.json();
                        const cases = resJson.data;
                        dispatch(note_allCases(cases));
                    } catch (error) {
                        console.log("Response object not JSON",error)
                    }
                } catch (error) {
                    console.log("Fetch request failed...",error)
                }
    }

    useEffect(()=>{
        if(!allCases){
            handleFetchCases();
        }
    },[])

    const handleLogIn = (e:any) => {
        if(session){
            return
        }
        e.stopPropagation();
        dispatch(note_universal_modal(true));
    }

    const SignIn = () => {
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
                dispatch(note_notification("Login required!"));
                setTimeout(() => {
                    dispatch(note_notification(null));
                }, 2000);
            }else{
                dispatch(note_notification("Please enter promo code"));
                setTimeout(() => {
                    dispatch(note_notification(null));
                }, 2000);
            }
        }
    }

    const handleSearch = () => {
        setTimeout(() => {
            if(search.current){
                const searchBy = search.current.value.toLocaleLowerCase();
                const searchfResults = allCases.filter((e:any) => e.caseName.toLowerCase().includes(searchBy));
                dispatch(note_searchResults(searchfResults));
                if(searchBy === ""){
                    dispatch(note_searchResults(null));
                }
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

    const handleGotoResult = (r:any) => {
        dispatch(note_searchResults(null));
        window.location.href = `/cases/cs?cat=${r.caseCategory}&name=${r.caseName}`;
    }

    return ( 
    <>
            {
                promoModal &&
                <div className={h.wrapper_modal}>
                    <div className={h.wrapper_modal_kernel} ref={core}>
                        <button id={h.close} onClick={()=>setPromoModalOpen(false)}>x</button>
                        <div id={h.row1}>
                            <Image src={crazy} alt={"crazy professor"} width={156} height={192} priority />
                            <div id={h.right}>
                                <h3>PROMO CODE</h3>
                                <span>Enter &quot;051BETA&quot; promo code</span><br />
                                <span id={h.bottom}>and activate $1000 BETA balance.</span>
                            </div>
                        </div>
                        <div id={h.rowmid}>
                            <button id={h.selected}><Image alt="BETA COUPON" src={"/payment/coupon.png"} width={20} height={20} />BETA COUPON</button>
                            {
                                payment_methods.map((m,i)=>
                                <button key={i}><Image alt="COUPON" src={m.image} width={20} height={20} />
                                    {m.name} <span>SOON</span>
                                </button>
                                )
                            }
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
        <div className={h.wrapper_navbar}>
            <div className={h.wrapper_navbar_top}>
                <span id={h.each}><span id={h.dot}>&#x2022;</span> {activeUserCount ?? ""} <span style={{color:"#00bc3e"}}>Online</span> </span>
                <span id={h.each}><span>&#9729;</span> {totalCaseCount && totalCaseCount.total}<span style={{color:"#009fb3"}}>Case Opened</span></span>
                <div id={h.right}>
                    <Image src={discord} alt="discord" />
                    <Image src={twitter} alt="twitter" />
                    <Image src={gitbook} alt="gitbook" />
                </div>
            </div>
            <div className={h.wrapper_navbar_bottom}>
                <Link href={"/"}>
                <Image src={_051} alt={"051 logo"} width={90} height={50} /></Link>
                <input type="text" placeholder="Search for case..." onChange={handleSearch} ref={search} />
                <span id={h.found} style={{color:resultText === "No item matched!" ? "crimson" : "green"}}>{resultText}</span>
                {
                    searchResults && searchResults.length > 0 &&
                    <div id={h.searchdrop}>
                        {
                            searchResults.map((r:any,i:number)=>
                            <button onClick={()=>handleGotoResult(r)} key={i}>
                                <Image src={r.caseImageURL} width={42} height={56} alt={r.caseName} />
                                <span>{r.caseName}</span>
                                <span>{formatter(r.casePrice)}</span>
                            </button>
                            )
                        }
                    </div>
                }
                <button onClick={handleLogIn} id={h.profile}>
                    <input type="checkbox" id="open"/>
                    <label htmlFor="open"></label>
                    {
                        !session &&
                        <span id={h.signin}>LOG IN WITH DISCORD</span>
                    }
                    {
                        session && 
                        <>
                        <div id={h.cash}>
                            <span><strong>{session && session.user?.name}</strong></span>

                            <>
                            <p>
                                <Image src={wallet} alt={"balance"} width={20} height={20} />
                                <span>{balance ? formatter(balance)  : ""} {balance === 0 && "$0.00"}</span>
                            </p>
                            <p>
                                <Image src={gun} alt={"cashable"} width={20} height={20} />
                                <span style={{color:"silver"}}>{cashable ? formatter(cashable)  : ""} {cashable === 0 && "$0.00"}</span>
                            </p>
                            </>
                        </div>
                        <Image src={session!.user!.image as string} alt={"discord profile image"} width={50} height={50} />
                        <div id={h.dropdown}>
                            <Link href={"/profile"}>
                            <div>
                                <Image src={profile} alt={"profile icon"} width={22} height={22} />
                                <span>INVENTORY</span>
                            </div></Link>
                            <div onClick={handleLogOut}>
                                <Image src={logout} alt={"logout icon"} width={22} height={22} />
                                <span>DISCONNECT</span>
                            </div>
                        </div>
                        </>
                    }
                </button>
                {
                    session &&   <button id={h.deposit} onClick={()=>setPromoModalOpen(true)}>DEPOSIT</button>

                }
            </div>
            <Livedrop/>
            <div className={h.wrapper_navbar_tabs}>
                <div className={h.wrapper_navbar_tabs_kernel}>
                    <button id={h.join}>JOIN <strong>051DAO</strong> AND WIN MORE</button>
                    <div id={h.right}>
                        <Link href={"/"}>
                        <button style={{cursor:cursor}}>
                            <Image src={safe} alt={"cases"} width={20} height={20} />
                            CASES
                        </button>
                        </Link>
                        <Link href={"/create-battle"}>
                        <button style={{cursor:cursor}}>
                            <Image src={sword} alt={"battles"} width={20} height={20} />
                            BATTLES
                        </button>
                        </Link>
                        <button style={{cursor:cursor}} onClick={()=>{dispatch(note_notification("SOON")); setTimeout(() => {
                            dispatch(note_notification(null));
                        }, 2000);}}>
                            <Image style={{filter:"brightness(1.2)"}} src={dolar} alt={"free cases"} width={20} height={20} />
                            FREE CASES
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {
            umodal &&
            <Universal_modal wid={400}>
                <div id={h.logg}>
                    <div id={h.head}>
                        <h3>CONNECT TO                             
                            <Image src={_051} alt={"logoooo"} width={30} height={20} />
                        </h3>
                    </div>
                    <Image id={h.mad} src={mad} alt="mad" width={150} height={150} />
                    {
                        logins.map((l,index)=>
                        <button  id={h.each} onClick={SignIn} style={{border:index === 0 ? "2px solid silver" : "1px solid gray",
                                            cursor:index === 0 ? "pointer" : "not-allowed"}}
                                            disabled={index !== 0} key={index}
                        >
                            <Image src={l.img} alt={l.name} width={20} height={20} />
                            <span>{l.name}</span>
                            {
                                index !== 0 && <span id={h.soon}>SOON</span>
                            }
                        </button>
                        )
                    }

                </div>
            </Universal_modal>
        }
    </>
     );
}
 
export default Navbar;
