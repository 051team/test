import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("delcase.ts");
  const caseToDEL_ID:string = req.body;
  
  let client;
  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const resultDEL = await cases.deleteOne({_id: new ObjectId(caseToDEL_ID)});
    if(resultDEL.deletedCount > 0){
        console.log(resultDEL);
        res.status(200).json({message:"CASE DELETED"});
    }else{
        res.status(500).json({ message: 'Failed to delete CASE',color:"red" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete CASE',color:"red" })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
