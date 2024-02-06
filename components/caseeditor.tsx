import { useRef, useState } from "react";
import s from "../styles/Editcase.module.css";
import Image from "next/image";
import { uploadFileToBlob } from "../tools";

const CaseEditor = ({casetoEdit}:any) => {
    const [selectedCaseImageURL, setCaseImageURL] = useState(casetoEdit.caseImageURL);
    const [selectedCategory, setSelectedCategory] = useState(casetoEdit.caseCategory);
    const [recommendedPrice,setRecommend] = useState<number | null>();

    const caseCategory = useRef<HTMLSelectElement>(null);
    const caseImage = useRef<HTMLInputElement>(null);
    const casePrice = useRef<HTMLInputElement>(null);
    const caseIndex = useRef<HTMLInputElement>(null);
    const caseName = useRef<HTMLInputElement>(null);


    const df_cName = casetoEdit.caseName;
    const df_cPrice = casetoEdit.casePrice;
    const df_cIndex = casetoEdit.caseIndex;


    const handleAddGift = () => {
        console.log("to be filled");
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
        console.log("is evertthing reaey?", CaseConfigs);

    }

    return ( 
<>
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
{/*             {
                gifts.addedgifts.map((g,i)=>
                <Gift_holder key={i} 
                    setProblems={setProblems}
                    setGifts={setGifts} 
                    gifts={gifts} 
                    giftId={g.giftId}
                />
                )
            } */}
            <div className={s.actions}>
                <div className={s.actions_double}>
                    <p>Recommended Price</p>
                    <p>Case Price</p>
                </div>
                <div className={s.actions_double}>
                    <p style={{top:"-10px"}}>$ {recommendedPrice && recommendedPrice}</p>   
                    <input type="text" placeholder="Enter price..." ref={casePrice} />
                </div>
                <div className={s.actions_double}>
                    <button onClick={handleEditCase}>CREATE CASE</button>
                </div>
            </div>
        </div>
        </div>
    }
</>
     );
}
 
export default CaseEditor;