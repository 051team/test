import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';
import { mockLotteryDraw } from '../../tools';

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
  console.log("battle-result.ts");

  const load = JSON.parse(req.body);
  const battleInfo = load.battleInfo;
  const contestants = load.contestants;
  const casesInBattle = load.casesInBattle;

  const battleResults:any = [];
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
    client = await connectToDatabase();
    const database = client.db('casadepapel');
    const cdp_users = database.collection('cdp_users');
    const updatedWinnerInventory = await cdp_users.updateOne({cdpUserDID:winner.contestantID},{
      $push:{inventory:{$each:allWonWithStamp}},
      $inc:{balance:turnover}
    });

    console.log(updatedWinnerInventory)

    res.status(200).json({ message: 'Battled ended', battleResults:battleResults });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'battle-result.ts failed to end battle,  2222', color: "red" });
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
