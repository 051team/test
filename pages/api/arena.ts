// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';

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

/*   const originHeader = req.headers['initial-battle-creation'];
  if(originHeader){
    console.log("From create-battle.ts");
    const load = req.body;
    const newBattle = {
      contestants:[load.boss],
      battle:load.battle,
      battleStarted:false,
    }
    inArena.push(newBattle);
    res.end();
    return
  } */

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
    const existingBattle = await cdp_battles.findOne({ stamp: battleID });

/*     const battleinArena = inArena.find((battle:any)=>battle.battle.stamp === battleID);
    if(battleinArena && !battleinArena.battleStarted){
      console.log(battleinArena.battle.playernumber,battleinArena.contestants.length);
      const slotAvailable = battleinArena.battle.playernumber > battleinArena.contestants.length;
      if(slotAvailable){
        battleinArena.contestants.push(contestantID);
        const slotAvailable = battleinArena.battle.playernumber > battleinArena.contestants.length;
        if(!slotAvailable){
          battleinArena.battleStarted = true
        }
      }
      console.log("Contestants in battle",battleinArena.contestants.length);
      console.log("isBattleStarted?", battleinArena.battleStarted);
    } */




    if(existingUser && existingBattle){
      const balanceEnough = existingUser.balance >= existingBattle.battleCost;
      const {cdpUser, ...rest } = existingUser;
      //console.log(cdpUser,contestantIMG);
      //console.log("Balance enough?", balanceEnough, existingUser.balance, existingBattle.battleCost);
      const response = await pusher.trigger("arena", "arena-event", {newContestant:{name:cdpUser,image:contestantIMG}});
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
  }
}
