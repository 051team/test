import bb from "./../styles/Wrapper1.module.css";
import Image from "next/image";
import _051 from "./../public/051.png";
import Link from "next/link";
import { formatter } from "../tools";

const BottomBanner = ({total}:any) => {
    return ( 
    <div id={bb.bottombanner}>
        <div id={bb.shell}>
            {/* <Image src={_051} alt={"051 logo"} width={63} height={35} /> */}
            <div id={bb.leftcol}>
                <Link href={"/051"}>AFFILIATE PROGRAM </Link>
                <Link href={"/051"}>TERMS OF SERVICE </Link>
                <Link href={"/051"}>PROVABLY FAIR </Link>
                <Link href={"/051"}>SUPPORT</Link>
                <Link href={"/051"}>FAQ</Link>
                <div id={bb.icons}>
                    <Image id={bb.mad} src={"/discord.png"} alt={"discord"} width={20} height={20} />
                    <Image id={bb.mad} src={"/x.png"} alt={"twitter"} width={20} height={20} />
                    <Image id={bb.mad} src={"/discord.png"} alt={"discord"} width={20} height={20} />
                    <Image id={bb.mad} src={"/x.png"} alt={"twitter"} width={20} height={20} />
                </div>
            </div>
            <div id={bb.rightcol}>
                <div id={bb.center}>
                    <div id={bb.each}>
                        <h2>{total && total.total}</h2>
                        <h3 style={{color:"plum"}}>CASE OPENED</h3>
                    </div>
                    <div id={bb.each}>
                    <h2>{total && formatter(total.turnover)}</h2>
                        <h3 style={{color:"salmon"}}>TOTAL VOLUME</h3>
                    </div>
                </div>
                <div id={bb.ops}>
                    <div id={bb.each}>
                        <Image src={"/login/1_phantom.png"} alt={"2_solflare.png"} width={20} height={20} />
                        <span>PHANTOM</span>
                    </div>
                    <div id={bb.each}>
                        <Image src={"/login/2_solflare.png"} alt={"2_solflare.png"} width={20} height={20} />
                        <span>SOLFLARE</span>
                    </div>
                    <div id={bb.each}>
                        <Image src={"/login/4_metamask.png"} alt={"2_solflare.png"} width={20} height={20} />
                        <span>META MASK</span>
                    </div>
                    <div id={bb.each}>
                        <Image src={"/login/3_magiceden.png"} alt={"2_solflare.png"} width={20} height={20} />
                        <span>MAGIC EDEN</span>
                    </div>
                    <div id={bb.each}>
                        <Image src={"/login/backpack.png"} alt={"2_solflare.png"} width={20} height={20} />
                        <span>BACKPACK</span>
                    </div>
                </div>
                <Image id={bb.mad} src={"/bbanner/footer-nft.png"} alt={"mad"} width={270} height={300} />
            </div>
        </div>
        <div id={bb.lowest}>
            ALL RIGHTS RESERVED. POWERED BY 051.Io. COPYRIGHT © 2024
            <span>
                powered by &nbsp; <Image src={"/solana.png"} alt={"051 logo"} width={25} height={25} /> &nbsp; SOLANA
            </span>
        </div>
    </div>
     );
}
 
export default BottomBanner;
