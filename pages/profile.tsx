import Image from "next/image";
import Navbar from "../components/navbar";
import p from "../styles/Profile.module.css";

const Profile = () => {
    const username = "mrmentor";
    const balance = "$80.55"
    return ( 
        <div className={p.profile}>
            <div id={p.black}></div>
            <Navbar />
            <div className={p.profile_kernel}>
                <div className={p.profile_kernel_card}>
                    <Image src={"/assets/2.png"} alt="profile image" width={100} height={100} />
                    <div id={p.info}>
                        <h3>{username.toUpperCase()}</h3>
                        <h4>{balance}</h4>
                    </div>
                </div>
                <div className={p.profile_kernel_line}>
                    <span>INVENTORY</span>
                </div>
                <div className={p.profile_kernel_inventory}></div>

            </div>
        </div>
     );
}
 
export default Profile;