import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateFiscalYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const getFiscalYearRange = (fiscalYear) => {
  const [startYear] = fiscalYear.split('-');
  const start = new Date(parseInt(startYear), 3, 1);
  const end = new Date(parseInt(startYear) + 1, 2, 31);
  return { start, end };
};
