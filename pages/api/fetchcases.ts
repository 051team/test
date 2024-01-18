// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //console.log("Fetch CASES Endpoint accessed");
  let client;
  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const allCases = await cases.find().toArray();
    res.status(200).json({data:allCases});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch CASES',color:"red" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
