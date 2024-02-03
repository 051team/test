import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("createbattle.ts");
  const {casesinBattle, battleConfig, boss} = JSON.parse(req.body);

  const baseUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://casadepapel.vercel.app';

  const battle:any = {
    boss:boss.id,
    playernumber:parseInt(battleConfig.players),
    withbots:battleConfig.withbots,
    crazymode:battleConfig.crazymode,
    casesinbattle:casesinBattle.map((e:any)=>{return e._id}),
  }

  let client;
  try {
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_cases = cdp_data_base.collection('cdp_cases')
    const cdp_battles = cdp_data_base.collection('cdp_battles');

    const casesForPriceCalc = await cdp_cases.find({
        _id: { $in: battle.casesinbattle.map((id:string) => new ObjectId(id)) }
    }).toArray();
    const battleCost = casesForPriceCalc.reduce((total,val)=> total+val.casePrice,0);
    battle.battleCost = battleCost;
    battle.stamp = new Date().getTime();
    //console.log(battle);

    const resultBattleAdded = await cdp_battles.insertOne(battle);
    if(resultBattleAdded.acknowledged){
        res.status(200).json({ stamp:battle.stamp })
    }else{
        res.status(500).json({ message: 'Failed to create BATTLE S1111', color:"red" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create BATTLE S2222', color:"red" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
