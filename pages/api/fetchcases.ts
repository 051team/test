// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Fetch CASES Endpoint accessed");
  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const allCases = await cases.find().toArray();
    console.log(allCases);
    res.status(200).json({data:allCases});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch CASES',color:"red" })
  }
}
