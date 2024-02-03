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
    console.log(new Date().getTime()+i);
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
            contestantWons:drawingResults
        }
    )
  });

  console.log(battleResults);

  try {
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
