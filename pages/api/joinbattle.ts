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

const inArena:any = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    
  let client;
  console.log("arena.ts");

  const contestantID = JSON.parse(req.body).user.id;
  const contestantIMG = JSON.parse(req.body).user.image;

  const battleID = parseInt(JSON.parse(req.body).battle);

  console.log(contestantID,typeof contestantID);
  console.log(battleID,typeof battleID);

  try {
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_users = cdp_data_base.collection('cdp_users');
    const cdp_battles = cdp_data_base.collection('cdp_battles');
  
  
    const existingUser = await cdp_users.findOne({ cdpUserDID: contestantID });
    //const existingBattle = await cdp_battles.findOne({ stamp: battleID });

    if(!redclient.isOpen){
      await redclient.connect();
    }
    const battleData = await redclient.hGetAll(battleID.toString());

    const existingBattle = JSON.parse(battleData.battle);
    const contestants = JSON.parse(battleData.contestants);


    if(existingUser && existingBattle){
      const balanceEnough = existingUser.balance >= existingBattle.battleCost;
      const {cdpUser,cdpUserDID, ...rest } = existingUser;
      //console.log(cdpUser,contestantIMG);
      //console.log("Balance enough?", balanceEnough, existingUser.balance, existingBattle.battleCost);

      contestants.push({name:cdpUser,id:cdpUserDID,image:contestantIMG})
      const updatedContestantsJson = JSON.stringify(contestants);
      const result = await redclient.hSet(battleID.toString(), 'contestants', updatedContestantsJson);

      try {
        const response = await pusher.trigger("arena", battleID.toString(), {newContestant:{name:cdpUser,id:cdpUserDID,image:contestantIMG}});
      } catch (error) {
        console.log(error)
      }
      res.status(200).json({message:"Arena endpoint working"});
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
