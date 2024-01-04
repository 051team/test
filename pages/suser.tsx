import { useState } from "react";
import s from "../styles/Panel.module.css";

const Super_user = () => {
    const tabs = ["User Actions", "Coupons","Case Actions"];
    const [selectedTab, setTab] = useState("User Actions");
    const [activeUsers,setActiveUsers] = useState<any>(null);
    const [modalOpen,setModalOpen] = useState(false);

    const handleFetchAll = async () => {
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchusers");
            const resJson = await response.json();
            if(resJson){
                console.log(resJson);
                setActiveUsers(resJson);
                setModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return ( <>
    <div className={s.panel}>
        {
            modalOpen &&
            <div className={s.panel_modal}>
                <div className={s.panel_modal_kernel}>
                    <span className={s.loader}></span>
                    <h2>Fetching active users...</h2>
                </div>
            </div>
        }
        <div className={s.panel_kernel}>
            <div className={s.panel_kernel_tabs}>
                {
                    tabs.map((t,i)=>
                    <button key={i} value={t} onClick={()=>setTab(t)} style={{opacity:t === selectedTab ? "1" : "0.5"}}>
                        {t}
                        {t === selectedTab && <span id={s.later}>&#x25BC;</span>}
                    </button>
                    )
                }
            </div>
            {
                selectedTab === "User Actions" && !activeUsers &&
                <div id={s.useractions}>
                    <button id={s.showall} onClick={handleFetchAll}>Show all users</button>
                </div>
            }
            {
                selectedTab === "User Actions" && activeUsers &&
                <div id={s.activeusers}>
                        <div key={-1} id={s.user} style={{backgroundColor:"navy", padding:"5px",marginBottom:"10px"}}>
                            <span>Username</span>
                            <span>Email</span>
                            <span>CDP Balance</span>
                        </div>
                    {
                        activeUsers.map((user:any,i:any)=>
                        <>
                        <div key={i} id={s.user}>
                            <span>{user.cdpUser}</span>
                            <span>{user.cdpEmail}</span>
                            <span>{user.balance}</span>
                        </div>
                        </>
                        )
                    }
                </div>
            }
        </div>
    </div>
    </> );
}
 
export default Super_user;