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
        const cases = data_base.collection('cdp_cases');
        const totalTurnover = await cases.aggregate([
          {
            $group: {
              _id: null,
              totalTurnover: { $sum: "$turnover" }
            }
          }
        ]).toArray();
        
        console.log("Total turnover:", totalTurnover[0].totalTurnover);
        
        const currentCount = await totalCount.findOne({duty:"keepcount"});
        if(currentCount){
          res.status(200).json({ total: currentCount.totalNumber, turnover:totalTurnover[0].totalTurnover });
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
