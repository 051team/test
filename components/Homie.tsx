import h from "../styles/Home.module.css";
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import _051 from "../public/051.jpg";
import { useEffect, useRef, useState } from "react";
import { formatter } from "../tools";
import Link from "next/link";
import Modal from "./modal";
import Cases from "./cases";
import Navbar from "./navbar";

const Homie = () => {
    return ( 
        <div className={h.home}>
            <Navbar />
            <Cases />
        </div>
     );
}
 
export default Homie;