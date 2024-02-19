import u from "../styles/Modal.module.css";
import { useSelector,useDispatch } from "react-redux";
import { useEffect, useState,useRef } from "react";
import { note_universal_modal } from "../redux/loginSlice";

const Universal_modal = ({ children, wid }: { children: React.ReactNode; wid?: number }) => {
    const core = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        const handleOutsideClick = (e:any) => {
            if (!core.current?.contains(e.target) && e.target.tagName !== 'BUTTON') {
                dispatch(note_universal_modal(false));
            }
        }
        window.addEventListener("click", handleOutsideClick);
        return () => {
            window.removeEventListener("click", handleOutsideClick)
        }
    },[]);
    return ( 
        <div className={u.universal}>
                <div className={u.universal_kernel} ref={core} style={{width:wid}}>
                <button id={u.close} onClick={()=>dispatch(note_universal_modal(false))}>❌</button>
                    {children}
                </div>
        </div>
     );
}
 
export default Universal_modal;
