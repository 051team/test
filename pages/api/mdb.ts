import { MongoClient} from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MD_URL as string);
  return client;
}


export async function closeDatabaseConnection(client:MongoClient) {
  try {
    await client.close();
    console.log("DB conenction closed")
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}