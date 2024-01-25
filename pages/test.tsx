import { useState,useEffect } from "react";

const Test = () => {
    const [gift,setGift] = useState<any>();

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
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
        </div>
     );
}
 
export default Test;