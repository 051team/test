import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("fetchuserlogs.ts");
  const userId = JSON.parse(req.body).id;
  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    const user = await users.findOne({
      cdpUserDID:{$eq:userId}
    });
    if(user){
        const logs:any = new Object();
        logs.joinedAt = user.joinedAt;
        logs.coupons_used = user.coupons_used;
        //logs.inventory = user.inventory.map((e:any)=>{giftName: e.giftName; addTime:e.addTime})
        logs.inventory = user.inventory.map((e: any) => ({ giftName: e.giftName, addTime: e.addTime, isSold:e.isSold ?? false }));
        logs.inventory = logs.inventory.sort((a:any,b:any)=>a.isSold - b.isSold)
        res.status(200).json(logs);
    }else{
        res.status(404).json({ message: 'Failed to create logs S111',color:"red" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create logs S222',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
