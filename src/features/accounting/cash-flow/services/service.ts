import { TypeFetchBalance } from "@/lib/data";
import { LevelData } from "../../results/types/types";
import { api } from "@/lib/api";
import { CashFlowResponseData } from "../types/types";
import {
  UpdateWorkSheetCashFlowItem,
  WorkSheetResponse,
} from "../schemas/cashFlowSchema";

export async function getAllDataCashFlow({
  iDate,
  eDate,
  typeFetchBalance,
  level,
  sucursalId,
  incomeFile,
  balanceFile,
}: {
  iDate: string;
  eDate: string;
  typeFetchBalance: TypeFetchBalance;
  level?: LevelData;
  sucursalId?: string;
  incomeFile?: File | null;
  balanceFile?: File | null;
}) {
  try {
    // If files are provided, use FormData
    if (incomeFile && balanceFile) {
      const formData = new FormData();
      formData.append("GestionLastStateIncome", incomeFile);
      formData.append("GestionLastBalanceSheet", balanceFile);
      formData.append("Level", level?.toString() || "1");
      formData.append("InitDate", iDate);
      formData.append("EndDate", eDate);
      formData.append("Type", typeFetchBalance.toString());
      if (sucursalId) {
        formData.append("sucursalId", sucursalId);
      }

      const response = await api.post(
        `/api/FinancialState/ClashFlow`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data as CashFlowResponseData;
    } else {
      // Use regular JSON request if no files
      const response = await api.post(`/api/FinancialState/ClashFlow`, {
        params: {
          Level: level,
          InitDate: iDate,
          EndDate: eDate,
          Type: typeFetchBalance,
          sucursalId,
        },
      });
      return response.data as CashFlowResponseData;
    }
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function exportBalanceSheetXlsx() {
  try {
    const response = await api.get(
      "/api/ClashFlow/FormatBalanceSheetXlsx"
    );
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function exportStatementIncomeXlsx() {
  try {
    const response = await api.get(
      "/api/ClashFlow/FormatStatementIncomeXlsx"
    );
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function uploadBalanceSheetFile(file: File, inSus: boolean) {
  try {
    const formData = new FormData();
    formData.append("FileConfig", file);
    formData.append("InSus", inSus.toString());
    formData.append("BusinessId", "1")
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
    formData.append("BusinessId", "1")
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
    const response = await api.get("/api/ClashFlow/is-configurated/balance-sheet");
    return response.data as boolean;
  } catch (e) {
    throw new Error("Error checking balance sheet configuration");
  }
}

export async function isStatementIncomeConfigured(): Promise<boolean> {
  try {
    const response = await api.get("/api/ClashFlow/is-configurated/state-income");
    return response.data as boolean;
  } catch (e) {
    throw new Error("Error checking statement income configuration");
  }
}
