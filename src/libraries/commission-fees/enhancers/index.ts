import { Transaction } from "../../../types/transaction"
import { generateWeeklyKey } from "../helpers/commission"

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
export const withWeeklyLimit = (
  limitInWeek: number,
  weeklyTotal: object,
  transaction: Transaction
): number => {
  const key = generateWeeklyKey(transaction)
  const amount = transaction.operation.amount

  if (weeklyTotal.hasOwnProperty(key)) {
    if (weeklyTotal[key] <= limitInWeek) return 0

    if (amount > limitInWeek) return amount - limitInWeek

    return amount
  }

  return 0
}
