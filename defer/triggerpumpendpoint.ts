// the `defer()` helper will be used to define a background function
import { defer } from "@defer/client";

// a background function must be `async`
async function triggerPump() {
  const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://casadepapel.vercel.app';
    try {
      const response = await fetch(`${baseUrl}/api/pump`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error in fetch request:', error);
    }
}

export default defer.cron(triggerPump, "*/1 * * * *");
