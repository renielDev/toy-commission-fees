import { Transaction } from "../../../types/transaction"
import moment from "moment"
import { toPercent } from "./math"

/**
 * Generate key based on the transaction date and user
 * @param data
 * @return {string}
 */
export const generateWeeklyKey = (data: Transaction): string => {
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
    const key = generateWeeklyKey(curr)

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
 * Calculate the commission based on the percentage on total amount
 *
 * @param amount
 * @param percentage
 *
 * @return {number}
 */
export const computeCommission = (amount: number, percentage: number): number =>
  amount * toPercent(percentage)
