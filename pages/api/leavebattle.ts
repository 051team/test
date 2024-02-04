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

  const {user, battle} = JSON.parse(req.body);
  const battleID = battle.toString();
  const userToLeave = user.id;

  try {
    if(!redclient.isOpen){
      await redclient.connect();
    }
    const curContestants = await redclient.hGet(battleID, 'contestants');
    const currentContestants = JSON.parse(curContestants as string);
    console.log(curContestants);
    const remainingContestants = currentContestants.filter((cnt:any)=>cnt.id !== userToLeave);
    console.log(remainingContestants);

    if(remainingContestants.length > 0){
      try {
        const response = await pusher.trigger("arena", "player-quit", {wholeft:userToLeave});
        res.status(200).json({message:"Player left the battle"});
      } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to pump player who left the battle"});
      }
    }else{
      const response = await pusher.trigger("arena", "player-quit", {wholeft:null});
      res.status(200).json({message:"No contestant left in the battle"});
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
