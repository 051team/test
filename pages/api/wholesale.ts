// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let client;

  const {user} = JSON.parse(req.body);

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    const existingUser = await users.findOne(
        {            
            cdpUser:{$eq:user.name},
            cdpEmail:{$eq:user.email}
        })
    if(existingUser && existingUser.inventory){
        const inventory = existingUser.inventory;
        let totalRevenuefromsale = 0;
        inventory.forEach((item: any) => {
            if (!item.isSold) {
                totalRevenuefromsale += parseFloat(item.giftPrice);
            }
          });        
        console.log("Total amount to be added to the balance: ",totalRevenuefromsale);
        const resulWholeSale = await users.updateOne(
            {
              cdpUser: { $eq: user.name },
              cdpEmail: { $eq: user.email }
            },
            {
              $set: {
                "inventory.$[item].isSold": true
              },
              $inc: {balance:totalRevenuefromsale}
            },
            {
              arrayFilters: [
                { "item.isSold": { $ne: true } }
              ]
            }
        );
        console.log(resulWholeSale);
        if(resulWholeSale.matchedCount === 1 && resulWholeSale.matchedCount === 1){
            res.status(200).json({message:"Sold all items!", color:"green"})
        }else{
            res.status(500).json({ message: 'Wholesale failed',color:"red" });
        }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Wholesale failed',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
