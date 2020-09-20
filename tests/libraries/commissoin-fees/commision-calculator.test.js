import {
  CashIn,
  CashOut,
  getWeeklyTotalByUser,
} from "../../../src/libraries/commission-fees/Calculator"
const mockTransactions = require("./mock-transactions.json")

describe("Commision Calculator", () => {
  test("Get weekly total", () => {
    const weeklyTotal = getWeeklyTotalByUser(mockTransactions)

    expect(weeklyTotal).toEqual({
      "1-2016-2": 31300,
      "1-2016-3": 100,
      "1-2016-8": 300,
      "2-2016-2": 300,
      "2-2016-3": 1000000,
      "3-2016-3": 1000,
    })
  })

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

    const config = {
      percents: 0.03,
      max: {
        amount: 5,
        currency: "EUR",
      },
    }

    test("calculate commision", () => {
      const Commission = new CashIn(config)

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
      const Commission = new CashIn(config)
      expect(Commission.getCommission(nInputData)).toBe(config.max.amount)
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

      const config = {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: "EUR",
        },
      }

      test("calculate commission", () => {
        const Commission = new CashOut(config, mockTransactions)
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
        const Commission = new CashOut(config, mockTransactions)
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

      const config = {
        percents: 0.3,
        min: {
          amount: 0.5,
          currency: "EUR",
        },
      }

      test("calculate commission", () => {
        const Commission = new CashOut(config, mockTransactions)
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
        const Commission = new CashOut(config, mockTransactions)
        expect(Commission.getCommission(nInputData)).toBe(config.min.amount)
      })
    })
  })
})
