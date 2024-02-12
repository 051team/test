// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';
import { ensureConnected, redclient } from '../../utils/redis';

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
  
  const lockKey = `lock:${userToLeave}`;
  const lockAcquired = await redclient.set(lockKey, 'locked', {
    EX: 5,
    NX: true
  });

  if (!lockAcquired) {
    return res.status(429).json({ message: "Operation already in progress for this user.", color: "red" });
  }

  try {
    await ensureConnected();
    const curContestants = await redclient.hGet(battleID, 'contestants');
    const currentContestants = JSON.parse(curContestants as string);
    console.log(curContestants?.includes(userToLeave),userToLeave);
    const userIsInBattle = curContestants?.includes(userToLeave);
    if(!userIsInBattle){
      return res.status(404).json({message:"User not in the battle..."});
    }

    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_users = cdp_data_base.collection('cdp_users');

    const battleInfo = await redclient.hGet(battleID, 'battle');
    const battleCost = JSON.parse(battleInfo as string).battleCost;

    console.log("battle cost to add back to blanace", battleCost, typeof battleCost);

    const userUpdated = await cdp_users.updateOne({ cdpUserDID: { $eq: userToLeave } },{
      $inc:{balance:battleCost}
    });

    const remainingContestants = currentContestants.filter((cnt:any)=>cnt.id !== userToLeave);
    console.log(remainingContestants);

    if(remainingContestants.length > 0){
      try {
        const response = await pusher.trigger("arena", `player-quit${battleID}`, {wholeft:userToLeave});
        res.status(200).json({message:"Player left the battle"});
      } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to pump player who left the battle"});
      }
    }else{
      const resultDelBattle = await redclient.del(battleID);
      console.log("is battle Deleted?",resultDelBattle);
      const response = await pusher.trigger("arena", `player-quit${battleID}`, {wholeft:null});
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
