import type { NextApiRequest, NextApiResponse } from "next";
import triggerPump from "../../defer/triggerpumpendpoint";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await triggerPump();
  res.status(200).json({ message: "trigered" });
}
