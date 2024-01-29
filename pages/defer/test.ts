// the `defer()` helper will be used to define a background function
import { defer } from "@defer/client";
// If in Node.js, uncomment the following line:
// import fetch from 'node-fetch';

async function triggerPump(name: string) {
  const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://casadepapel.vercel.app';
  setInterval(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/pump`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error in fetch request:', error);
    }
  }, 50000);
}

export default defer(triggerPump);
