// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Expire Coupon Endpoint accessed");
  const coupon_to_update = JSON.parse(req.body);
  console.log("to updated",coupon_to_update);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.updateOne(
        {
        couponName:coupon_to_update.couponName
        },
        {
            $set:{
                disabled:true
            }
        }
    );

    console.log(result);

    if(result.matchedCount === 1 && result.modifiedCount === 1){
        res.status(200).json({message:"Coupon has successfully been expired...",color:"green"});
    }else{
        res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }
    finally{
      if (client) {
        await closeDatabaseConnection(client);
      }
    }
}
