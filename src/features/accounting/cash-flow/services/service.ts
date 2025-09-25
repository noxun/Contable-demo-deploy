import { TypeFetchBalance } from "@/lib/data";
import { LevelData } from "../../results/types/types";
import { api } from "@/lib/api";
import { CashFlowResponseData } from "../types/types";
import {
  UpdateWorkSheetCashFlowItem,
  WorkSheetResponse,
} from "../schemas/workSheetSchema";
import { DirectCashFlow, IndirectCashFlow } from "../schemas/cashFlowSchema";

export async function getAllDataCashFlow({
  initDate,
  endDate,
  type,
  level,
  sucursalId,
}: {
  initDate: string;
  endDate: string;
  type: TypeFetchBalance;
  level?: LevelData;
  sucursalId?: string;
}) {
  try {
    const response = await api.get(`/api/FinancialState/ClashFlow`, {
      params: {
      Level:level,
      InitDate:initDate,
      EndDate:endDate,
      Type: type,
      SucursalId: sucursalId,
      BusinessId: 1,
      InSus: false,
    }
    });
    return response.data as CashFlowResponseData;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function fetchIndirectCashFlow(){
  try {
    const response = await api.get("/api/ClashFlow/ClashFlowIndirect");
    return response.data as IndirectCashFlow;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function fetchDirectCashFlow(){
  try {
    const response = await api.get("/api/ClashFlow/ClashFlowDirect");
    return response.data as DirectCashFlow;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function exportBalanceSheetXlsx() {
  try {
    const response = await api.get("/api/ClashFlow/FormatBalanceSheetXlsx", {
      responseType: "text",
    });
    return response.data as string;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function exportStatementIncomeXlsx() {
  try {
    const response = await api.get("/api/ClashFlow/FormatStatementIncomeXlsx", {
      responseType: "text",
    });
    return response.data as string;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function uploadBalanceSheetFile(file: File, inSus: boolean) {
  try {
    const formData = new FormData();
    formData.append("FileConfig", file);
    formData.append("InSus", inSus.toString());
    formData.append("BusinessId", "1");
    const response = await api.post(
      "/api/ClashFlow/config/balance-sheet",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data as string;
  } catch (e) {
    throw new Error("Error uploading balance sheet file");
  }
}

export async function uploadStatementIncomeFile(file: File, inSus: boolean) {
  try {
    const formData = new FormData();
    formData.append("FileConfig", file);
    formData.append("InSus", inSus.toString());
    formData.append("BusinessId", "1");
    const response = await api.post(
      "/api/ClashFlow/config/statement-income",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data as string;
  } catch (e) {
    throw new Error("Error uploading statement income file");
  }
}

export async function getWorkSheetCashFlowData() {
  const response = await api.get("/api/ClashFlow/worksheet-job");
  return response.data as WorkSheetResponse;
}

export async function updateWorkSheetCashFlowDataItem({
  id,
  data,
}: {
  id: number;
  data: UpdateWorkSheetCashFlowItem;
}) {
  const response = await api.put(`/api/ClashFlow/${id}`, data);
  return response.data;
}

export async function isBalanceSheetConfigured(): Promise<boolean> {
  try {
    const response = await api.get(
      "/api/ClashFlow/is-configurated/balance-sheet"
    );
    return response.data as boolean;
  } catch (e) {
    throw new Error("Error checking balance sheet configuration");
  }
}

export async function isStatementIncomeConfigured(): Promise<boolean> {
  try {
    const response = await api.get(
      "/api/ClashFlow/is-configurated/state-income"
    );
    return response.data as boolean;
  } catch (e) {
    throw new Error("Error checking statement income configuration");
  }
}
