// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const totalCount = data_base.collection('totalOpenedCaseNumber');

    const currentCount = await totalCount.findOne({duty:"keepcount"});
    if(currentCount){
      res.status(200).json({totalCasesOpened:currentCount.totalNumber});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't get total number of cases opened " })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
