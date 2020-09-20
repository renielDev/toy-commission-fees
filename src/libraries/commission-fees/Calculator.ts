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

export const computeCommission = (amount: number, percentage: number): number =>
  amount * toPercent(percentage)

export const withMaximum = (max: number, amount: number): number =>
  amount > max ? max : amount

export const withMinimum = (min: number, amount: number): number =>
  amount < min ? min : amount

export const getWeeklyKey = (data: Transaction): string => {
  const date = moment(data.date)
  const year = date.year()
  const week = date.week()
  return `${data.user_id}-${year}-${week}`
}

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

const withWeeklyLimit = (
  limitInWeek: number,
  weeklyTotal: object,
  data: Transaction,
  commission: number
): number => {
  const key = getWeeklyKey(data)

  if (weeklyTotal.hasOwnProperty(key)) {
    // check if weekly limit hasn't been exceeded
    return weeklyTotal[key] <= limitInWeek ? 0 : commission
  }

  return commission
}

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

  const computeNatural = (data: Transaction): number => {
    const limit = config.week_limit.amount
    const enhanced = compose(
      (commission: number) =>
        withWeeklyLimit(limit, weeklyTotal, data, commission),
      (commission: number) =>
        withLessWeeklyLimit(commission, limit, config.percents),
      () => computeCommission(data.operation.amount, config.percents)
    )
    return enhanced()
  }

  const computeJuridical = (data: Transaction): number => {
    const min = config.min.amount
    const enhanced = compose(
      (commission: number) => withMinimum(min, commission),
      () => computeCommission(data.operation.amount, config.percents)
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
