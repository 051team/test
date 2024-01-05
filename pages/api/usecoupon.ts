// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Expire Coupon Endpoint accessed");
  const coupon_to_USE = req.body;
  console.log("to updated",coupon_to_USE);

  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.updateOne(
        { couponName: coupon_to_USE, disabled:false },
        [
          {
            $addFields: {
              disabled: { $eq: ["$couponQuantity", { $add: ["$usedXtimes", 1]}] },
              usedXtimes: { $add: ["$usedXtimes", 1] }
            }
          }
        ]
    );
      
    if(result.matchedCount === 1 && result.matchedCount === 1){
        console.log("Güncellendi");
        console.log(result);
    }else{
        console.log("Güncelleme yok")
    }
    
    res.status(200).json({ message: 'Found coupon to update',color:"green" })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }
}
