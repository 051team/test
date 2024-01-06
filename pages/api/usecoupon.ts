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

    let useAgain:boolean = false;


    const existingActiveCoupon = await coupons.findOne({couponName: coupon_to_USE, disabled:false});  

    //const couponCanbeUsed = existingActiveCoupon && 

    //console.log(existingActiveCoupon);

    if(existingActiveCoupon){
      //if active coupon exists, check if it was used by the user before
      const coupon_used_before = await cdp_users.findOne(
        {
            cdpUser: user,
            'coupons_used.coupon': coupon_to_USE
        },
        {
            projection: {
              '_id':0,
                'coupons_used.$': 1
            }
        }
      );
        
      // if coupon was used before by the user, check if it can be used again comparing couponPerUser
      if(coupon_used_before){
        const xTimesUsed = coupon_used_before.coupons_used[0].usedxTimes;
        useAgain = xTimesUsed < existingActiveCoupon?.couponPerUser;
      }else{
        // first use by for the coupon by the user --> also add the object to coupons used and update balance
        console.log("first use fired");
        const resultCouponUpdated = await coupons.updateOne(
          { couponName: coupon_to_USE, disabled:false },
          [
            {
              $addFields: {
                disabled: { $eq: ["$couponQuantity", { $add: ["$usedXtimes", 1]}] },
                usedXtimes: { $add: ["$usedXtimes", 1] },
              },
            },
          ],
        );
        if(resultCouponUpdated.matchedCount === 1 && resultCouponUpdated.modifiedCount === 1){
          const resultUserUpdated = await cdp_users.updateOne(
            {
                cdpUser: user
            },
            {
                $inc: {
                    balance: existingActiveCoupon.couponValue
                },
                $addToSet: {
                    coupons_used: {
                        coupon: coupon_to_USE,
                        usedxTimes: 1
                    }
                },
            }
          );
          if(resultUserUpdated.matchedCount === 1 && resultUserUpdated.matchedCount === 1){
            console.log("Coupon updated");
            console.log("User balance updated");
            res.status(200).json({message:"Congrats! Balance updated!",color:"green"})
          }else{
              console.log("Failed to update User Blance");
              res.status(500).json({ message: 'Failed to use coupon 11111',color:"red" })
            }
        }else{
          console.log("Failed to update Coupon");
          res.status(500).json({ message: 'Failed to use coupon 22222',color:"red" })
        }
      }
      if(useAgain && coupon_used_before){
        const resultCouponUpdated = await coupons.updateOne(
          { couponName: coupon_to_USE, disabled:false },
          [
            {
              $addFields: {
                disabled: { $eq: ["$couponQuantity", { $add: ["$usedXtimes", 1]}] },
                usedXtimes: { $add: ["$usedXtimes", 1] },
              },
            },
          ],
        );
        
      if(resultCouponUpdated.matchedCount === 1 && resultCouponUpdated.matchedCount === 1){
          console.log("Coupon Updated successfully");

          // NOW CAN UPDATE USER BALANCE && Coupons used property
          const resultUserUpdated = await cdp_users.updateOne(
            {
                cdpUser: user,
                'coupons_used.coupon': coupon_to_USE
            },
            {
                $inc: {
                    balance: existingActiveCoupon.couponValue,
                    'coupons_used.$.usedxTimes': 1
                }
            }
          );
        
          //console.log(resultUserUpdated);

          if(resultUserUpdated.matchedCount === 1 && resultUserUpdated.matchedCount === 1){
              console.log("Coupon updated");
              console.log("User balance updated");
              res.status(200).json({message:"Congrats! Balance updated!",color:"green"})
          }else{
              console.log("Failed to update User Blance");
              res.status(500).json({ message: 'Failed to use coupon 33333',color:"red" })
            }


      }else{
          console.log("Failed to update Coupon");
          res.status(500).json({ message: 'Failed to use coupon 44444',color:"red" })
      }
      }else{
        console.log("Coupon quota is full for the user");
        res.status(405).json({ message: 'Coupon quota is full for the user',color:"red" })
      }

    }else{
        //COUPON NOT FOUND or EXPIRED
        console.log("Coupon not FOUND");
        res.status(404).json({ message: 'Expired or Invalid coupon',color:"red" });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete coupon',color:"red" })
    }
}
