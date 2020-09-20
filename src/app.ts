import * as file from "./helpers/file"
import { CashIn, CashOut } from "./libraries/commission-fees/Calculator"
import { toDecimal } from "./libraries/commission-fees/helpers/math"

const pathToFile = process.argv.slice(2)[0]
const transactions = file.readContents(pathToFile)

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

const CashInCommission = CashIn(cashInConfig)
const CashOutCommission = CashOut(cashOutConfig, transactions)

const commissions = transactions.map((transaction) => {
  if (transaction.type === "cash_in")
    return toDecimal(CashInCommission.getCommission(transaction), 2)

  return toDecimal(CashOutCommission.getCommission(transaction), 2)
})

process.stdout.write(commissions.join(" \n"))
