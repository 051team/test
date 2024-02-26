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
                        <h2>PROBABLY FAIR ALGORITHM</h2>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus quisquam aut dignissimos enim. Facilis repudiandae sint autem dolores eaque cupiditate, alias obcaecati commodi. Repellat laborum dolore sit veniam? Voluptate, dignissimos.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe distinctio excepturi placeat ullam nemo sint aspernatur temporibus modi quia officia assumenda pariatur deleniti molestiae minima earum, similique quam ex perferendis.</p>
                    <ul>
                        <li>Dummy Item 1</li>
                        <li>Dummy Item 2</li>
                        <li>Dummy Item 3</li>
                    </ul>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae expedita dolor dicta, provident necessitatibus numquam excepturi explicabo non autem libero doloremque veniam, magni in minus quia porro possimus officia? Accusamus.</p>
                </div>
            </div>
        </Wrapper>
     );
}
 
export default _051;