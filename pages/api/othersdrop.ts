import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, closeDatabaseConnection } from "./mdb";

export default function handler(req: NextApiRequest, res: NextApiResponse){
    let client: MongoClient;
    let intervalId: any;
    let text:any;
    console.log("SWR endpoint")

    if (req.method === 'GET') {
        res.status(200).json({ name: new Date().toLocaleTimeString() });
    }
    else if(req.method === "POST"){
        res.status(200).json({ name: "POST WORKED"});
    }
    else {
        res.status(405).end(); // Method Not Allowed
    }
}
