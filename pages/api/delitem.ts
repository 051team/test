// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("delitem.ts");
  const {user,item} = JSON.parse(req.body);

  //isSold property does not exist by default. adding it to all items on the clientside for sorting purposes
  //for a correct match in db, remove it if it is not true
  if(item.isSold === false){
    console.log(item);
    delete item.isSold;
  }

  item.giftPrice = item.giftPrice.toString();

  let client;

  console.log(item)

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    const resultDel = await users.updateOne(
        {      
            cdpUserDID:{$eq:user.cdpUserDID}
        },
        {
           $pull:{
                inventory:{
                    addTime:item.addTime,
                }
            } 
        }
    )
    console.log(resultDel);
    if(resultDel.matchedCount === 1 && resultDel.modifiedCount === 1){
        res.status(200).json({ message: 'Item deleted from user inventory',color:"lightgreen" })
    }else{
        res.status(500).json({ message: 'Failed to delete item from inventory',color:"red" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete item from inventory',color:"red" })
}
  finally{
  if (client) {
    await closeDatabaseConnection(client);
  }
}
}
