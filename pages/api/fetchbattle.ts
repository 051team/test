// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import { redclient } from '../../utils/redis';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("fetchbattle.ts");

  const stamp = req.query.st;
  console.log(stamp, typeof stamp);

  if(!redclient.isOpen){
    await redclient.connect();
  }
  const battleData = await redclient.hGetAll(stamp as string);
  const battleJson = await redclient.hGet(stamp as string, 'battle');
  const battle = JSON.parse(battleData.battle);
  const contestants = JSON.parse(battleData.contestants);

  let client;

  try {
/*     const t1= new Date().getTime();
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_battles = cdp_data_base.collection('cdp_battles');
    const battle =  await cdp_battles.findOne({stamp:parseInt(stamp as string)});
    const t2= new Date().getTime();
    console.log("mongodb: ",(t2-t1)/1000); */

    res.status(200).json({battle:battle, contestants:contestants});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Battle not found!" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
