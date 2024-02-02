import { closeDatabaseConnection, connectToDatabase } from "../pages/api/mdb";

export async function fetchCases() {
  let client;
  try {
    client = await connectToDatabase();
    const database = client.db('casadepapel');
    const casesCollection = database.collection('cdp_cases');
    
    // Specify the projection to exclude the _id field
    const allCases = await casesCollection.find({}, { projection: { _id: 0 } }).toArray();

    return allCases;
  } catch (error) {
    console.error("Failed to fetch cases: ", error);
    throw new Error("Failed to fetch cases");
  } finally {
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}

