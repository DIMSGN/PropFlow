/**
 * Format a number as currency (Euro)
 * @param {number} amount - The amount to format
 * @param {string} locale - Locale string (default: 'el-GR' for Greek)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = "el-GR") => {
  if (amount === null || amount === undefined || isNaN(amount)) return "€0";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number with thousands separator
 * @param {number} number - The number to format
 * @param {string} locale - Locale string (default: 'el-GR' for Greek)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = "el-GR") => {
  if (number === null || number === undefined || isNaN(number)) return "0";

  return new Intl.NumberFormat(locale).format(number);
};
