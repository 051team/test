// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("fetchbattle.ts");

  const stamp = req.query.st;
  console.log(stamp);

  let client;

  try {
    client = await connectToDatabase();
    const cdp_data_base = client.db('casadepapel');
    const cdp_battles = cdp_data_base.collection('cdp_battles');

    const battle =  await cdp_battles.findOne({stamp:parseInt(stamp as string)});
    console.log(battle);

    res.status(200).json({battle:battle});

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
