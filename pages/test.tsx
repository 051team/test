import { useState,useEffect } from "react";

const Test = () => {
    const [gift,setGift] = useState<any>();
    const [ES,setES] = useState<EventSource>();

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
        setES(eventSource);
        eventSource.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            setGift(eventData);
        };
        return () => {
          eventSource.close();
        };
      }, []);




    return ( 
        <div style={{width:"100vw", height:"100vh", display:"grid", justifyContent:"center",alignItems:"center", border:"3px solid red"}}>
            <h1>{gift && gift.giftName}</h1>
            <button onClick={()=>ES?.close()}>Close</button>
        </div>
     );
}
 
export default Test;