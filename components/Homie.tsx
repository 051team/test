import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.png";
import discord from "../public/discord.png";
import x from "../public/twitter.png";
import { useEffect, useRef, useState } from "react";
import { formatter } from "../tools";
import Link from "next/link";
import Modal from "./modal";
import Cases from "./cases";
import Navbar from "./navbar";
import Notification from "./notifybox";
import BottomBanner from "./bottombanner";

const Homie = () => {
    return ( 
        <div className={h.home}>
            <Navbar />
            <Cases />
            <Notification />
            <BottomBanner />
        </div>
     );
}
 
export default Homie;