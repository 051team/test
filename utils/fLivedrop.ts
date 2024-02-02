import { closeDatabaseConnection, connectToDatabase } from "../pages/api/mdb";

export async function fetchLiveDrops() {
  let client;
  try {
    client = await connectToDatabase();
    const database = client.db('casadepapel');
    const livedropCollection = database.collection('livedrop');
    
    const lastDrops = await livedropCollection.find({}, { projection: { _id: 0 } })
    .sort({ dropTime: -1 })
    .limit(30)            
    .toArray();
    return lastDrops;
    
  } catch (error) {
    console.error("Failed to fetch live drops: ", error);
    throw new Error("Failed to fetch live drops");
  } finally {
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
