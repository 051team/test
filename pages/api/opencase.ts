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

  const { cat, name, user } = JSON.parse(req.body);

  let client;

  try {
    client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const cases = data_base.collection('cdp_cases');
    const users = data_base.collection('cdp_users');

    const caseToOpen = await cases.findOne({caseCategory:{$eq:cat},caseName:{$eq:name}});

    if(!caseToOpen){
      res.status(404).json({message:"Case not found",color:"red"});
    }else{
      const lotteryResult = mockLotteryDraw(caseToOpen.caseGifts);
      console.log(lotteryResult);
      const casePrice = caseToOpen.casePrice;
      const accountOwner = await users.findOne({cdpUserDID:{$eq:user.id}});
      if(accountOwner){
        const balance = accountOwner.balance;
        const balanceEnough = balance > casePrice || balance === casePrice;
        console.log("Case price: ",casePrice, " Balance: ", balance);
        console.log("Enough Balance = ", balance > casePrice);
        if(balanceEnough){
          const result = await users.updateOne({cdpUserDID:{$eq:user.id}},
            { 
              $inc:{balance:-casePrice},
              $push: { inventory: lotteryResult }
          },
          );
          if(result.matchedCount === 1 && result.matchedCount === 1){
            const resultCaseStatistic = await cases.updateOne(
              {caseCategory:{$eq:cat},caseName:{$eq:name}},
              {
                $inc:{openedXtimes: 1, turnover:parseFloat(lotteryResult.giftPrice)},
              });
            
            res.status(200).json({lucky:lotteryResult});
          }else{
            res.status(500).json({ message: 'Failed to update balance',color:"red" });
          }
        }else{
          res.status(500).json({ message: 'Not enough balance to open the case!',color:"red" });
        }
      }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to find Case to Open',color:"red" });
  }
  finally{
    if (client) {
      await closeDatabaseConnection(client);
    }
  }
}
