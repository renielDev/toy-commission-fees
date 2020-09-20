/**
 * Convert decimal to percentage
 *
 * @param number
 * @return {number}
 */
export const toPercent = (number: number): number => number / 100

export const toDecimal = (num: number = 0, decimalPlace: number = 2): string =>
  num.toFixed(decimalPlace)
