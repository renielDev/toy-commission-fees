import {
  Transaction,
  ConfigCashOut,
  ConfigCashIn,
} from "../../types/transaction"
import compose from "compose-function"
import moment from "moment"

type TransactionReturn = {
  getCommission(data: Transaction): number
}

/**
 * Convert decimal to percentage
 *
 * @param number
 * @return {number}
 */
export const toPercent = (number: number): number => number / 100

/**
 * Calculate the commission based on the percentage on total amount
 *
 * @param amount
 * @param percentage
 *
 * @return {number}
 */
export const computeCommission = (amount: number, percentage: number): number =>
  amount * toPercent(percentage)

/**
 * Check if exceeding the max limit
 *
 * @param max
 * @param amount
 *
 * @return {number}
 */
export const withMaximum = (max: number, amount: number): number =>
  amount > max ? max : amount

/**
 * Check if below minimum
 *
 * @param min
 * @param amount
 *
 * @return {number}
 */
export const withMinimum = (min: number, amount: number): number =>
  amount < min ? min : amount

/**
 * Generate key based on the transaction date and user
 * @param data
 * @return {string}
 */
export const getWeeklyKey = (data: Transaction): string => {
  const date = moment(data.date)
  const year = date.year()
  // subtract 1 day to count monday as starting week instead of sunday
  const week = date.subtract(1, "day").week()
  return `${data.user_id}-${year}-${week}-${data.type}`
}

/**
 * Get weekly total by each user
 *
 * @param data - all data transaction
 * @return {object} - users and its weekly total per year
 */
export const getWeeklyTotalByUser = (data: Transaction[]): object => {
  const weeklyTotal = data.reduce((acc, curr) => {
    const key = getWeeklyKey(curr)

    if (acc.hasOwnProperty(key)) {
      acc[key] += curr.operation.amount

      return acc
    }

    return {
      ...acc,
      [key]: curr.operation.amount,
    }
  }, {})
  return weeklyTotal
}

/**
 * Check transaction is below its weekly limit
 * and qualifies for free commission
 *
 * @param limitInWeek
 * @param weeklyTotal
 * @param data
 * @param commission
 *
 * @return {number} - total commissionalble amount
 */
const withWeeklyLimit = (
  limitInWeek: number,
  weeklyTotal: object,
  transaction: Transaction
): number => {
  const key = getWeeklyKey(transaction)
  const amount = transaction.operation.amount

  if (weeklyTotal.hasOwnProperty(key)) {
    if (weeklyTotal[key] <= limitInWeek) return 0

    if (amount > limitInWeek) return amount - limitInWeek

    return amount
  }

  return 0
}

/**
 * Less limit from the total commission
 * by calculating the limit and deducting from the
 * total calculated commission
 *
 * @param commission
 * @param limit
 * @param percentage
 *
 * @return {number}
 */
const withLessWeeklyLimit = (
  commission: number,
  limit: number,
  percentage: number
): number => {
  const totalCommssion = commission - computeCommission(limit, percentage)
  return totalCommssion > 0 ? totalCommssion : 0
}

export function CashIn(config: ConfigCashIn): TransactionReturn {
  return {
    getCommission: (data: Transaction) => {
      const max = config.max.amount
      const enhanced = compose(
        (commission: number) => withMaximum(max, commission),
        () => computeCommission(data.operation.amount, config.percents)
      )
      return enhanced()
    },
  }
}

export function CashOut(
  config: ConfigCashOut,
  transactions: Transaction[]
): TransactionReturn {
  const weeklyTotal = getWeeklyTotalByUser(transactions)

  const computeNatural = (transaction: Transaction): number => {
    const limit = config.week_limit.amount
    const enhanced = compose(
      // (commission: number) =>
      //   withLessWeeklyLimit(commission, limit, config.percents),
      (totalCommissionableAmount) =>
        computeCommission(totalCommissionableAmount, config.percents),
      () => withWeeklyLimit(limit, weeklyTotal, transaction)
    )
    return enhanced()
  }

  const computeJuridical = (transaction: Transaction): number => {
    const min = config.min.amount
    const enhanced = compose(
      (commission: number) => withMinimum(min, commission),
      () => computeCommission(transaction.operation.amount, config.percents)
    )
    return enhanced()
  }

  const calculator = (type) => {
    if (type === "natural") return computeNatural

    return computeJuridical
  }

  return {
    getCommission: (data) => {
      const commissionCalculator = calculator(data.user_type)
      return commissionCalculator(data)
    },
  }
}

export default {
  CashIn,
  CashOut,
}
