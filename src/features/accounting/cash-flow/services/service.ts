import { TypeFetchBalance } from "@/lib/data";
import { LevelData } from "../../results/types/types";
import { api } from "@/lib/api";
import { CashFlowResponseData } from "../types/types";

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
      formData.append("incomeStatementFile", incomeFile);
      formData.append("balanceSheetFile", balanceFile);
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
      "/api/FinancialState/ClashFlow/FormatBalanceSheetXlsx"
    );
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function exportStatementIncomeXlsx() {
  try {
    const response = await api.get(
      "/api/FinancialState/ClashFlow/FormatStatementIncomeXlsx"
    );
    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

export async function uploadFinancialStateFiles({
  incomeStatementFile,
  balanceSheetFile,
}: {
  incomeStatementFile: File;
  balanceSheetFile: File;
}) {
  try {
    const formData = new FormData();
    formData.append("GestionLastStateIncome", incomeStatementFile);
    formData.append("GestionLastBalanceSheet", balanceSheetFile);

    const response = await api.post("/api/FinancialState/ClashFlow", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}
