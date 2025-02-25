import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/data";
import { FinancialRatiosResponse } from "../types/types";

interface DateRangeType {
  initDate: string
  endDate: string
}

export async function getFinancialRateExcelByDate(dateRante: DateRangeType) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/Ratios/Xlsx`;

  setAuthToken(token);
  const { data } = await api.get(URLRequest, {
    params: {
      initDate: dateRante.initDate,
      endDate: dateRante.endDate
    }
  });
  return data;
}

export async function getFinancialRatiosByDate(dateRante: DateRangeType) {
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const URLRequest = `api/Ratios`;

  setAuthToken(token);
  const { data } = await api.get(URLRequest, {
    params: {
      initDate: dateRante.initDate,
      endDate: dateRante.endDate
    }
  });
  return data as FinancialRatiosResponse;
}