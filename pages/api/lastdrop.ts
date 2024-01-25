// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client;
  console.log("Last drop endpoint accessed")
  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');
    const totalCount = data_base.collection('totalOpenedCaseNumber');

    const randomDrop = await livedrop.aggregate([
      { $sample: { size: 1 } },
      { $project: { _id: 0 } }
      ]).toArray();
      if(randomDrop){
      const dropTime = (new Date()).getTime();
      //const resultDrop = await livedrop.insertOne({...randomDrop[0],dropTime:dropTime,isF:true});
      //const resultCount = await totalCount.updateOne({duty:"keepcount"},{$inc:{totalNumber:1}});
      res.status(200).json({lastDrop:randomDrop[0]});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't get last drop item" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
