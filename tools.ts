import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
const containerName = process.env.NEXT_PUBLIC_CONTAINER_NAME!;


export const formatter = (price: number): string => {
  if(price === null){
    return ""
  }
    const formattedPrice = new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  
    return formattedPrice;
  };


 export  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 140) + 20;
    return randomNumber;
  }


export  const colorGenerator = (price:string | number) => {
    price = parseFloat(price as string);
    if(price < 6){
        return "linear-gradient(rgb(5, 5, 5) 10%, rgb(22 22 22))"
    }
    if(price > 5 && price < 21 ){
      return "linear-gradient(rgb(5 5 5) 10%, rgb(4 53 35))"
    }
    if(price > 21 && price < 61 ){
      return "linear-gradient(rgb(5 5 5) 10%, rgb(4 30 77))"
    }
    if(price > 61 && price < 101 ){
      return "linear-gradient(rgb(5 5 5) 10%, rgb(73 11 68 / 75%))"
    }
    if(price > 101 && price < 401 ){
      return "linear-gradient(rgb(5 5 5) 10%, rgb(217 153 7 / 80%))"
    }
    if(price > 400 ){
      return "linear-gradient(rgb(0 0 0) 10%, #610808f0)"
    }
}


export const  shuffleArray = (array:any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


export const compareObjects = (obj1:any, obj2:any,) => {
  return obj1.dropTime === obj2.dropTime;
}


export const mockLotteryDraw = (giftArray:any) => {
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



export const uploadFileToBlob = async (file: File | null, newFileName: string) => {
  if (!file) {
    console.log("Not found");
  } else {
    const blobService = new BlobServiceClient(
      /* `https://${storageAccountName}.blob.core.windows.net/?${sasToken}` */
      process.env.NEXT_PUBLIC_SASURL!
    );

    const containerClient: ContainerClient =
      blobService.getContainerClient(containerName!);
    await containerClient.createIfNotExists({
      access: 'container',
    });

    const blobClient = containerClient.getBlockBlobClient(newFileName);
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    await blobClient.uploadData(file, options);
    console.log("Upload successful");

    const blobUrl = blobClient.url;
    return blobUrl;
  }
};