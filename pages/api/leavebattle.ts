// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';
import { redclient } from '../../utils/redis';

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
    
  let client;
  console.log("leavebattle.ts");
  console.log(req.query);


  const contestantID = JSON.parse(req.body).user.id;
  const battleID = parseInt(JSON.parse(req.body).battle);
  try {
    await redclient.connect();
    const battleJson = await redclient.hGet(battleID.toString(), 'battle');
    const existingBattle = JSON.parse(battleJson as string);

    if(existingBattle){
      try {
        const response = await pusher.trigger("arena", "player-quit", {wholeft:contestantID});
        console.log(contestantID, "will be removed from live battle arena in all player screens");
        res.status(200).json({message:"Player left the battle"});
      } catch (error) {
        console.log(error);
        res.status(200).json({message:"Failed to pump player who left the battle"});
      }
    }else{
      res.status(500).json({ message: 'arena.ts, user not found or insufficient balance, 2222', color: "red" });
    }

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'arena.ts, catch bloc 2222', color: "red" });
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
    await redclient.disconnect();
  }
}
