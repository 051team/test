// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');

    const randomDrop = await livedrop.aggregate([{ $sample: { size: 1 } }]).toArray();
    if(randomDrop){
      res.status(200).json({lastDrop:randomDrop[0]});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't get last drop item" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
