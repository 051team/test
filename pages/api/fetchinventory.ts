import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = JSON.parse(req.body).id;
  const {active} = req.query;
  let client;

  console.log('fetchuserinventory.ts');

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    // only active items from invnetory for panel page
    if(active){
      const userWithFilteredInventory = await users.aggregate([
        {
          $match: {
            cdpUserDID: userId
          }
        },
        {
          $project: {
            inventory: {
              $filter: {
                input: "$inventory",
                as: "item",
                cond: { $ne: ["$$item.isSold", true] }
              }
            }
          }
        }
      ]).toArray();
      if(userWithFilteredInventory){
        const inventory = userWithFilteredInventory[0].inventory ?? [];
        res.status(200).json(inventory);
        return
      } else{
        res.status(404).json({ message: 'Failed to fetch inventory',color:"red" });
        return
      }     
    }

    // for profile page, send whole inventory
    const user = await users.findOne({
      cdpUserDID:{$eq:userId}
    });

    if(user){
        const inventory = user.inventory ?? [];
        res.status(200).json(inventory);
    }else{
        res.status(404).json({ message: 'Failed to fetch inventory',color:"red" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch inventory',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
