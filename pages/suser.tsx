import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "../styles/Panel.module.css";
import gift from "../public/assets/camera.png";
import Modal from "../components/modal";
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import Gift_holder from "../components/giftholder";
import { formatter } from "../tools";
import Universal_modal from "../components/universal_modal";
import { useDispatch, useSelector } from "react-redux";
import { note_universal_modal } from "../redux/loginSlice";
import CaseEditor from "../components/caseeditor";

const Super_user = () => {
    const tabs = ["User Actions", "Coupons","Case Actions"];
    const [selectedTab, setTab] = useState("User Actions");
    const [activeUsers,setActiveUsers] = useState<any>(null);
    const [allCoupons,setAllCoupons] = useState<any>(null);
    const [allCases,setAllCases] = useState<any>();
    const [showCaseList, setShowCaselist] = useState(false);
    const universalModal = useSelector((state:any) => state.loginSlice.universal_modal);

    const dispatch = useDispatch();

    const [modalOpen,setModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const [selectedCaseImageURL, setCaseImageURL] = useState("");
    const [casetoEdit, setCasetoEdit] = useState<any>();

    const couponName = useRef<HTMLInputElement>(null);
    const couponValue = useRef<HTMLInputElement>(null);
    const couponQuantity = useRef<HTMLInputElement>(null);
    const couponPerUser = useRef<HTMLInputElement>(null);
    const createcoupon = useRef<HTMLInputElement>(null);

    const caseName = useRef<HTMLInputElement>(null);
    const caseCategory = useRef<HTMLSelectElement>(null);
    const caseImage = useRef<HTMLInputElement>(null);
    const casePrice = useRef<HTMLInputElement>(null);
    const caseIndex = useRef<HTMLInputElement>(null);

    const filteruser = useRef<HTMLInputElement>(null);

    const [userInventory, setUserInventory] = useState<any[] | null>(null);
    const [userLogs, setUserLogs] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [filterBy,setFilterBy] = useState<any>();
    const [filteredUsers, setFilteredUsers] = useState<any>();


    const [gifts, setGifts] = useState
                            <{numberofGifts:number,canAddGift:boolean, addedgifts:any[]}>
                            ({numberofGifts:1, canAddGift:false, addedgifts:[
                                {giftName:"", giftPrice:0, propability:0,giftId:1, giftImage:null}
                            ]});
    const [recommendedPrice,setRecommend] = useState<number | null>();
    const [problemsIn, setProblems] = useState<any[]>();

    useEffect(()=>{
        console.log("There is change in added gifts");
        const allGiftshaveImage = gifts.addedgifts.every(gf=>gf.giftImage);
        console.log(allGiftshaveImage);

        const totalProbability = parseInt(gifts.addedgifts.reduce((probability,gf) => {return probability+parseInt(gf.giftProbability)},0));
        console.log(totalProbability)
        if(totalProbability === 100000){
            const recommended = parseInt(gifts.addedgifts.reduce((rPrice,gf) => {return rPrice+parseInt(gf.giftPrice)*(gf.giftProbability)},0)) / 100000;
            setRecommend(recommended);
        }else{
            if(recommendedPrice){
                setRecommend(null);
            }
        }
    },[gifts.addedgifts]);


    const handleFetchAll = async () => {
        setFeedback({message:"Fetching all users...",color:"gray"})
        setModalOpen(true);
        try {
            const response = await fetch("/api/fetchusers");
            const resJson = await response.json();
            if(resJson){
                console.log(resJson);
                setActiveUsers(resJson);
                setModalOpen(pr=>!pr);
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
        const totalProbability = parseInt(gifts.addedgifts.reduce((probability,gf) => {return probability+parseInt(gf.giftProbability)},0));
        const allGiftshaveImage = gifts.addedgifts.every(gf=>gf.giftImage);
        console.log(allGiftshaveImage);
        const warnings = problemsIn ? [...problemsIn] : [];
          if (!caseName.current?.value) {
            warnings.push("Please enter case name");
          }
          if (!caseCategory.current?.value) {
            warnings.push("Please choose case category");
          }
          if (!caseImage.current?.files![0]) {
            warnings.push("Please upload case image");
          }
          if (!casePrice.current?.value) {
            warnings.push("Please enter case price!");
          }
          if (!caseIndex.current?.value) {
            warnings.push("Please enter case index!");
          }
          if(!allGiftshaveImage || !gifts.canAddGift){
            warnings.push("Please check gift fields");
          }
          if (totalProbability !== 100000 && warnings.length === 0 && allGiftshaveImage) {
            warnings.push("Total gift probability must be 100.000");
          }
          const warningMessage = warnings.join('\n');
        
        const ready = [caseName,caseCategory,casePrice,caseIndex].every((rf) => rf.current?.value) && caseImage.current?.files![0] 
                        && gifts.canAddGift && totalProbability === 100000 && allGiftshaveImage;
        
        if(!ready){
            confirm(warningMessage);
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
            for (const gf of gifts.addedgifts){
                try {
                    const giftImageUrl = await uploadFileToBlob(gf.giftImage,new Date().getTime().toString());
                    gf.giftURL = giftImageUrl;
                } catch (error) {
                    console.log(error);
                    setFeedback({message:"Failed to upload gift image to Microsoft Azure ",color:"red"});
                    setModalOpen(true);
                    setTimeout(() => {
                        setModalOpen(pr=>!pr);
                    }, 1000);
                    throw error;
                }
            }
        } catch (error) {
            console.log(error);
            setFeedback({message:"Failed to upload image to Microsoft Azure ",color:"red"});
            setModalOpen(true);
            setTimeout(() => {
                setModalOpen(pr=>!pr);
            }, 1000);
            throw error;
        }

        const caseInfo = {
            caseName:caseName.current?.value!,
            caseCategory:caseCategory.current?.value!,
            caseImageURL: caseImageURL,
            casePrice:parseFloat(casePrice.current?.value!),
            caseGifts:gifts.addedgifts,
            caseIndex:parseInt(caseIndex.current?.value as string)
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

    const handleInventory = async (user:any) => {
        setUserInventory(null);
        setUserLogs(null);
        setSelectedUser(user);
        dispatch(note_universal_modal(true));
        setFeedback({message:"Fetching user inventory...",color:"silver"})
        try {
            const response = await fetch("/api/fetchinventory?active=true",{
                method:"POST",
                body:JSON.stringify({id:user.cdpUserDID})
            });
            if(!response.ok){
                alert("Couldn't fetch inventory")
            }
            try {
                const resJson = await response.json();
                if(response.status === 200){
                    const propertyAddedResJson = resJson.map((item:any) => {
                        return { ...item, isSold: item.isSold !== true ? false : item.isSold }});
                    const sortedResJson = propertyAddedResJson.sort((a:any,b:any)=> {return a.isSold - b.isSold});
                    console.log(resJson);
                    console.log(sortedResJson)
                    setUserInventory(sortedResJson);
                }
            } catch (error) {
                console.log("Response not in json format")
            }
        } catch (error) {
            console.log("Problem var!!!",error)
        }
    }

    const handleLogs = async (user:any) => {
        setUserInventory(null);
        setUserLogs(null);
        setSelectedUser(user);
        setFeedback({message:"Fetching user logs...", color:"silver"});
        dispatch(note_universal_modal(true));
        try {
            const response = await fetch("/api/fetchuserlogs",{
                method:"POST",
                body:JSON.stringify({id:user.cdpUserDID})
            })
            if(response.status === 200){
                const resJson = await response.json();
                setUserLogs(resJson);
            }else{
                const resJson = await response.json();
                setFeedback({message:resJson.message, color:resJson.color});
                setTimeout(() => {
                    dispatch(note_universal_modal(false));
                }, 2000);
            }
        } catch (error) {
            console.log("failed to fecth logs 111",error)
        }
    }

    const handleDeleteItem = async (item:any) => {
        console.log(item);
        console.log(selectedUser);
        setFeedback({message:"Deleting item...", color:"silver"});
        setModalOpen(true);
        try {
            const response = await fetch("/api/delitem",{
                method:"POST",
                body:JSON.stringify({user:selectedUser,item:item})
            })
            if(response.status === 200){
                const resJosn = await response.json();
                setFeedback({message:resJosn.message, color:resJosn.color});
                setUserInventory((pr:any)=>{
                    const afterDEL = pr.filter((e:any)=>e.addTime !== item.addTime);
                    return afterDEL
                })
                setTimeout(() => {
                    setModalOpen(()=>false);
                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFilter = () => {
        if(filteruser.current){
            const val = filteruser.current.value;
            setTimeout(() => {
                setFilterBy(val);
            }, 300);
        }
    }

    useEffect(()=>{
        if(activeUsers && filterBy){
            setFilteredUsers(()=>{
                let result = activeUsers.filter((e:any)=>e.cdpUser.includes(filterBy));
                if(result.length === 0){
                    result = activeUsers.filter((e:any)=>e.cdpUserDID.includes(filterBy));
                }
                return result;
            })
        }
        if(filterBy === ""){
            setFilteredUsers(null);
        }
    },[filterBy]);

    const handleDeleteCase = async (c:any) => {
        console.log(c._id);
        if(!confirm(`Case to delete is : ${c.caseName}! Are you sure?`)){
            return
        }
        setFeedback({message:"Deleting case...",color:"silver"});
        setModalOpen(true);
        try {
            const response = await fetch("/api/delcase",{
                method:"POST",
                body:c._id
            });
            if(response.status === 200){
                setFeedback({message:"CASE deleted*", color:"lawngreen"});
                setAllCases((pr:any)=>{
                    const remainingCases = pr.filter((cs:any)=>cs._id !== c._id );
                    return remainingCases
                });
                setTimeout(() => {
                    setModalOpen(false);
                }, 2000);
            }else{
                setFeedback({message:"FAILED to DELETE case !", color:"crimson"});
                setTimeout(() => {
                    setModalOpen(false);
                }, 2000);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleEditPopUp = async (c:any) => {
        setFeedback({message:"editcase", color:""});
        dispatch(note_universal_modal(true));
        setCasetoEdit(c);
    }

    const currentProbabilityTotal = gifts && parseInt(gifts.addedgifts.reduce((probability:any,gf:any) => {return probability+parseInt(gf.giftProbability)},0));


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
                    <div id={s.filter}>
                        <input ref={filteruser} type={"text"}
                            placeholder="search for user by ID or Username..." onChange={handleFilter}/>
                    </div>
                    <div key={-1} id={s.user} style={{backgroundColor:"navy", padding:"5px",marginBottom:"10px"}}>
                        <span>Username</span>
                        <span>ID</span>
                        <span>Email</span>
                        <span>CDP Balance</span>
                        <span>Inventory</span>
                        <span>Log</span>
                    </div>
                    {
                        (filteredUsers ?? activeUsers).map((user:any,i:any)=>
                        <>
                        <div key={i} id={s.user}>
                            <span>{user.cdpUser}</span>
                            <span>{user.cdpUserDID}</span>
                            <span>{user.cdpEmail}</span>
                            <span>{formatter(user.balance)}</span>
                            <button onClick={()=>handleInventory(user)}>
                            </button>
                            <button onClick={()=>handleLogs(user)} id={s.log}></button>
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
                                        onChange={showTemporaryCaseImage}
                                    />
                                </button>
                                <div id={s.name_cat}>
                                    <p>Case Name</p>
                                    <input type="text" placeholder="..." ref={caseName}/>
                                    <p>Category</p>
                                    <select ref={caseCategory}>
                                        <option defaultValue="" disabled>Choose Category</option>
                                        <option value="popularcases">POPULAR CASES</option>
                                        <option value="daocases">DAO CASES</option>
                                        <option value="honorarycases">HONORARY CASES</option>
                                        <option value="collectioncases">COLLECTION CASES</option>
                                    </select>
                                </div>
                                <button id={s.addgift} onClick={handleAddGift}>Add Gift</button>
                                <input id={s.caseindex} type="number" min={1} max={999} ref={caseIndex} placeholder="Case index..."/>
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
                                        setProblems={setProblems}
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
                                        <div id={s.probab}>
                                            <span style={{color:currentProbabilityTotal === 100000 ? "green" : "crimson"}}>{currentProbabilityTotal && currentProbabilityTotal}</span>
                                            /100000
                                        </div>
                                    </div>
                                    <div className={s.actions_double}>
                                        <p style={{top:"-10px"}}>$ {recommendedPrice && recommendedPrice}</p>   
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
                                    <p>Index</p>
                                    <p>Price</p>
                                    <p>xOpened</p>
                                    <p>Turnover</p>
                                    <p>Gifts</p>
                                    <p></p><p></p><p></p>
                                </div>
                                <div id={s.allcases}>
                                    {
                                        allCases.map((c:any,i:number)=>
                                        <div id={s.eachcase} key={i}>
                                            <div id={s.casevalues}>
                                                <p style={{color:"silver"}}>{c.caseName}</p>
                                                <p>{c.caseCategory}</p>
                                                <p>{c.caseIndex}</p>
                                                <p style={{color:"lightgreen"}}>${c.casePrice}</p>
                                                <p>{c.openedXtimes ?? ""}</p>
                                                <p>{c.turnover ? formatter(c.turnover) : ""}</p>
                                                <p style={{color:"yellow"}}>{c.caseGifts.length}</p>
                                                <button onClick={()=>handleDeleteCase(c)} >
                                                    <Image alt="delete case" src={"/delete.png"} width={25} height={25} priority/>
                                                </button>
                                                <button onClick={()=>handleEditPopUp(c)}>
                                                </button>
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
            {
                universalModal && feedback && feedback.message.includes("inventory") &&
                <Universal_modal>
                    <div id={s.inventory}>
                    {
                        !userInventory ?
                        <h2 style={{color:feedback.color}}>{feedback.message}</h2>
                        :
                        <>
                        <h3 id={s.forwho}>{selectedUser.cdpUser}</h3>
                        <div id={s.each} key={-1}>
                            <span style={{color:"white"}}>Item</span>
                            <span style={{color:"white"}}>Price</span>
                            <span style={{color:"white"}}>Active</span>
                        </div>
                        {                        
                        userInventory.map((item,index)=>
                        <div id={s.each} key={index}>
                            <span>{item.giftName}</span>
                            <span>{formatter(item.giftPrice)}</span>
                            <span style={{color:item.isSold ? "crimson" :"yellow"}}>{item.isSold ? "SOLD" : "Active"}</span>
                            <button onClick={()=>handleDeleteItem(item)}>DELETE</button>
                        </div>
                        )}
                        </>
                    }
                    </div>
                </Universal_modal>
            }

            {
                universalModal && feedback && feedback.message.includes("logs") &&
                <Universal_modal>
                    <div id={s.logs}>
                    {
                        !userLogs ?
                        <h2 style={{color:feedback.color}}>{feedback.message}</h2>
                        :
                        <>              
                        <h3 id={s.forwho}>{selectedUser.cdpUser}</h3>
                        <h3 style={{color:"lawngreen"}}>Member since</h3>
                        <div id={s.logeach}>
                            <span>{new Date(userLogs.joinedAt).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</span>
                        </div>
                        <h3 style={{color:"pink"}}>Coupons used</h3>
                        <div id={s.logcoupons}>
                                <span className={s.title} key={-1}>Coupon name</span>
                                <span className={s.title} key={-2}>xTimes used</span>
                            {
                                userLogs.coupons_used.map((c:any,i:any)=>
                                <>
                                <span style={{color:i%2 ? "lightcoral" : "lightseagreen"}} key={i}>{c.coupon}</span>
                                <span style={{color:i%2 ? "lightcoral" : "lightseagreen"}} key={i+1}>{c.usedxTimes}</span>
                                </>
                                )
                            }
                        </div>
                        <h3 style={{color:"skyblue"}}>Inventory</h3>
                        <div id={s.loginventory}>
                            <div id={s.line}>
                                <span className={s.title} key={-1}>Gift Name</span>
                                <span className={s.title} key={-2}>Case Opened at:</span>
                                <span className={s.title} key={-3}>Status</span>
                            </div>
                            {
                                userLogs.inventory.map((g:any,i:number)=>
                                <>
                                <div id={s.line}>
                                    <span style={{color:i%2 ? "lightcoral" : "lightseagreen"}} key={i}>{g.giftName}</span>
                                    <span style={{color:i%2 ? "lightcoral" : "lightseagreen"}} key={i+1}>{new Date(g.addTime).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</span>
                                    <span style={{color:g.isSold ? "crimson" : "gold"}} key={i+2}>{g.isSold ? "SOLD" : "ACTIVE"}</span>
                                </div>
                                </>
                                )
                            }
                        </div>
                        </>
                    }
                    </div>
                </Universal_modal>
            }

            {
                universalModal && feedback && feedback.message.includes("editcase") &&
                <Universal_modal>
                    <CaseEditor casetoEdit={casetoEdit} setAllCases={setAllCases}/>
                </Universal_modal>
            }

        </div>
    </div>
    </> );
}
 
export default Super_user;
