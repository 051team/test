// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

let activeUsers:string[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "GET"){
    const {who} = req.query;
    const {count} = req.query;
    if(who){
      activeUsers = activeUsers.filter((user) => user !== who);
      res.status(200).json({ message: "User logged out." });
      return
    }
    if(count){
      res.status(200).json({ activeUserCount:activeUsers.length+(40-Math.floor(Math.random()*10))});
      return
    }
    else{
      res.status(404).json({message:"Log out failed"});
      return
    }
  } 


  const user_from_session = JSON.parse(req.body).user;
  const name = user_from_session.name;
  const email = user_from_session.email;
  const userId = user_from_session.id;

  if(!activeUsers.includes(userId)){
    activeUsers.push(userId);
  }
  
  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const members = data_base.collection('cdp_users');

    const existingUser = await members.findOne({
      cdpUserDID:{$eq:userId}
    });

    if(existingUser){
      //console.log("User already exists",existingUser.cdpUser);
      res.status(200).json({ name: 'Existing User', balance:existingUser.balance, activeUserCount:activeUsers.length })
    }else{
      const result = await members.updateOne(
        { cdpUserDID: userId },
        {
          $setOnInsert: {
            cdpUserDID: userId,
            cdpUser: name,
            cdpEmail: email,
            balance: 0,
            joinedAt: new Date(),
            coupons_used: [],
          },
        },
        { upsert: true }
      );
      console.log(result);
      res.status(200).json({  activeUserCount:activeUsers.length })
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
