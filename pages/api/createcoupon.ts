// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Create Coupon Endpoint accessed");
  const coupon = JSON.parse(req.body);
  coupon.usedXtimes = 0;
  coupon.disabled = false;

  let client;
  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.insertOne(coupon);

    if (result.acknowledged && result.insertedId) {
      res.status(200).json({message:"Coupon has successfully been created!",color:"green"});
    } else {
        res.status(200).json({message:"Failed to create coupon",color:"red"});
    }

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
