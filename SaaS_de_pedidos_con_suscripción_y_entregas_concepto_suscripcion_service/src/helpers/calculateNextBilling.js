'use strict'

function calculateNextBillingDate(startDate, billingCycle) {
  const date = new Date(startDate);
  
  switch (billingCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'annual':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Por defecto mensual
  }
  
  return date;
}

module.exports = {
  calculateNextBillingDate
}