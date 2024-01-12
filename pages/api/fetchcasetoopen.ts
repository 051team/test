// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Case to Open Endpoint accessed");

  const { cat, name } = req.query;
  console.log(cat,name);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const caseToOpen = await cases.findOne({caseCategory:{$eq:cat},caseName:{$eq:name}});
    if(caseToOpen){
        res.status(200).json({data:caseToOpen});
    }else{
        res.status(404).json({ message: 'Case not found!',color:"red" })
    }


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
