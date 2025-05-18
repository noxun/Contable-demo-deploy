"use service";
import axios, { isAxiosError } from "axios";

const token = localStorage.getItem("token");
export const incomeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/Voucher",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export async function createIncome(
  income: {
    type: string;
    exchangeRate: string;
    coin: string;
    checkNum: string;
    canceledTo: string;
    gloss: string;
    bankId: string;
  },
  items: {
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
  }[]
) {
  try {
    const result = await incomeApi.post("", {
      ...income,
      type: Number(income.type),
      exchangeRate: Number(income.exchangeRate),
      bankId: Number(income.bankId),
      items: items,
    });
    return {
      data: result.data,
      isSuccess: true,
      message: "Ingreso Creado",
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        isSuccess: false,
        message: error.response?.data ?? "Error al eliminar el ingreso",
      };
    }
  }
}
