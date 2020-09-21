const {
  generateWeeklyKey,
  getWeeklyTotalByUser,
  computeCommission,
} = require("../../../../src/libraries/commission-fees/helpers/commission")

const mockTransactions = require("../mock-transactions.json")

describe("Commission helpers", () => {
  test("should generate key based on user, week, year and transaction type", () => {
    const transaction1 = mockTransactions[0]
    const transaction2 = mockTransactions[3]

    const expected1 = "1-2016-2-cash_in"
    const expected2 = "1-2016-2-cash_out"
    expect(generateWeeklyKey(transaction1)).toBe(expected1)
    expect(generateWeeklyKey(transaction2)).toBe(expected2)
  })

  test("should return accumulated total per week of user per transaction type", () => {
    const weeklyTotal = getWeeklyTotalByUser(mockTransactions)

    expect(weeklyTotal).toEqual({
      "1-2016-2-cash_in": 200,
      "1-2016-2-cash_out": 31200,
      "1-2016-8-cash_out": 300,
      "2-2016-2-cash_in": 1000000,
      "2-2016-2-cash_out": 300,
      "3-2016-2-cash_out": 1000,
    })
  })

  test("should calculate commission based on total amount and percentage", () => {
    expect(computeCommission(1000, 0.3)).toBe(3)
    expect(computeCommission(29000, 0.3)).toBe(87)
  })
})
