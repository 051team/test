// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("User Endpoint accessed")

  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const members = data_base.collection('cdp_users');

    const activeUsers = await members.find().toArray();
    console.log(activeUsers)

    res.status(200).json(activeUsers);

  } catch (error) {
    console.log(error);
    res.status(500).json({ name: 'New User' })
  }
}
