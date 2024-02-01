// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  console.log("Create CASE Endpoint accessed");
  let client:any;

  const caseInfo = JSON.parse(req.body);
  console.log(caseInfo);

  try {
    client = await connectToDatabase();
    const database = client.db('casadepapel');
    const cases = database.collection('cdp_cases');
    try {
      const result = await cases.insertOne(caseInfo);
      await closeDatabaseConnection(client);
      console.log(result);
      if(result.acknowledged){
        res.status(201).json({ message: 'Case has successfully been created!', color:"green" });
      }else{
        res.status(500).json({ message: 'Failed to create case', color:"red" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create case', color:"red" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create case', color:"red" });
  }  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
