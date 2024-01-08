import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";
import Modal from "../components/modal";
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import Gift_holder from "../components/giftholder";

const Super_user = () => {
    const tabs = ["User Actions", "Coupons","Case Actions"];
    const [selectedTab, setTab] = useState("User Actions");
    const [activeUsers,setActiveUsers] = useState<any>(null);
    const [allCoupons,setAllCoupons] = useState<any>(null);
    const [allCases,setAllCases] = useState<any>();
    const [showCaseList, setShowCaselist] = useState(false);


    const [modalOpen,setModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const [selectedCaseImageURL, setCaseImageURL] = useState("");

    const couponName = useRef<HTMLInputElement>(null);
    const couponValue = useRef<HTMLInputElement>(null);
    const couponQuantity = useRef<HTMLInputElement>(null);
    const couponPerUser = useRef<HTMLInputElement>(null);
    const createcoupon = useRef<HTMLInputElement>(null);

    const caseName = useRef<HTMLInputElement>(null);
    const caseCategory = useRef<HTMLSelectElement>(null);
    const caseImage = useRef<HTMLInputElement>(null);
    const casePrice = useRef<HTMLInputElement>(null);


    const [gifts, setGifts] = useState
                            <{numberofGifts:number,canAddGift:boolean, addedgifts:any[]}>
                            ({numberofGifts:1, canAddGift:false, addedgifts:[
                                {giftName:"", giftPrice:0, propability:0,giftId:1}
                            ]},);

    const [giftsReady,setGiftsReady] = useState<boolean>(false);

    useEffect(()=>{
        console.log("There is change in added gifts");
        console.log(gifts.addedgifts);
    },[gifts.addedgifts])

    


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

    const handleFetchCases = async () => {
/*         if(allCases){
            setShowCaselist(true);
            return
        }; */
        setFeedback({message:"Listing all cases...",color:"gray"});
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchcases");
            try {
                const resJson = await response.json();
                const cases = resJson.data;
                setAllCases(cases);
                setShowCaselist(()=>true);
                console.log(cases);
                setModalOpen(pr=>!pr);
            } catch (error) {
                setFeedback({message:"Data not available in response",color:"red"});
                setModalOpen(pr=>!pr);
            }
        } catch (error) {
            setFeedback({message:"Failed to list cases!",color:"red"});
            setModalOpen(pr=>!pr);
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


    const containerName = process.env.NEXT_PUBLIC_CONTAINER_NAME!;
    const sasToken = process.env.NEXT_PUBLIC_STORAGESASTOKEN;
    const storageAccountName = process.env.NEXT_PUBLIC_STORAGERESOURCENAME;

    const uploadFileToBlob = async (file: File | null, newFileName: string) => {
        if (!file) {
          console.log("Not found");
        } else {
          const blobService = new BlobServiceClient(
            /* `https://${storageAccountName}.blob.core.windows.net/?${sasToken}` */
            process.env.NEXT_PUBLIC_SASURL!
          );
  
          const containerClient: ContainerClient =
            blobService.getContainerClient(containerName!);
          await containerClient.createIfNotExists({
            access: 'container',
          });
  
          const blobClient = containerClient.getBlockBlobClient(newFileName);
          const options = { blobHTTPHeaders: { blobContentType: file.type } };
  
          await blobClient.uploadData(file, options);
          console.log("Upload successful");

          const blobUrl = blobClient.url;
          return blobUrl;
        }
    };
    
    const showTemporaryCaseImage = () => {
        if(caseImage.current && caseImage.current.files){
            const caseImageURL = URL.createObjectURL(caseImage.current.files[0]);
            setCaseImageURL(caseImageURL);
        }
    }

    const handleCreateCase = async () => {
        const warning = !caseName.current?.value ? "Please enter case name" : 
                        !caseCategory.current?.value ? "Please choose case category" :
                        !caseImage.current?.files![0] ? "Please upload case image" : 
                        !casePrice.current?.value ? "Please enter case price!" :
                        !gifts.canAddGift ? "Gifts are not ready!": "";
        const ready = [caseName,caseCategory,casePrice].every((rf) => rf.current?.value) && caseImage.current?.files![0] 
                        && gifts.canAddGift;

        if(!ready){
            confirm(warning);
            return
        };
        
        setFeedback({message:"Creating new case...",color:"gray"});
        setModalOpen(true);

        const originalFile = caseImage.current.files![0];
        const file_extension = originalFile.name.split(".").pop();
        const newFileName = (caseCategory.current!.value + "-" + caseName.current!.value + "-" + (new Date().getTime()) + "." + file_extension).replace(/\s/g, "");

        console.log(newFileName);

        let caseImageURL:string | undefined;

        try {
            caseImageURL = await uploadFileToBlob(originalFile, newFileName);
        } catch (error) {
            console.log(error)
        }

        if(!caseImageURL){
            setFeedback({message:"Failed to upload image to Microsoft Azure ",color:"red"});
            setModalOpen(true);
            setTimeout(() => {
                setModalOpen(pr=>!pr);
            }, 1000);
        }

        //const caseImageURL = await uploadFileToBlob(originalFile, newFileName);


        const caseInfo = {
            caseName:caseName.current?.value!,
            caseCategory:caseCategory.current?.value!,
            caseImageURL: caseImageURL,
            casePrice:casePrice.current?.value,
            caseGifts:gifts.addedgifts
        }

        try {
            const response = await fetch("/api/createcase",{
                method:"POST",
                body:JSON.stringify(caseInfo)
            });
            if(response.ok){
                const resJson = await response.json();
                console.log(resJson);
/*                 if(response.status === 201){
                    setAllCases([...allCases, caseInfo]);
                } */
                setFeedback(()=>resJson);
                setTimeout(() => {
                    setModalOpen(pr=>!pr);
                }, 1500);
                //setShowCaselist(pr=>!pr);
            }
        } catch (error) {
        }
    }

    const handleAddGift = () => {
        if(!gifts.canAddGift){
            alert("Can not add gifts before filling existing gift details");
            return
        }
        setGifts({
            ...gifts, numberofGifts:gifts.numberofGifts+1, canAddGift:false,
            addedgifts:[...gifts.addedgifts, {giftName:"", giftPrice:0, propability:0,giftId:gifts.numberofGifts+1}]
        })
    }

    return ( <>
    <div className={s.panel}>
        <div style={{background:"black", position:"fixed", top:"0", left:"0", right:"0", bottom:"0"}}></div>
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
                        <button id={s.showcoupons} onClick={handleFetchCases}>List cases</button>
                        <label onClick={()=>setShowCaselist(false)} htmlFor="createcoupon">Create Case</label> 
                        <input id="createcoupon" type="checkbox" ref={createcoupon} />
                        <span>&#x25BC;</span>
                        <div id={s.createcase} style={{visibility:showCaseList ? "hidden" : "visible"}}>
                            <div id={s.caseoptions}>
                                <button>
                                    {
                                        !selectedCaseImageURL ?
                                        <div>Upload Case <br /> Image </div>
                                        :
                                        <Image src={selectedCaseImageURL} id={s.caseiamge} alt="Case Image" fill/>
                                    }      
                                    <input
                                        ref={caseImage}
                                        type="file"
                                        accept="image/*" // Specify accepted file types (images in this case)
                                        style={{  }} // Hide the input visually
                                        onChange={showTemporaryCaseImage}
                                    />
                                </button>
                                <div id={s.name_cat}>
                                    <p>Case Name</p>
                                    <input type="text" placeholder="..." ref={caseName}/>
                                    <p>Category</p>
                                    <select ref={caseCategory}>
                                        <option defaultValue="" disabled>Choose Category</option>
                                        <option value="Popular Cases">POPULAR CASES</option>
                                        <option value="Limited Edition">LIMITED EDITION</option>
                                        <option value="Hononary Cases">HONORARY CASES</option>
                                        <option value="DAO Cases">DAO CASES</option>
                                    </select>
                                </div>
                                <button id={s.addgift} onClick={handleAddGift}>Add Gift</button>
                            </div>
                            <div id={s.gifts}>
                                <div id={s.titles}>
                                    <p>Gift name</p>
                                    <p>Gift price</p>
                                    <p>Probability</p>
                                </div>
                                {
                                    gifts.addedgifts.map((g,i)=>
                                    <Gift_holder key={i} 
                                        setGiftsReady={setGiftsReady} 
                                        setGifts={setGifts} 
                                        gifts={gifts} 
                                        giftId={g.giftId}
                                    />
                                    )
                                }
                                <div className={s.actions}>
                                    <div className={s.actions_double}>
                                        <p>Recommended Price</p>
                                        <p>Case Price</p>
                                    </div>
                                    <div className={s.actions_double}>
                                        <p style={{top:"-10px"}}>$ 750</p>   
                                        <input type="text" placeholder="Enter price..." ref={casePrice} />
                                    </div>
                                    <div className={s.actions_double}>
                                        <button onClick={handleCreateCase}>CREATE CASE</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            allCases && showCaseList &&
                            <div id={s.listcases}>
                                <div id={s.titles}>
                                    <p>Case Name</p>
                                    <p>Category</p>
                                    <p>Price</p>
                                </div>
                                <div id={s.allcases}>
                                    {
                                        allCases.map((c:any,i:number)=>
                                        <div id={s.eachcase} key={i}>
                                            <Image priority src={c.caseImageURL} width={150} height={200} alt="Case Image" id={s.caseimage} />
                                            <div id={s.casevalues}>
                                                <p>{c.caseName}</p>
                                                <p>{c.caseCategory}</p>
                                                <p>${c.casePrice}</p>
                                            </div>
                                            <div id={s.gifts}>
                                                {
                                                    c.caseGifts.map((gf:any,i:number)=>
                                                    <div id={s.gift} key={i}>
                                                        {gf.giftName} <br />
                                                        {gf.giftPrice} <br />
                                                        {gf.giftProbability} 
                                                    </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    </div>
    </> );
}
 
export default Super_user;






/* const getBlobs = async () => {
    const returnedBlobUrls: string[] = [];
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );

    const containerClient: ContainerClient =
      blobService.getContainerClient(containerName!);
    
      for await (const blob of containerClient.listBlobsFlat()) {
        returnedBlobUrls.push(
          `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
        );
      }
    console.log(returnedBlobUrls);
    return returnedBlobUrls;
} */