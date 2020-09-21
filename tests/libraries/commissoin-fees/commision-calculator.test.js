import {
  CashIn,
  CashOut,
} from "../../../src/libraries/commission-fees/Calculator"
import { getWeeklyTotalByUser } from "../../../src/libraries/commission-fees/helpers/commission"

const mockTransactions = require("./mock-transactions.json")
const cashInConfig = {
  percents: 0.03,
  max: {
    amount: 5,
    currency: "EUR",
  },
}
const cashOutConfig = {
  percents: 0.3,
  min: {
    amount: 0.5,
    currency: "EUR",
  },
  week_limit: {
    amount: 1000,
    currency: "EUR",
  },
}

describe("Commision Calculator", () => {
  describe("Cash-in", () => {
    let inputData = {
      date: "2016-01-05",
      user_id: 1,
      user_type: "natural",
      type: "cash_in",
      operation: {
        amount: 200,
        currency: "EUR",
      },
    }

    test("calculate commision", () => {
      const Commission = new CashIn(cashInConfig)

      expect(Commission.getCommission(inputData)).toBe(0.06)
    })

    test("should return maximum if commission exceeds it", () => {
      const nInputData = {
        ...inputData,
        operation: {
          amount: 2000000,
          currency: "EUR",
        },
      }
      const Commission = new CashIn(cashInConfig)
      expect(Commission.getCommission(nInputData)).toBe(cashInConfig.max.amount)
    })
  })

  describe("Cash-out", () => {
    describe("natural", () => {
      let inputData = {
        date: "2016-01-06",
        user_id: 1,
        user_type: "natural",
        type: "cash_out",
        operation: { amount: 30000, currency: "EUR" },
      }

      test("calculate commission", () => {
        const Commission = new CashOut(cashOutConfig, mockTransactions)
        expect(Commission.getCommission(inputData)).toBe(87)
      })

      test("should return 0 if below weekly limit", () => {
        const nInputData = {
          date: "2016-01-10",
          user_id: 3,
          user_type: "natural",
          type: "cash_out",
          operation: { amount: 1000.0, currency: "EUR" },
        }
        const Commission = new CashOut(cashOutConfig, mockTransactions)
        expect(Commission.getCommission(nInputData)).toBe(0)
      })
    })

    describe("juridical", () => {
      let inputData = {
        date: "2016-01-06",
        user_id: 2,
        user_type: "juridical",
        type: "cash_out",
        operation: { amount: 300.0, currency: "EUR" },
      }

      test("calculate commission", () => {
        const Commission = new CashOut(cashOutConfig, mockTransactions)
        expect(Commission.getCommission(inputData)).toBe(0.9)
      })

      test("should return minimum if commission is below it", () => {
        const nInputData = {
          ...inputData,
          operation: {
            amount: 50.0,
            currency: "EUR",
          },
        }
        const Commission = new CashOut(cashOutConfig, mockTransactions)
        expect(Commission.getCommission(nInputData)).toBe(
          cashOutConfig.min.amount
        )
      })
    })
  })

  test("Should return commissions of transactions", () => {
    const transactions = mockTransactions
    const result = [0.06, 0.9, 87.0, 3.0, 0.3, 0.3, 5.0, 0.0, 0.0]

    const CashInCommission = new CashIn(cashInConfig)
    const CashOutCommission = new CashOut(cashOutConfig, transactions)

    const commissions = transactions.map((transaction) => {
      if (transaction.type === "cash_in")
        return CashInCommission.getCommission(transaction)

      return CashOutCommission.getCommission(transaction)
    })

    expect(commissions).toEqual(result)
  })
})
