// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

let intervalId:any = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if(!intervalId){
    intervalId = setInterval(async () => {
        let client;
        console.log("pump.ts");
      
        try {
          client = await connectToDatabase();
          const data_base = client.db('casadepapel');
          const livedrop = data_base.collection('livedrop');
      
          const probabilities = [1,1,1,2,2,2,3,3,4,5];
          const randomIndex = Math.floor(Math.random()*probabilities.length);
          const randomQuantity = probabilities[randomIndex];
      
      
          let itemtoAddtoLivedrop = await livedrop.aggregate([
              { $match: { isF: { $ne: true } } },
              { $sample: { size: randomQuantity } }
          ]).toArray();
          
          
            const updatedItems = itemtoAddtoLivedrop.map((element, i) => {
              const { _id, dropTime, ...rest } = element;
              return {
                  ...rest,
                  dropTime: (new Date().getTime()) + i
              };
          });
      
          itemtoAddtoLivedrop = updatedItems;
      
          const resultADD = await livedrop.insertMany(updatedItems);
      
          if (resultADD.acknowledged === true && resultADD.insertedCount !== 0){
              const totalCount = data_base.collection('totalOpenedCaseNumber');
              const resultCount = await totalCount.updateOne({duty:"keepcount"},{$inc:{totalNumber:randomQuantity}});
              const response = await pusher.trigger("drop", "drop-event", {
                  itemtoAddtoLivedrop
              });
              res.status(200).json({ meesage:"New Drop" });
          }else{
              res.status(500).json({ message: 'Pump failed', color: "red" });
          }
          
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Pump failed', color: "red" });
        }
        finally{
          if (client) {
            await closeDatabaseConnection(client);
          }
        }

    }, 5000);
  }
  setTimeout(() => {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Interval cleared');
 }, 40000); 
  res.status(200).json({messgae:"Pumnping started"});
}
