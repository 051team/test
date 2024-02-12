// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';
import { ensureConnected, redclient } from '../../utils/redis';
import { mockLotteryDraw } from '../../tools';
import { ObjectId } from 'mongodb';

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

  await ensureConnected();

  const lockKey = `lock:${contestantID}`;
  const lockAcquired = await redclient.set(lockKey, 'locked', {
    EX: 5,
    NX: true
  });

  if (!lockAcquired) {
    return res.status(429).json({ message: "Operation already in progress for this user.", color: "red" });
  }

  try {
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_users = cdp_data_base.collection('cdp_users');
    const cdp_battles = cdp_data_base.collection('cdp_battles');
  
    
    const existingUser = await cdp_users.findOne({ cdpUserDID: contestantID });
    const battleData = await redclient.hGetAll(battleID.toString());

    const existingBattle = JSON.parse(battleData.battle);
    const contestants = JSON.parse(battleData.contestants);




    if(existingUser && existingBattle){
      const nospace = existingBattle.playernumber === contestants.length;
      if(nospace){
        return res.status(401).json({message:"No available slot", color:"red"});
      }

      const balanceEnough = existingUser.balance >= existingBattle.battleCost;
      console.log("is balance enough to join battle?", balanceEnough);
      if(!balanceEnough){
        return res.status(401).json({message:"Insufficient balance", color:"red"})
      }
      const {cdpUser,cdpUserDID, ...rest } = existingUser;
      contestants.push({name:cdpUser,id:cdpUserDID,image:contestantIMG})
      const updatedContestantsJson = JSON.stringify(contestants);
      const result = await redclient.hSet(battleID.toString(), 'contestants', updatedContestantsJson);

      const arenaFull = existingBattle.playernumber === contestants.length;
      console.log("doldu mu?",arenaFull);

      const contestantUpdated = await cdp_users.updateOne({cdpUserDID:contestantID},{
        $inc:{balance:-existingBattle.battleCost},
      });

      // battle full serve the most recent contestant via socket
      // also execute battle drawing and serve battleresults
      if(arenaFull){
        const battleInfo = existingBattle;
        const battleResults:any = [];
        const cdp_cases = cdp_data_base.collection('cdp_cases');
        const casesInBattle = await cdp_cases.find({
          _id: { $in: existingBattle.casesinbattle.map((id:string) => new ObjectId(id)) }
        }).toArray();

        contestants.forEach((cnt:any,i:number) =>{
          const contestantID = cnt.id;
          const drawingResults:any = [];
          casesInBattle.forEach((cse:any,ind:any) => {
              const round = ind+1;
              const won = mockLotteryDraw(cse.caseGifts);
              drawingResults.push({round:round, won:won});
          });
          battleResults.push(
              {
                  contestantID:contestantID,
                  contestantWons:drawingResults,
                  totalWonGiftPrices: drawingResults.reduce((total: any, current: any) => total + parseFloat(current.won.giftPrice), 0)
              }
          );
        });
      
        const winner = battleResults.reduce((max: any, current: any) => current.totalWonGiftPrices > max.totalWonGiftPrices ? current : max, battleResults[0]);
        const addTime = (new Date()).getTime();
        const allWon = battleResults.map((battle:any,i1:number) => battle.contestantWons.map((wonEntry:any,i2:number) => ({...wonEntry.won}))).flat();
        const allWonWithStamp = allWon.map((w:any,i:number)=>({...w, addTime:addTime+i}));
        const turnover = allWon.reduce((tot:any,item:any)=>{return tot+parseFloat(item.giftPrice)},0);
        console.log(turnover);
        try {
          // add all won gifts to winner inventory
          const updatedWinnerInventory = await cdp_users.updateOne({cdpUserDID:winner.contestantID},{
            $push:{inventory:{$each:allWonWithStamp}},
          });
      
          console.log(updatedWinnerInventory);
          const newContestant = await pusher.trigger("arena", battleID.toString(), {newContestant:{name:cdpUser,id:cdpUserDID,image:contestantIMG}});
          const battleResult = await pusher.trigger("arena", `result${existingBattle.code}`, {battleResults:battleResults,winner:winner,turnover:turnover});
      
          res.status(200).json({ message: 'Battled ended', battleResults:battleResults });
      
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'battle-result.ts failed to end battle,  S2222', color: "red" });
        }

      }else{
        try {
          // update new contestant balance deducting battle cost from the balance
          const contestantUpdated = await cdp_users.updateOne({cdpUserDID:contestantID},{
            $inc:{balance:-existingBattle.battleCost},
          });
          const response = await pusher.trigger("arena", battleID.toString(), {newContestant:{name:cdpUser,id:cdpUserDID,image:contestantIMG}});
          res.status(200).json({message:"Arena endpoint working"});
        } catch (error) {
          console.log(error);
          res.status(500).json({message:"Failed to serve new contestant S3333"});
        }
      }
    }else{
      res.status(500).json({ message: 'arena.ts, user not found or insufficient balance, 4444', color: "red" });
    }

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'arena.ts, catch bloc 5555', color: "red" });
  }
  finally{
  }
}
