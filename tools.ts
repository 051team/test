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
    const randomNumber = Math.floor(Math.random() * 115) + 5;
    return randomNumber;
  }


export  const colorGenerator = (price:string | number) => {
    price = parseFloat(price as string);
    if(price < 11){
        return "navy"
    }
    if(price > 10 && price < 61 ){
      return "purple"
    }
    if(price > 60 && price < 101 ){
      return "darkgreen"
    }
    if(price > 100 && price < 501 ){
      return "orange"
    }
    if(price > 500 ){
      return "red"
    }
}



export const  shuffleArray = (array:any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}