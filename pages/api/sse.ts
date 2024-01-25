import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, closeDatabaseConnection } from "./mdb";

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
                .limit(50)            
                .toArray();

            const sendCurrentTime = () => {
                const randomItem = Math.floor(Math.random() * lastDrops.length);
                res.write(`data: ${JSON.stringify(lastDrops[randomItem])}\n\n`);
            };

            intervalId = setInterval(sendCurrentTime, 400) as NodeJS.Timer;

            req.on('close', async () => {
                console.log('Client disconnected');
                clearInterval(intervalId);
                await closeDatabaseConnection(client);
                resolve();
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }finally{
            if (client) {
                await closeDatabaseConnection(client);
            }
        }
    });
}
