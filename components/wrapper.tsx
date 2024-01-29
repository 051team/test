import BottomBanner from "./bottombanner";
import Navbar from "./navbar";
import Head from 'next/head'
import w from "../styles/Wrapper.module.css";
import Notification from "./notifybox";
import Image from "next/image";
import _051 from "../public/051.png";
import discord from "../public/discord.png";
import x from "../public/twitter.png";

const Wrapper = ({title,children}:any) => {
    return ( 
        <>
     <Head>
        <title>{title}</title>
        <meta name="description" content="Casa de papel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/casa.png" />
      </Head>
      <main className={w.wrapper}>
        <Navbar />
        {children}
        <div id={w.desktoponly}>
            <div>
                <div>
                    <Image src={_051} alt={"051"} width={160} height={96} />
                </div>
                <h1>Desktop only for now !!!</h1>
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
        <Notification />
      </main>
      <footer>
         <BottomBanner />
      </footer>
        </>
     );
}
 
export default Wrapper;