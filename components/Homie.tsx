import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";
import safe from "../public/safe.png";
import sword from "../public/sword.png";
import dolar from "../public/dolar.png";
import profile from "../public/profile.png";
import crazy from "../public/assets/promo.png";
import logout from "../public/logout.png";
import { useEffect, useRef, useState } from "react";
import { formatter } from "../tools";
import Link from "next/link";
import Modal from "./modal";
import Cases from "./cases";
import Navbar from "./navbar";

const Homie = () => {
    const { data: session } = useSession();
    const [sessionWithBalance, setSessionWithBalance] = useState<any>(null);
    const [promoModal,setPromoModalOpen] = useState(false);
    const [feedbackModal,setFeedbackModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>()
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




    return ( 
        <div className={h.home}>
            {
                feedbackModal && feedback &&
                <Modal modalOpen={feedbackModal} feedback={feedback} />
            }
            <Navbar 
                    setPromoModalOpen={setPromoModalOpen} 
                    promoModal={promoModal} 
                    setFeedback={setFeedback} 
                    setFeedbackModalOpen={setFeedbackModalOpen} 
            />
            <Cases />
        </div>
     );
}
 
export default Homie;