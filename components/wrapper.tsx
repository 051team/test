import BottomBanner from "./bottombanner";
import Navbar from "./navbar";
import Head from 'next/head'
import w from "../styles/Wrapper.module.css";
import Notification from "./notifybox";
import Image from "next/image";
import _051 from "../public/051.png";
import discord from "../public/discord.png";
import x from "../public/twitter.png";
import { useSelector } from "react-redux";

const Wrapper = ({title,children}:any) => {
    const notification = useSelector((state:any)=> state.loginSlice.notification);
    return ( 
        <>
     <Head>
        <title>{title}</title>
        <meta name="description" content="Open NFT Cases on 051.io. Discover the best and latest NFT cases, battles and prizes. Browse, open, and sell NFTs using 051 today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/casa.png" />
      </Head>
      <main className={w.wrapper}>
        <Navbar />
        {children}
        {
            notification && <Notification text={notification} />
        }
      </main>
      <div id={w.desktoponly}>
            <div id={w.kernel}>
                <Image src={_051} alt={"051"} width={160} height={96} />
                <h1>051, support only desktop for now.</h1>
                <div id={w.double}>
                    <div id={w.each}>
                        <Image src={discord} alt={"discord"} />
                        Discord
                    </div>
                    <div id={w.each}>
                        <Image src={x} alt={"twitter"}/>
                        Twitter
                    </div>
                </div>
            </div>
        </div>
      <footer>
         <BottomBanner />
      </footer>
        </>
     );
}
 
export default Wrapper;
