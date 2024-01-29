import type { NextApiRequest, NextApiResponse } from "next";
// we import our `helloWorld()` background function
import triggerPump from "./../../defer/test";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await triggerPump("Charly");
  res.status(200).json({ message: "trigered" });
}
