import { useEffect, useRef, useState } from "react";
import s from "../styles/Editcase.module.css";
import Image from "next/image";
import { uploadFileToBlob } from "../tools";
import Gift_holder_Editor from "./editor_giftholder";
import Modal from "./modal";
import { useDispatch } from "react-redux";
import { note_universal_modal } from "../redux/loginSlice";

const CaseEditor = ({casetoEdit,setAllCases}:any) => {
    const dispatch = useDispatch();
    const [selectedCaseImageURL, setCaseImageURL] = useState(casetoEdit.caseImageURL);
    const [selectedCategory, setSelectedCategory] = useState(casetoEdit.caseCategory);
    const [recommendedPrice,setRecommend] = useState<number | null>();
    const [gifts, setGifts] = useState
                                    <{numberofGifts:number,canAddGift:boolean, addedgifts:any[]}>
                                    ({numberofGifts:1, canAddGift:true, addedgifts:casetoEdit.caseGifts});
    const [problemsIn, setProblems] = useState<any[]>();

    const caseCategory = useRef<HTMLSelectElement>(null);
    const caseImage = useRef<HTMLInputElement>(null);
    const casePrice = useRef<HTMLInputElement>(null);
    const caseIndex = useRef<HTMLInputElement>(null);
    const caseName = useRef<HTMLInputElement>(null);


    const df_cName = casetoEdit.caseName;
    const df_cPrice = casetoEdit.casePrice;
    const df_cIndex = casetoEdit.caseIndex;
    
    const [modalOpen,setModalOpen] = useState(false);
    const [feedback,setFeedback] = useState<{message:string,color:string}>();
    const currentProbabilityTotal = parseInt(gifts.addedgifts.reduce((probability:any,gf:any) => {return probability+parseInt(gf.giftProbability)},0));


    useEffect(()=>{
        console.log("case editor");
        const allGiftshaveImage = gifts.addedgifts.every((gf:any)=>gf.giftImage);
        console.log(allGiftshaveImage);

        const totalProbability = parseInt(gifts.addedgifts.reduce((probability:any,gf:any) => {return probability+parseInt(gf.giftProbability)},0));
        if(totalProbability === 100000){
            const recommended = parseInt(gifts.addedgifts.reduce((rPrice:any,gf:any) => {return rPrice+parseInt(gf.giftPrice)*(gf.giftProbability ?? 0)},0)) / 100000;
            setRecommend(recommended);
        }else{
            if(recommendedPrice){
                setRecommend(null);
            }
        }
    },[gifts.addedgifts]);


    const handleAddGift = () => {
        if(!gifts.canAddGift){
            alert("Can not add gifts before filling existing gift details");
            return
        }
        setGifts({
            ...gifts, numberofGifts:gifts.numberofGifts+1, canAddGift:false,
            addedgifts:[...gifts.addedgifts, {giftName:"", giftPrice:0, propability:"0",giftId:gifts.addedgifts.length+2}]
        })
    }

    const showTemporaryCaseImage = () => {
        if(caseImage.current && caseImage.current.files){
            const caseImageURL = URL.createObjectURL(caseImage.current.files[0]);
            setCaseImageURL(caseImageURL);
        }
    }

    const handleCategoryChange = (event:any) => {
        setSelectedCategory(event.target.value);
    };


    const handleEditCase = async () => {
        const cName = caseName.current?.value; if(!cName){alert("Enter Case Name");return};
        const cCategory = caseCategory.current?.value;
        const cIndex = caseIndex.current?.value; if(!cIndex){alert("Enter Case Index");return};
        const totalProbability = parseInt(gifts.addedgifts.reduce((probability,gf) => {return probability+parseInt(gf.giftProbability)},0));
        const allGiftshaveImage = gifts.addedgifts.every(gf=>gf.giftImage);
        const allGiftshavePrice = gifts.addedgifts.every(gf=>gf.giftPrice && gf.giftPrice > 0);
        const allGiftshaveName = gifts.addedgifts.every(gf=>gf.giftName);
        const allGiftshaveProbability = gifts.addedgifts.every(gf=>gf.giftProbability);

        if(!allGiftshaveName){
            alert("All gifts must have gift name");
            return;
        }
        if(!allGiftshaveProbability){
            alert("All gifts must have probability value");
            return;
        }
        if(!allGiftshavePrice){
            alert("All gifts must have price value");
            return;
        }
        if(!allGiftshaveImage){
            alert("All gifts must have images");
            console.log(gifts)
            return;
        }
        if(totalProbability !== 100000){
            alert("Total Probability must be 100 000");
            return;
        }
        
        let caseImageURL = selectedCaseImageURL;
        let newFileName:string | undefined;
        let originalFile:any;

        if(caseImage.current && caseImage.current.files![0]){
            originalFile = caseImage.current.files![0];    
            const file_extension = originalFile.name.split(".").pop();
            newFileName = (caseCategory.current!.value + "-" + caseName.current!.value + "-" + (new Date().getTime()) + "." + file_extension).replace(/\s/g, "");
            caseImageURL =await uploadFileToBlob(originalFile, newFileName) 
        }

        const CaseConfigs = cName && cCategory && cIndex && caseImageURL ? true : false;
        console.log("CASE Config ready? : ?", CaseConfigs);

        if (!casePrice.current?.value) {
            alert("Please enter case price!");
            return
        }
        try {
            for (const gf of gifts.addedgifts){
                try {
                    if(gf.giftImage.name){
                        const giftImageUrl = await uploadFileToBlob(gf.giftImage,new Date().getTime().toString());
                        gf.giftURL = giftImageUrl;
                        console.log("new url created", giftImageUrl)
                    }else{
                        console.log("existing url");
                        gf.giftURL = gf.giftURL ?? gf.giftImage;
                    }
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
            caseName:caseName.current?.value ??  casetoEdit.caseName,
            caseCategory:caseCategory.current?.value ?? casetoEdit.caseCategory,
            caseImageURL: caseImageURL,
            casePrice:parseFloat(casePrice.current?.value!) ?? casetoEdit.casePrice,
            caseGifts:gifts.addedgifts,
            caseIndex:parseInt(caseIndex.current?.value as string)
        }

        try {
            setFeedback({message:"Updating CASE",color:"silver"});
            setModalOpen(true);
            const response = await fetch("/api/editcase",{
                method:"POST",
                body:JSON.stringify({caseInfo:caseInfo, id:casetoEdit._id})
            });
            if(response.ok){
                const resJson = await response.json();
                console.log(resJson);
                setFeedback(()=>resJson.feedback);
                setAllCases((pr:any)=>{
                 const udaptedCases = pr.filter((cs:any)=>cs._id !== casetoEdit._id);
                 return [resJson.newCase,...udaptedCases]
                })
                setTimeout(() => {
                    setModalOpen(false);
                    dispatch(note_universal_modal(false));
                }, 1500);
            }
        } catch (error) {
        }

    }

    return ( 
<>
        {
            modalOpen &&
            <Modal modalOpen={modalOpen} feedback={feedback} />
        }
    {
        casetoEdit &&
        <div id={s.createcase}>
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
                    accept="image/*"
                    onChange={showTemporaryCaseImage}
                />
            </button>
            <div id={s.name_cat}>
                <p>Case Name</p>
                <input type="text" defaultValue={df_cName} placeholder="..." ref={caseName}/>
                <p>Category</p>
                <select ref={caseCategory} value={selectedCategory} onChange={handleCategoryChange}>
                    <option defaultValue="" disabled>Choose Category</option>
                    <option value="popularcases">POPULAR CASES</option>
                    <option value="limitededition">LIMITED EDITION</option>
                    <option value="honorarycases">HONORARY CASES</option>
                    <option value="daocases">DAO CASES</option>
                </select>
            </div>
            <button id={s.addgift} onClick={handleAddGift}>Add Gift</button>
            <input id={s.caseindex} type="number" min={1} max={999} defaultValue={df_cIndex} ref={caseIndex} placeholder="Case index..."/>
        </div>
        <div id={s.gifts}>
            <div id={s.titles}>
                <p>Gift name</p>
                <p>Gift price</p>
                <p>Probability</p>
            </div>
            {
                gifts.addedgifts.map((g:any,i:number)=>
                <Gift_holder_Editor key={i} 
                    setProblems={setProblems}
                    setGifts={setGifts} 
                    gifts={gifts} 
                    giftId={g.giftId}
                    gift={g}
                />
                )
            }
            <div className={s.actions}>
                <div className={s.actions_double}>
                    <p>Recommended Price</p>
                    <p style={{color:"white",fontSize:"small"}}>Case Price</p>
                    <div id={s.probab}>
                        <span style={{color:currentProbabilityTotal === 100000 ? "green" : "crimson"}}>{currentProbabilityTotal && currentProbabilityTotal}</span>
                        /100000
                    </div>
                </div>
                <div className={s.actions_double}>
                    <p style={{top:"-10px"}}>$ {recommendedPrice && recommendedPrice}</p>   
                    <input type="text" placeholder="Enter price..." defaultValue={casetoEdit.casePrice} ref={casePrice} />
                </div>
                <div className={s.actions_double}>
                    <button onClick={handleEditCase}>UPDATE CASE</button>
                </div>
            </div>
        </div>
        </div>
    }
</>
     );
}
 
export default CaseEditor;