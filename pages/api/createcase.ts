// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {connectToDatabase} from "./mdb";
import formidable from 'formidable';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';


export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const readCaseInfo = (req: NextApiRequest,saveLocally?:boolean):Promise<{fields:formidable.Fields, files:formidable.Files}> => {

  // create options variable to handle images and form data
  const options:formidable.Options = {};
  if(saveLocally){
    options.uploadDir = path.join(process.cwd(),"./public/caseimages");
    options.filename = (name,extension,path,form) =>  {
      return path.originalFilename || new Date().toLocaleDateString();
    }
  }

  //create form with options applied
  const form = formidable();
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

  res.status(200).json({ message: 'Create Case Route working', color:"green" });
}
