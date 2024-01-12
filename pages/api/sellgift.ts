// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase, closeDatabaseConnection} from "./mdb";

const mockLotteryDraw = (giftArray:any) => {
    if(!giftArray){return}
    let balls:any[] = [];
    for (let i = 0; i < giftArray.length; i++) {
        const gift = giftArray[i];
        const probability = gift.giftProbability;
        const price = gift.giftPrice;
        const name = gift.giftName;
        for (let ind = 0; ind < probability; ind++) {
            balls.push({name:name,price:price});
        }
    }
    const chosenIndex = Math.floor(Math.random() * balls.length);
    const selectedBall = balls[chosenIndex];
    const selectedGift = giftArray.find((g:any)=>g.giftName === selectedBall.name && g.giftPrice === selectedBall.price);

    return selectedGift;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Selling Case....");

  const {gift,user} = JSON.parse(req.body);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const users = data_base.collection('cdp_users');

    const resultSold = await users.updateOne(
        {
            cdpUser:{$eq:user.name},
            cdpEmail:{$eq:user.email},
            inventory: gift
        },
        {
            $pull: { inventory: gift },
            $inc:{ balance:parseFloat(gift.giftPrice)}     
        }
    )
    if(resultSold.matchedCount === 1 && resultSold.modifiedCount === 1){
        console.log(resultSold)
        res.status(200).json({ message: 'Gift sold! Balance updated',color:"lightgreen"});
    }else{
        res.status(500).json({ message: 'Failed to sell the gift',color:"red" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to sell the gift',color:"red" });
}
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
