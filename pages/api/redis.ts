import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import { redclient } from '../../utils/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let client;
  console.log("redis.ts");


  try {
    const t1 = new Date().getTime();
    const battleID = new Date().getTime().toString();
    await redclient.hSet(battleID,{players:2,contestants:"john"});
    res.status(200).send("OK");
    const t2 = new Date().getTime();
    console.log((t2-t1)/1000); 

/*     const t1 = new Date().getTime();
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_cases = cdp_data_base.collection('cdp_cases')
    const cdp_battles = cdp_data_base.collection('cdp_battles');
    const resultBattleAdded = await cdp_battles.insertOne({batleID:34385});
    res.status(200).send("OK");
    const t2 = new Date().getTime();
    console.log((t2-t1)/1000); */

  } catch (error) {
    console.log(error);
    res.status(500).send("NOT ok");
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
