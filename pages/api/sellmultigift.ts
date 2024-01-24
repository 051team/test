// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Selling Multiple Gift....");

  const {gifts,user} = JSON.parse(req.body);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    gifts.forEach((gf:any) => {
        if(gf.isSold){
            gf.isSold = false
          }
    });

    const totalEarning = gifts.reduce((accumulator:any, currentItem:any) => {
        return accumulator + parseFloat(currentItem.giftPrice)}, 0);

    let allOkay = true;

    for (const gift of gifts) {
        const inventoryUpdateResult = await users.updateOne(
            {
                cdpUserDID: user.id,
                inventory: gift,
            },
            {
                $set: { "inventory.$.isSold": true }
            }
        );
        if (inventoryUpdateResult.matchedCount === 0 || inventoryUpdateResult.modifiedCount === 0) {
            allOkay = false;
            break;
        }
    }
    if(allOkay){
        const resultUpdateBalance = await users.updateOne(
            { cdpUserDID: user.id },
            { $inc: { balance: totalEarning } }
        );
        if (resultUpdateBalance.matchedCount === 0 || resultUpdateBalance.modifiedCount === 0) {
            allOkay = false;
        }
        if(allOkay){
            res.status(200).json({message:"Inventory and balance updated for multiple sale"})
        }else{
            res.status(500).json({message:"Inventory update or balance update failed."})
        }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to sell multiple gifts',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
