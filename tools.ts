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
    if(price < 11){
        return "linear-gradient(rgb(5 5 18), #0b1649)"
    }
    if(price > 10 && price < 61 ){
      return "linear-gradient(rgb(16 2 16), #2b0741)"
    }
    if(price > 60 && price < 101 ){
      return "linear-gradient(rgb(3 8 3), #072f1c)"
    }
    if(price > 100 && price < 501 ){
      return "linear-gradient(rgb(28 17 2), #a37610)"
    }
    if(price > 500 ){
      return "linear-gradient(rgb(8 1 1), #4b051f)"
    }
}



export const  shuffleArray = (array:any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}