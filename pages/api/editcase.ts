import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("editcase.ts");  
  const caseInfo = JSON.parse(req.body);

  console.log(caseInfo.id);

  let client;
  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const updatedCASE = await cases.findOneAndUpdate(
        { _id: new ObjectId(caseInfo.id) },
        { $set: caseInfo.caseInfo },
        { returnDocument: 'after' }
    );

    console.log(updatedCASE);

    res.status(200).json({ feedback:{message: 'Case EDITED',color:"lawngreen"}, newCase:updatedCASE })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to EDIT CASEE',color:"red" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
