// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Coupon Delete Endpoint accessed");
  const coupon_to_del = JSON.parse(req.body);
  console.log("to delete",coupon_to_del);

  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.deleteOne({couponName:{$eq:coupon_to_del.couponName}});
    console.log(result);
    if(result.deletedCount === 1){
        res.status(200).json({message:"Coupon has successfully been deleted!",color:"green"});
    }else{
        res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
}
}
