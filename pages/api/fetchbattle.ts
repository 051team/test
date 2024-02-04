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
  const battle = JSON.parse(battleData.battle);
  const contestants = JSON.parse(battleData.contestants);

  try {
    res.status(200).json({battle:battle, contestants:contestants});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Battle not found!" })
  }
  finally{
    await redclient.disconnect();
  }
}
