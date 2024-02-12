import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import { ensureConnected, redclient } from '../../utils/redis';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("createbattle.ts");
  const {casesinBattle, battleConfig, boss, code} = JSON.parse(req.body);

  console.log("BATTLE CODE: ",code);

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

  await ensureConnected();

  const lockKey = `lock:${boss.id}`;
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
    const cdp_cases = cdp_data_base.collection('cdp_cases');
    const cdp_users = cdp_data_base.collection('cdp_users');

    //calculate battle cost
    const casesForPriceCalc = await cdp_cases.find({
        _id: { $in: battle.casesinbattle.map((id:string) => new ObjectId(id)) }
    }).toArray();
    const battleCost:number = casesForPriceCalc.reduce((total,val)=> total+val.casePrice,0);
    battle.battleCost = battleCost;
    battle.code = code;

    // get user who created the battle and update his balance
    const battleMaker = await cdp_users.findOne(
      { cdpUserDID: { $eq: boss.id } },
      { projection: { inventory: 0 } }
    );
    
    // if no valid user, return
    if(!battleMaker){
      res.status(500).json({ message: 'Not allowed to create battle S1111', color:"red" })
      return
    }

    // check is balance enough for existing user
    const makerBalance:number = battleMaker.balance;
    const balanceEnough:boolean = makerBalance >= battleCost;

    if(!balanceEnough){
      res.status(500).json({ message: 'Not sufficient balance to create battle S2222', color:"red" });
      return
    }

    await ensureConnected();
    const resultBattleAdded = await redclient.hSet(code,{battle:JSON.stringify(battle),contestants:JSON.stringify([boss])});

    if(resultBattleAdded){
        const userUpdated = await cdp_users.updateOne({ cdpUserDID: { $eq: boss.id } },{
          $inc:{balance:-battleCost}
        });
        res.status(200).json({ code:battle.code });
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
    await redclient.disconnect();
  }
}
