import Image from "next/image";
import Wrapper from "../components/wrapper";
import w from "../styles/Wrapper1.module.css";

const _051 = () => {
    return ( 
        <Wrapper title={"Copyright"}>
            <div className={w.contract}>
                <div className={w.contract_kernel}>
                    <div className={w.contract_kernel_title}>
                        <Image src={"/rubic.png"} width={50} height={50} alt={"Rubic"} />
                        <h2>AFFILIATE PROGRAM</h2>
                    </div>
                    <p>If you're a creator cooking something cool with NFTs on Solana.We want to cooperate with you!</p>
                    
                    <h3>X Twitter</h3>
                   <p>The minimum number of followers for a potential collaboration via a X profile should be a minimum of 3000 followers and 100 react under each tweet.</p>
                    
                    <h3>Youtube - Twitch</h3>
                   <p> In case of cooperation via Youtube, Twitch or any other platform, the channel must have a minimum of 500 subscriptions and 250 views under each video. </p>

                   <p> Every request for cooperation is being dealt with as an individual case or code. Collaboration also mainly depends on your activity on your channels and what content you share. Meeting all the conditions does not necessarily mean that we will cooperate with you. </p> 

                   <p> If your channel or profile meets the above requirements or if you have additional questions, you can open a ticket in discord under the creator-request category. </p>

                    <h3>Benefits</h3>
                    <ul>
                        <li>Affiliate Revenue.</li>
                        <li>10% deposit bonus for Creator deposit code.</li>
                        <li>Major Creators are eligible to receive 5% revenue share of the earnings generated from their Creator Case.</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
     );
}
 
export default _051;
