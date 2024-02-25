import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let client;
  console.log("livedrops.ts");

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const livedrop = data_base.collection('livedrop');

    const itemCount = await livedrop.countDocuments();
    console.log(itemCount);

    const documentsToDelete = await livedrop.find().sort({ dropTime: 1 }).limit(itemCount-350).toArray();
    const idsToDelete = documentsToDelete.map(doc => doc._id);
    const deleteResult = await livedrop.deleteMany({ _id: { $in: idsToDelete } });
    console.log(deleteResult);
    res.status(200).json(deleteResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't delete drops " })
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
