import n from "../styles/Modal.module.css";
import Image from "next/image";

const Notification = () => {
    return ( 
        <div className={n.widget}>
            <div className={n.widget_kernel}>
                <Image src={"/notification.png"} alt="notification" width={40} height={40} />  Message to the user
            </div>
        </div>
     );
}
 
export default Notification;