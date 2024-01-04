import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";
import profile from "../public/profile.png";
import logout from "../public/logout.png";
import { useEffect, useState } from "react";
import { formatter } from "../tools";
import Link from "next/link";

const Homie = () => {
    const { data: session } = useSession();
    const [sessionWithBalance, setSessionWithBalance] = useState<any>(null);
    const handleLogIn = () => {
        if(!session){
            signIn()
            //window.location.href = directLink
        }
    }
    const directLink = "https://discord.com/oauth2/authorize?client_id=1192027164619571220&scope=identify%20email&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&state=2VsQIOfsK-0NmpY9AOFZZD62001uvE_0IWqIU69HV0A";


    useEffect(()=>{
        const fetch_create_user =async () => {
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
    },[session])
    return ( 
        <div className={h.home}>
            <div className={h.home_navbar}>
                <div className={h.home_navbar_top}>
                    aeohgqıeg oıjegıqwjgh 
                </div>
                <div className={h.home_navbar_bottom}>
                    <Image src={_051} alt={"051 logo"} width={90} height={50} />
                    <input type="text" placeholder="Search for safe..." />
                    <Link href={directLink}>Go</Link>

                    <button onClick={handleLogIn} id={h.profile}>
                        <input type="checkbox" id="open"/>
                        <label htmlFor="open"></label>
                        {
                            !session &&
                            <span>Sign In</span>
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
                    <button id={h.deposit}>DEPOSIT</button>
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
            </div>
            
            <div className={h.home_cases}>
                <div className={h.home_cases_kernel}>
                    <h1>POPULAR CASES</h1>
                    <div className={h.home_cases_kernel_group}>
                        {
                            [...Array(10)].map((e,i)=>
                            <div className={h.home_cases_kernel_group_each} key={i}>
                                <Image priority={i < 5 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                                <h5>
                                    Case name heree
                                </h5>
                            </div>
                            )
                        }
                    </div>
                    <br /><br />
                    <h1>LIMITED EDITION</h1>
                    <div className={h.home_cases_kernel_group}>
                        {
                            [...Array(5)].map((e,i)=>
                            <div className={h.home_cases_kernel_group_each} key={i}>
                                <Image priority={i < 5 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                                <h5>
                                    Case name heree
                                </h5>
                            </div>
                            )
                        }
                    </div>
                    <br /><br />
                    <h1>HONORARY CASES</h1>
                    <div className={h.home_cases_kernel_group}>
                        {
                            [...Array(5)].map((e,i)=>
                            <div className={h.home_cases_kernel_group_each} key={i}>
                                <Image priority={i < 5 ? true : false} src={`/assets/honorary/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                                <h5>
                                    Case name heree
                                </h5>
                            </div>
                            )
                        }
                    </div>
                    <br /><br />
                    <h1>DAO CASES</h1>
                    <div className={h.home_cases_kernel_group}>
                        {
                            [...Array(10)].map((e,i)=>
                            <div className={h.home_cases_kernel_group_each} key={i}>
                                <Image priority={i < 5 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
                                <h5>
                                    Case name heree
                                </h5>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Homie;