import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";

const Homie = () => {
    const { data: session } = useSession();
    if (session){
        console.log(session);
    }
    return ( 
        <div className={h.home}>
            <div className={h.home_navbar}>
                    <button onClick={()=>signIn()} id={h.profile}>
                        {
                            !session &&
                            <span>Sign In</span>
                        }
                        {
                            session && 
                            <>
                            <span>{session.user?.name}</span>
                            <Image src={session!.user!.image as string} alt={"discord profile image"} width={30} height={30} />
                            </>
                        }

                    </button>
            </div>
        </div>
     );
}
 
export default Homie;