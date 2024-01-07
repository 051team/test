// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";
import formidable from 'formidable';
import path from 'path';
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const readCaseInfo = (req: NextApiRequest,saveLocally:boolean):Promise<{fields:formidable.Fields, files:formidable.Files}> => {

  // create options variable to handle images and form data
  const options:formidable.Options = {};
  if(saveLocally){
    options.uploadDir = path.join(process.cwd(),"public/caseimages");
    options.filename = (name,extension,path,form) =>  {
      return path.originalFilename || new Date().toLocaleDateString();
    }
  }

  //create form with options applied
  const form = formidable(options);
  return new Promise ((resolve,reject)=>{
    form.parse(req,(error, fields, files)=>{
      if(error)reject(error);
      resolve({fields,files});
    });
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Create CASE Endpoint accessed");

  const test = await readCaseInfo(req,true);

  console.log(test);

/*   const form = formidable();
  form.parse(req, (error,fields,files)=>{
    console.log("all working");
    console.log(files)
    console.log(fields)
  }); */

  res.status(200).json({ message: 'Create Case Route working', color:"green" });

  
/*   try {
    const client = await connectToDatabase();
    const data_base = client.db('casadepapel');
    const coupons = data_base.collection('cdp_coupons');

    const result = await coupons.insertOne(coupon);

    if (result.acknowledged && result.insertedId) {
      res.status(200).json({message:"Coupon has successfully been created!",color:"green"});
    } else {
        res.status(200).json({message:"Failed to create coupon",color:"red"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ name: 'New User' })
  } */
}
