import Pusher from 'pusher';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true
  });

export default async function handler(
req: NextApiRequest,
res: NextApiResponse
) {
    const currentTime = new Date().toLocaleTimeString();
    const response = await pusher.trigger("chat", "chat-event", {
        currentTime,
    });
  
    res.json({ time: currentTime });
}

