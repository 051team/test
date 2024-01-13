// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Selling Case....");

  const {name,email} = req.query;

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    const user = await users.findOne(
        {
            cdpUser:{$eq:name},
            cdpEmail:{$eq:email},
        }
    )
    if(user){
        const inventory = user.inventory ?? [];
        res.status(200).json(inventory);
    }else{
        res.status(404).json({ message: 'Failed to fetch inventory',color:"red" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch inventory',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
