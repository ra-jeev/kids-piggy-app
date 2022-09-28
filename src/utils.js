import { Frequency } from './models';

let dateFormatter,
  currencyFormatter = {};

const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  if (!dateFormatter) {
    dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  return dateFormatter.format(new Date(dateString));
};

const formatCurrency = (amount, currency) => {
  if (!currencyFormatter[currency]) {
    currencyFormatter[currency] = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 1,
    });
  }

  return currencyFormatter[currency].format(amount);
};

const calculateNextPayout = (schedule) => {
  if (schedule) {
    const date = new Date();
    const currDate = date.getDate();
    const currMonth = date.getMonth();

    const nextMoneyDate = new Date();
    nextMoneyDate.setUTCHours(0, 0, 0);

    if (schedule === Frequency.DAILY) {
      nextMoneyDate.setUTCDate(currDate + 1);
    } else if (schedule === Frequency.WEEKLY) {
      // +1 is for getting Monday, doesn't care if today is Sunday,
      // next payout will be after 8 days
      const nextMondayInDays = 7 - date.getDay() + 1;
      nextMoneyDate.setUTCDate(currDate + nextMondayInDays);
    } else if (schedule === Frequency.MONTHLY) {
      nextMoneyDate.setUTCMonth(currMonth + 1, 1);
    }

    return nextMoneyDate;
  }

  return '';
};

export { formatDate, formatCurrency, calculateNextPayout };
