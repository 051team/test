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
    if(drops){
        const randomIndex = Math.floor(Math.random()*drops.length);
        const lastDrop = drops[randomIndex];
        console.log(lastDrop);
    }
    res.status(200).json({message:"last drop route"});

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
