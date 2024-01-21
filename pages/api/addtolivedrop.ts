// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let client;

  const itemtoAddtoLivedrop = JSON.parse(req.body);

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');
    const dropTime = (new Date()).getTime();
    const resultDrop = await livedrop.insertOne({...itemtoAddtoLivedrop,dropTime:dropTime});
    res.status(200).json({resultDrop});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add to livedrop',color:"red" });
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}