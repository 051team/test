// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Selling Case....");

  const {gift,user} = JSON.parse(req.body);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');
    if(gift.isSold){
      gift.isSold = false
    }

    const resultSold = await users.updateOne(
        {
            cdpUser:{$eq:user.name},
            cdpEmail:{$eq:user.email},
            inventory: gift,
        },
        {
            $set: { 'inventory.$.isSold': true },
            $inc:{ balance:parseFloat(gift.giftPrice)}     
        }
    )
    if(resultSold.matchedCount === 1 && resultSold.modifiedCount === 1){
        console.log(resultSold)
        res.status(200).json({ message: 'Gift sold! Balance updated',color:"lightgreen"});
    }else{
        console.log("No matched found");
        res.status(500).json({ message: 'Failed to sell the gift',color:"red" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to sell the gift',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
