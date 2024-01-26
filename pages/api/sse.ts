import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, closeDatabaseConnection } from "./mdb";
import { v4 as uuidv4 } from 'uuid';

export default function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    let client: MongoClient;
    let intervalId: any;

    return new Promise(async (resolve, reject) => {
        try {
            // Set response headers
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.setHeader('Content-Encoding', 'none');
            client = await connectToDatabase();
            const data_base = client.db('casadepapel');
            const livedrop = data_base.collection('livedrop');
            const lastDrops = await livedrop.find()
                .sort({ dropTime: -1 })
                .limit(30)            
                .toArray();

            const pickRandomElements = (arr:any, count:any) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
            }

            const randomDrops = pickRandomElements(lastDrops, 1).map((drop,i) => {
                let newDoc = { ...drop };
                newDoc.dropTime = (new Date()).getTime()+i;
                delete newDoc._id;
                return newDoc;
            });

            const resultAddtoLivedrop = await livedrop.insertMany(randomDrops);

            const sendCurrentTime = async () => {
                res.write(`data: ${JSON.stringify(randomDrops)}\n\n`);
                res.end();
            };

            intervalId = setInterval(sendCurrentTime, 5000) as NodeJS.Timer;

            req.on('close', async () => {
                console.log('Client disconnected');
                await closeDatabaseConnection(client);
                clearInterval(intervalId);
                resolve();
                res.end();
            });

        } catch (error) {
            console.error(error);
            if (client) {
                await closeDatabaseConnection(client);
            }
            reject(error);
        }
        finally{
            if (client) {
                await closeDatabaseConnection(client);
                console.log("DB closed feedback from SSE")
            }
        }
    });
}
