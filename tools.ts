export const formatter = (price: number): string => {
    const formattedPrice = new Intl.NumberFormat('us-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  
    return formattedPrice;
  };