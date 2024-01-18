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
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.find().toArray();
    console.log(result);
    res.status(200).json({data:result});

  } catch (error) {
    console.log(error);
    res.status(500).json({ name: 'New User' })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
