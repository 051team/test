import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";
import profile from "../public/profile.png";
import logout from "../public/logout.png";
import { useEffect, useState } from "react";

const Homie = () => {
    const { data: session } = useSession();
    const handleLogIn = () => {
        if(!session){
            signIn()
        }
    }

    useEffect(()=>{
        const fetch_create_user =async () => {
            try {
                const response = await fetch("/api/user");
                console.log(response);
            } catch (error) {
                console.log(error)
            }
        }
       fetch_create_user();
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
                            <span> <strong>{session && session.user?.name} <br />$ 00:00  </strong> </span>
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
                </div>
            </div>
            
            <div className={h.home_cases}>
                <div className={h.home_cases_kernel}>
                    <h1>POPULAR CASES</h1>
                    <div className={h.home_cases_kernel_group}>
                        {
                            [...Array(10)].map((e,i)=>
                            <div className={h.home_cases_kernel_group_each} key={i}>
                                <Image priority={i === 0 ? true : false} src={`/assets/${i+1}.png`} alt={"051 logo"} width={200} height={250} />
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