export type Currency = "EUR"
export type TransactionType = "cash_in" | "cash_out"
export type UserType = "natural" | "juridical"
export type AmountSchema = {
  amount: number
  currency: Currency
}

export interface BaseConfig {
  percents: number
}

export interface ConfigCashIn extends BaseConfig {
  max: AmountSchema
}

export interface ConfigCashOutNatural extends BaseConfig {
  week_limit: AmountSchema
}

export interface ConfigCashOutJuridical extends BaseConfig {
  min: AmountSchema
}

export type ConfigCashOut = ConfigCashOutNatural & ConfigCashOutJuridical

export interface Transaction {
  date: string
  user_id: number
  user_type: UserType
  type: TransactionType
  operation: {
    amount: number
    currency: Currency
  }
}
