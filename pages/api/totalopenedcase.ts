import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, closeDatabaseConnection } from "./mdb";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    //console.log("Total Open Case");
    let client;
    try {
        client = await connectToDatabase();
        const data_base = client.db('casadepapel');
        const totalCount = data_base.collection('totalOpenedCaseNumber');
    
        const currentCount = await totalCount.findOne({duty:"keepcount"});
        if(currentCount){
          res.status(200).json({ total: currentCount.totalNumber });
        }else{
          res.status(404).json({message:"total case count not found"});
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
