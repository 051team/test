import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client;
  console.log("livedrops.ts");


  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');
    const lastDrops = await livedrop.find()
                                .sort({ dropTime: -1 })
                                .limit(30)            
                                .toArray();
    res.status(200).json(lastDrops);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't get live drops " })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
