import n from "../styles/Wrapper.module.css";
import Image from "next/image";

const Notification = ({text}:any) => {
    return ( 
        <div className={n.widget}>
            <div className={n.widget_kernel}>
                <Image src={"/notification.png"} alt="notification" width={40} height={40} />  {text}
            </div>
        </div>
     );
}
 
export default Notification;