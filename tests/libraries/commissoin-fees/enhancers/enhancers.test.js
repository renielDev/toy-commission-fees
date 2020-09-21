import {
  withMaximum,
  withMinimum,
  withWeeklyLimit,
} from "../../../../src/libraries/commission-fees/enhancers"
import { getWeeklyTotalByUser } from "../../../../src/libraries/commission-fees/helpers/commission"

const mockTransactions = require("../mock-transactions.json")

describe("Enhancers", () => {
  test("withMaximum enhancer - should return max amount if exceeded max value", () => {
    expect(withMaximum(5, 8)).toBe(5)
    expect(withMaximum(3, 2)).toBe(2)
  })

  test("withMinimum enhancer - should return min amount if below min value", () => {
    expect(withMinimum(4, 3)).toBe(4)
    expect(withMinimum(4, 6)).toBe(6)
  })

  test("withWeeklyLimit enhancer - should return commissionable amount deducted limit if above it", () => {
    const weeklyTotal = getWeeklyTotalByUser(mockTransactions)
    const limit = 1000
    const transaction1 = mockTransactions[2]
    const transaction2 = mockTransactions[3]
    expect(withWeeklyLimit(limit, weeklyTotal, transaction1)).toBe(29000)
    expect(withWeeklyLimit(limit, weeklyTotal, transaction2)).toBe(1000)
  })

  test("withWeeklyLimit enhancer - should return 0 weekly total has not been exceeded", () => {
    const weeklyTotal = getWeeklyTotalByUser(mockTransactions)
    const limit = 1000
    const transaction1 = mockTransactions[8]

    expect(withWeeklyLimit(limit, weeklyTotal, transaction1)).toBe(0)
  })
})
