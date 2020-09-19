import axios from "axios"
import { UserType } from "../types/transaction"

const BASE_URL = "http://private-38e18c-uzduotis.apiary-mock.com/"

export const cashOut = (type: UserType): Promise<any> => {
  return axios.get(`${BASE_URL}config/cash-out/${type}`)
}

export const cashIn = (): Promise<any> => {
  return axios.get(`${BASE_URL}config/cash-in`)
}
