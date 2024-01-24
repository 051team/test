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

  console.log("Multi Case Opening...");
  const { cat, name, user, multiplier } = JSON.parse(req.body);

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
        // valid case to open
        const wonItems = [];
        for (let i = 0; i < multiplier; i++) {
            const lotteryResult = mockLotteryDraw(caseToOpen.caseGifts);
            wonItems.push(lotteryResult);
        }
        const casePrice = caseToOpen.casePrice;
        const totalCost = casePrice*multiplier;

        const accountOwner = await users.findOne({cdpUserDID:{$eq:user.id}});

        if(!accountOwner){
            res.status(404).json({message:"No valid account owner",color:"red"});
            return
        }

        if(accountOwner){
            const balance = accountOwner.balance;
            const balanceEnough = balance > totalCost || balance === totalCost;
            if(!balanceEnough){
                res.status(500).json({ message: 'Not enough balance to open the case!',color:"red" });
            }
            if(balanceEnough){
                const result = await users.updateOne({cdpUserDID:{$eq:user.id}},
                    { 
                      $inc:{balance:-totalCost},
                      $push: { inventory: {$each:wonItems} }
                  },
                );
                if(result.matchedCount === 1 && result.matchedCount === 1){
                    res.status(200).json({wonItems:wonItems});
                  }else{
                    res.status(500).json({ message: 'Failed to update user after lottery drawing',color:"red" });
                }
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