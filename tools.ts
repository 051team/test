export const formatter = (price: number): string => {
    const formattedPrice = new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  
    return formattedPrice;
  };


 export  const generateRandomNumber = () => {
    // Generates a random number between 10 (inclusive) and 90 (exclusive)
    const randomNumber = Math.floor(Math.random() * 100) + 10;
    return randomNumber;
  }