import c from "./../styles/Casepage.module.css";
import Image from "next/image";
import _051 from "./../public/051.png";
import Link from "next/link";

const BottomBanner = () => {
    return ( 
    <div className={c.casepage_case_kernel} id={c.bottombanner}>
        <Image src={_051} alt={"051 logo"} width={63} height={35} />
        <div>
            <Link href={"/"}>AFFILIATE PROGRAM </Link>
            <Link href={"/"}>PROJECT PARTNERSHIP </Link>
            <Link href={"/"}>CUSTOMER SUPPORT </Link>
            <Link href={"/"}>PROVABLY FAIR </Link>
        </div>
        <div id={c.right}>
            <span>&#x2622;</span>
            <span>&#x211A;</span>
            <span>&#x213F;</span>
            <span>&#x260E;</span>
        </div>
    </div>
     );
}
 
export default BottomBanner;