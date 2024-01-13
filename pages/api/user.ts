// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("User Endpoint accessed")
  const user_from_session = JSON.parse(req.body).user;
  const name = user_from_session.name;
  const email = user_from_session.email;
  
  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const members = data_base.collection('cdp_users');

    const existingUser = await members.findOne({
      cdpUser:{$eq:name}, cdpEmail:{$eq:email}
    });

    if(existingUser){
      console.log("User already exists");
      res.status(200).json({ name: 'Existing User', balance:existingUser.balance })
    }else{
      const result = await members.insertOne({
        cdpUser:name, cdpEmail:email,balance:0, joinedAt:new Date(), coupons_used:[]
      });
      console.log(result);
      res.status(200).json({ name: 'New User' })
    }
    

  } catch (error) {
    console.log(error);
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
