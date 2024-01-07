import Image from "next/image";
import { useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";
import Modal from "../components/modal";

const Super_user = () => {
    const tabs = ["User Actions", "Coupons","Case Actions"];
    const [selectedTab, setTab] = useState("User Actions");
    const [activeUsers,setActiveUsers] = useState<any>(null);
    const [allCoupons,setAllCoupons] = useState<any>(null);

    const [modalOpen,setModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>()

    const couponName = useRef<HTMLInputElement>(null);
    const couponValue = useRef<HTMLInputElement>(null);
    const couponQuantity = useRef<HTMLInputElement>(null);
    const couponPerUser = useRef<HTMLInputElement>(null);
    const createcoupon = useRef<HTMLInputElement>(null);

    const caseName = useRef<HTMLInputElement>(null);
    const caseCategory = useRef<HTMLSelectElement>(null);
    const caseImage = useRef<HTMLInputElement>(null);

    const handleFetchAll = async () => {
        setFeedback({message:"Fetching all users...",color:"gray"})
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

    const handleCreateCoupon = async () => {
        const ready = [couponName, couponValue, couponQuantity, couponPerUser].every(inputRef => inputRef.current?.value);
        if(ready){
            setFeedback({message:"Creating new coupon...",color:"gray"});
            setModalOpen(true);
            const coupon = {
                couponName:couponName.current?.value,
                couponValue:parseFloat(couponValue.current!.value),
                couponQuantity:parseInt(couponQuantity.current!.value),
                couponPerUser:parseInt(couponPerUser.current!.value),
                disabled:false,
                usedXtimes:0
            }
            try {
                const response = await fetch("/api/createcoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                if(resJson){
                    console.log(resJson);
                    setFeedback({message:resJson.message,color:resJson.color});
                    setAllCoupons([...allCoupons,coupon]);
                    setTimeout(() => {
                        setModalOpen(pr=>!pr);
                        createcoupon.current!.checked = false;
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            confirm("All fields must be filled to create a coupon!")
        }
    }

    const handleFetchCoupons = async () => {
        if(allCoupons){
            createcoupon.current!.checked = false;
            return
        }
        setFeedback({message:"Fetching all coupons...",color:"gray"})
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchcoupons");
            const resJson = await response.json();
            if(resJson){
                console.log(resJson);
                if(resJson.data){
                    setAllCoupons(resJson.data)
                }
                setModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleDeleteCoupon = async (coupon:any) => {
        if(confirm(`Are you sure to delete the coupon titled ${coupon.couponName} ?`)){
            setFeedback({message:"Deleting coupon...",color:"gray"})
            setModalOpen(true);
            try {
                const response = await fetch("/api/delcoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                if(resJson){
                    setFeedback(resJson);
                    if(response.status === 200){
                        const updatedAllCoupons = allCoupons.filter((c:any)=>c.couponName !== coupon.couponName);
                        setAllCoupons(updatedAllCoupons);
                    }
                    setTimeout(() => {
                        setModalOpen(false);
                    }, 2000);
                    console.log(resJson);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleExpireCoupon = async (coupon:any) => {
        if(confirm(`Are you sure to expire the coupon titled ${coupon.couponName} ?`)){
            setFeedback({message:"Expiring coupon...",color:"gray"})
            setModalOpen(true);
            try {
                const response = await fetch("/api/expirecoupon",{
                    method:"POST",
                    body:JSON.stringify(coupon)
                });
                const resJson = await response.json();
                console.log(resJson)
                if(resJson){
                    setFeedback(resJson);
                    if(response.status === 200){
                        const updatedAllCoupons = allCoupons.map((c:any) => {
                            if (c.couponName === coupon.couponName) {
                              return { ...c, disabled: true };
                            }
                            return c;
                        });
                        setAllCoupons(updatedAllCoupons);
                    }
                    setTimeout(() => {
                        setModalOpen(false);
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleCreateCase = async () => {
        const warning = !caseName.current?.value ? "Please enter case name" : 
                        !caseCategory.current?.value ? "Please choose case category" :
                        !caseImage.current?.files![0] ? "Please upload case image" : "";
        const ready = [caseName,caseCategory].every((rf) => rf.current?.value) && caseImage.current?.files![0];

        if(!ready){
            confirm(warning);
            return
        };

        
        setFeedback({message:"Creating new case",color:"gray"});
        setModalOpen(true);

        const originalFile = caseImage.current.files![0];
        const file_extension = originalFile.name.split(".").pop();
        console.log(new Date().getTime());
        const newFileName = (caseCategory.current!.value + "-" + caseName.current!.value + "-" + (new Date().getTime()) + "." + file_extension).replace(/\s/g, "");

        console.log(newFileName);


        const modifiedFile = new File([originalFile], newFileName, {
        type: originalFile.type,
        });


        //create form data and appen fields and images
        const caseINFO = new FormData();
        caseINFO.append("caseImage",modifiedFile);
        caseINFO.append("caseName",caseName.current?.value!);
        caseINFO.append("caseFileName", newFileName)
        caseINFO.append("caseCategory",caseCategory.current?.value!);

        try {
            const response = await fetch("/api/createcase",{
                method:"POST",
                body:caseINFO
            });
            if(response.ok){
                const resJson = await response.json();
                console.log(resJson);
                setFeedback(()=>resJson);
                setTimeout(() => {
                    setModalOpen(pr=>!pr);
                }, 1500);
            }
        } catch (error) {
        }
    }

/*     const handleCasaImageUpload = () => {
        if(caseImage.current){
                const case_image = new FormData();
                case_image.append('case_image', caseImage.current.files![0]);
                case_image.append('caseName', 'Casa de Papel');
                fetch("/api/createcase",{
                    method:"POST",
                    body:case_image
                })
                console.log(caseImage.current.files![0]);
        }
    } */




    return ( <>
    <div className={s.panel}>
        {
            modalOpen &&
            <Modal modalOpen={modalOpen} feedback={feedback} />
        }
        <div className={s.panel_kernel}>
            <div className={s.panel_kernel_tabs}>
                {
                    tabs.map((t,i)=>
                    <button key={i} value={t} onClick={()=>setTab(t)}>
                        {t}
                        {t === selectedTab && <span style={{color:t === selectedTab ? "darkorange" : "white"}} id={s.later}>&#x25BC;</span>}
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
                selectedTab === "Coupons" &&
                <div id={s.coupons}>
                    <div id={s.options}>
                        <button id={s.showcoupons} onClick={handleFetchCoupons}>Show all coupons</button>
                        <label htmlFor="createcoupon">Create coupon</label> 
                        <input id="createcoupon" type="checkbox" ref={createcoupon} />
                        <span>&#x25BC;</span>
                        <div id={s.createcoupon}>
                            <input ref={couponName} type="text" placeholder="Coupon name..." />
                            <input ref={couponValue} type="number" min={1} max={100000} placeholder="Coupon value..." />
                            <input ref={couponQuantity} type="number" min={1} max={100000} placeholder="Quantity..." />
                            <input ref={couponPerUser} type="number" min={1} max={999} placeholder="Per user..." />
                            <button onClick={handleCreateCoupon}>CREATE COUPON</button>
                        </div>
                        
                            {
                                allCoupons &&
                                <div id={s.allcoupons}>
                                        <div key={-1} id={s.each} style={{background:"navy"}}>
                                            <p>Coupon name<h4 id={s.anchor}>&#x25BC;</h4></p>
                                            <p>Value</p>
                                            <p>Quantity</p>
                                            <p>Per user</p>
                                            <p>Used</p>
                                            <p>Active</p>
                                        </div>
                                    {
                                        allCoupons.map((coupon:any,i:any)=>
                                        <div key={i} id={s.each}>
                                            <p>{coupon.couponName}</p>
                                            <p>{coupon.couponValue}</p>
                                            <p>{coupon.couponQuantity}</p>
                                            <p>{coupon.couponPerUser}</p>
                                            <p>{coupon.usedXtimes}</p>
                                            <p style={{color:coupon.disabled ? "gray" : "lightgreen"}}>{coupon.disabled ? "no" : "yes"}</p>
                                            <button onClick={()=>handleDeleteCoupon(coupon)}>
                                                <Image alt="delete" src={"/delete.png"} width={25} height={25} priority/>
                                            </button>
                                            <button onClick={()=>handleExpireCoupon(coupon)} disabled={coupon.disabled}>
                                                <Image alt="expired" src={"/expired.png"} width={25} height={25} priority
                                                style={{filter:coupon.disabled ? "grayscale(90%)" : "none"}}
                                                />
                                            </button>
                                        </div>
                                        )
                                    }
                                </div>
                            }
                    </div>
                    <div>
                    </div>
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

            {
                selectedTab === "Case Actions" &&
                <div id={s.coupons}>
                    <div id={s.options}>
                        <button id={s.showcoupons}>List cases</button>
                        <label htmlFor="createcoupon">Create Case</label> 
                        <input id="createcoupon" type="checkbox" ref={createcoupon} />
                        <span>&#x25BC;</span>
                        <div id={s.createcase}>
                            <div id={s.caseoptions}>
                                <button>
                                    Upload Case <br /> Image       
                                    <input
                                        ref={caseImage}
                                        type="file"
                                        accept="image/*" // Specify accepted file types (images in this case)
                                        style={{  }} // Hide the input visually
                                        /* onChange={handleCasaImageUpload} */
                                    />
                                </button>
                                <div id={s.name_cat}>
                                    <p>Case Name</p>
                                    <input type="text" placeholder="..." ref={caseName}/>
                                    <p>Category</p>
                                    <select ref={caseCategory}>
                                        <option defaultValue="" disabled>Choose Category</option>
                                        <option value="popularcases">POPULAR CASES</option>
                                        <option value="limitededition">LIMITED EDITION</option>
                                        <option value="honorarycases">HONORARY CASES</option>
                                        <option value="daocases">DAO CASES</option>
                                    </select>
                                </div>
                            </div>
                            <div id={s.gifts}>
                                <div id={s.titles}>
                                    <p>Gift name</p>
                                    <p>Gift price</p>
                                    <p>Probability</p>
                                </div>
                                <div className={s.gift}>
                                    <button><Image priority src={gift} alt="Gift image"/></button>
                                    <input type="text" placeholder="..." />
                                    <input type="text" placeholder="..." />
                                    <input type="text" placeholder="..." />
                                </div>
                                <div className={s.actions}>
                                    <div className={s.actions_double}>
                                        <p>Recommended Price</p>
                                        <p>Case Price</p>
                                    </div>
                                    <div className={s.actions_double}>
                                        <p style={{top:"-10px"}}>$ 750</p>   
                                        <input type="text" placeholder="Enter price..." />
                                    </div>
                                    <div className={s.actions_double}>
                                        <button onClick={handleCreateCase}>CREATE CASE</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    </div>
    </> );
}
 
export default Super_user;