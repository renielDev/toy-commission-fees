import {
  Transaction,
  ConfigCashOut,
  ConfigCashIn,
} from "../../types/transaction"
import compose from "compose-function"

type TransactionReturn = {
  getCommission(data: Transaction): number
}

const toPercent = (number: number): number => number / 100
const computeCommission = (amount: number, percentage: number): number =>
  amount * toPercent(percentage)

const withMaximum = (max: number, amount: number): number =>
  amount > max ? max : amount

const withMinimum = (min: number, amount: number): number =>
  amount < min ? min : amount

// const withWeeklyLimit = (
//   limitInWeek: number,
//   allData: Transaction[],
//   data: Transaction,
//   amount: number
// ): number => {
//   const totalInWeek = > limitInWeek ? amount : 0

//   return 0
// }

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

export function CashOut(config: ConfigCashOut): TransactionReturn {
  const computeNatural = (data: Transaction): number => {
    const limit = config.week_limit.amount
    const enhanced = compose(() =>
      computeCommission(data.operation.amount, config.percents)
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
