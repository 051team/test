// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const coupon_to_USE = JSON.parse(req.body).promo;
  const user = JSON.parse(req.body).user;

  console.log("to updated",coupon_to_USE);
  console.log(user);

  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');
    const cdp_users = data_base.collection('cdp_users');


    const existingActiveCoupon = await coupons.findOne({couponName: coupon_to_USE, disabled:false});
    //console.log(existingActiveCoupon);

    if(existingActiveCoupon){
        const resultCouponUpdated = await coupons.updateOne(
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
          
        if(resultCouponUpdated.matchedCount === 1 && resultCouponUpdated.matchedCount === 1){
            console.log("Coupon Updated successfully");

            // NOW CAN UPDATE USER BALANCE
            const resultUserUpdated = await cdp_users.updateOne(
                {cdpUser: user},
                {
                    $inc:{
                        balance: existingActiveCoupon.couponValue
                    },
                 }
            );

            //console.log(resultUserUpdated);

            if(resultUserUpdated.matchedCount === 1 && resultUserUpdated.matchedCount === 1){
                console.log("Coupon updated");
                console.log("User balance updated");
                res.status(200).json({result:"balance updated"})
            }else{
                console.log("Failed to update User Blance");
                res.status(200).json({result:"Failed to updated balance 1111111"})

            }


        }else{
            console.log("Failed to update Coupon");
            res.status(200).json({result:"Failed to updated balance 222222"})

        }
    }else{
        //COUPON NOT FOUND or EXPIRED
        console.log("Coupon not FOUND");
        res.status(500).json({ message: 'Coupon not found',color:"red" })

    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }
}
