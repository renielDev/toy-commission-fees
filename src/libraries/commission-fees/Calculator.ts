import {
  Transaction,
  ConfigCashOut,
  ConfigCashIn,
} from "../../types/transaction"
import compose from "compose-function"
import { computeCommission, getWeeklyTotalByUser } from "./helpers/commission"
import { withMaximum, withWeeklyLimit, withMinimum } from "./enhancers"

type TransactionReturn = {
  getCommission(data: Transaction): number
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
