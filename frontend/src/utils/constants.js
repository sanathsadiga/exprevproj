export const MONTHS = [
  { value: 1, label: 'April' },
  { value: 2, label: 'May' },
  { value: 3, label: 'June' },
  { value: 4, label: 'July' },
  { value: 5, label: 'August' },
  { value: 6, label: 'September' },
  { value: 7, label: 'October' },
  { value: 8, label: 'November' },
  { value: 9, label: 'December' },
  { value: 10, label: 'January' },
  { value: 11, label: 'February' },
  { value: 12, label: 'March' },
];

export const getCurrentFiscalYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
};
