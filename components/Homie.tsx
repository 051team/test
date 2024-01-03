import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";
import profile from "../public/profile.png";
import logout from "../public/logout.png";
import { useState } from "react";

const Homie = () => {
    const { data: session } = useSession();
    if (session){
        console.log(session);
    }
    const handleLogIn = () => {
        if(!session){
            signIn()
        }else{
            console.log("oturum açık")
        }
    }
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
                            <span> <strong>$ 00:00</strong> </span>
                            <Image src={session!.user!.image as string} alt={"discord profile image"} width={50} height={50} />
                            <div id={h.dropdown}>
                                <button>
                                    <Image src={profile} alt={"profile icon"} width={25} height={25} />
                                    <span>Profile</span>
                                </button>
                                <button onClick={()=>signOut()}>
                                    <Image src={logout} alt={"logout icon"} width={25} height={25} />
                                    <span>Sign out</span>
                                </button>
                            </div>
                            </>
                        }
                        
                    </button>
                </div>
            </div>
        </div>
     );
}
 
export default Homie;