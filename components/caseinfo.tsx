import c from "./../styles/Casepage.module.css";
import Image from "next/image";
import _051 from "./../public/051.jpg";

const CaseInfo = ({caseInfo}:any) => {
    return ( 
    <div id={c.caseDemo} className={ !caseInfo ? c.loading : ""}>
        <span>{(caseInfo && caseInfo.caseName.toUpperCase()) ?? ""}</span>
        {
            caseInfo && <Image src={caseInfo.caseImageURL} alt={"051 logo"} width={200} height={270} priority />
        }
    </div>
     );
}
 
export default CaseInfo;