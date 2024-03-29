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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let client;

  const itemtoAddtoLivedrop = JSON.parse(req.body);
  console.log("addtolivedrop.ts");

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');
    const dropTime = (new Date()).getTime();
    
    const totalCount = data_base.collection('totalOpenedCaseNumber');
    const resultCount = await totalCount.updateOne({duty:"keepcount"},{$inc:{totalNumber:1}});

    if (Array.isArray(itemtoAddtoLivedrop)) {
        // Process each item to add the dropTime
        const itemsWithDropTime = itemtoAddtoLivedrop.map(item => ({ ...item, dropTime: dropTime }));
        const result = await livedrop.insertMany(itemsWithDropTime);
        const response = await pusher.trigger("drop", "drop-event", {
          itemtoAddtoLivedrop
        });
        res.status(200).json({ result });
    } else {
        // Insert a single item
        const resultDrop = await livedrop.insertOne({...itemtoAddtoLivedrop, dropTime: dropTime});
        const response = await pusher.trigger("drop", "drop-event", {
          itemtoAddtoLivedrop
        });
        res.status(200).json({ resultDrop });
    }

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to add to livedrop', color: "red" });
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
