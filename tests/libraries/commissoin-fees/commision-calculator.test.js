import CommissionCalculator from "../src/libraries/commission-fees/Calculator"

describe("Commision Calculator", () => {
  test("calculate cash-in commision", () => {
    const inputData = {
      date: "2016-01-05", // operation date in format `Y-m-d`
      user_id: 1, // user id, integer
      user_type: "natural", // user type, one of “natural”(natural person) or “juridical”(legal person)
      type: "cash_in", // operation type, one of “cash_in” or “cash_out”
      operation: {
        amount: 200, // operation amount(for example `2.12` or `3`)
        currency: "EUR", // operation currency `EUR`
      },
    }

    expect(
      CommissionCalculator.setConfig({
        percents: 0.03,
        max: {
          amount: 5,
          currency: "EUR",
        },
      }).cashIn(inputData)
    ).toBe(0.06)
  })

  test("calculate cash-out commision natural", () => {
    const inputData = {
      date: "2016-01-06",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 30000, currency: "EUR" },
    }

    expect(
      CommissionCalculator.setConfig({
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: "EUR",
        },
      }).cashOut(inputData)
    ).toBe(0.06)
  })

  test("calculate cash-out commision juridical", () => {
    const inputData = {
      date: "2016-01-06",
      user_id: 2,
      user_type: "juridical",
      type: "cash_out",
      operation: { amount: 300.0, currency: "EUR" },
    }

    expect(
      CommissionCalculator.setConfig({
        percents: 0.3,
        min: {
          amount: 0.5,
          currency: "EUR",
        },
      }).cashOut(inputData)
    ).toBe(0.9)
  })
})
