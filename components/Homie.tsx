import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";

const Homie = () => {
    const { data: session } = useSession();
    if (session){
        console.log(session);
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

                    <button onClick={()=>signIn()} id={h.profile}>
                        {
                            !session &&
                            <span>Sign In</span>
                        }
                        {
                            session && 
                            <>
                            <span>{session.user?.name}</span>
                            <Image src={session!.user!.image as string} alt={"discord profile image"} width={50} height={50} />
                            </>
                        }
                    </button>
                </div>
            </div>
        </div>
     );
}
 
export default Homie;