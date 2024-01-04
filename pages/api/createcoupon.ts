// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Create Coupon Endpoint accessed");
  const coupon = JSON.parse(req.body);
  try {
    const client = await connectToDatabase();
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
}
