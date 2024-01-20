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

    const drops = await livedrop.find().toArray();
    const readytoSend = drops.sort((a:any,b:any)=> b.dropTime - a.dropTime).slice(0,20);
    res.status(200).json(readytoSend);

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
