// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";

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
  console.log("Opening Case....");

  const { cat, name } = req.query;
  try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');

    const caseToOpen = await cases.findOne({caseCategory:{$eq:cat},caseName:{$eq:name}});
    if(caseToOpen){
        const lotteryResult = mockLotteryDraw(caseToOpen.caseGifts);
        console.log(lotteryResult);
        res.status(200).json({lucky:lotteryResult})
    }else{
        res.status(404).json({ message: 'Case not found!',color:"red" })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to find Case to Open',color:"red" })
  }
}
