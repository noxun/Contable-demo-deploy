import { api } from "@/lib/api";
import { FinancialRatiosResponse } from "../types/types";

interface DateRangeType {
  initDate: string
  endDate: string
}

export async function getFinancialRateExcelByDate(dateRante: DateRangeType) {
  const URLRequest = `api/Ratios/Xlsx`;
  const { data } = await api.get(URLRequest, {
    params: {
      initDate: dateRante.initDate,
      endDate: dateRante.endDate
    }
  });
  return data;
}

export async function getFinancialRatiosByDate(dateRante: DateRangeType) {
  const URLRequest = `api/Ratios`;
  const { data } = await api.get(URLRequest, {
    params: {
      initDate: dateRante.initDate,
      endDate: dateRante.endDate
    }
  });
  return data as FinancialRatiosResponse;
}