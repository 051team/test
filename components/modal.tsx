import m from "../styles/Modal.module.css";

const Modal = ({modalOpen,feedback}:any) => {
    return ( 
        <>
        {
            modalOpen &&
            <div className={m.panel_modal}>
                <div className={m.panel_modal_kernel}>
                    <span className={m.loader}></span>
                    <h2 style={{color:feedback?.color ? feedback.color : "gray"}}>{feedback && feedback.message}</h2>
                </div>
            </div>
        }
        </>
     );
}
 
export default Modal;