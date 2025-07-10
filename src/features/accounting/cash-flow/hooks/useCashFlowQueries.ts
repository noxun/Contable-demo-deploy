import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  uploadBalanceSheetFile,
  uploadStatementIncomeFile,
  isBalanceSheetConfigured,
  isStatementIncomeConfigured,
} from "../services/service";

// Query hooks for checking configuration status
export function useBalanceSheetConfigStatus() {
  return useQuery({
    queryKey: ['balance-sheet-configured'],
    queryFn: isBalanceSheetConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStatementIncomeConfigStatus() {
  return useQuery({
    queryKey: ['statement-income-configured'],
    queryFn: isStatementIncomeConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hooks for file uploads
export function useUploadBalanceSheet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { file: File; inSus: boolean }) => 
      uploadBalanceSheetFile(data.file, data.inSus),
    onSuccess: () => {
      toast.success("Balance de gestión subido exitosamente");
      // Invalidate and refetch the configuration status
      queryClient.invalidateQueries({ queryKey: ['balance-sheet-configured'] });
    },
    onError: (error) => {
      console.error("Error uploading balance sheet:", error);
      toast.error("Error al subir el balance de gestión");
    },
  });
}

export function useUploadStatementIncome() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { file: File; inSus: boolean }) => 
      uploadStatementIncomeFile(data.file, data.inSus),
    onSuccess: () => {
      toast.success("Estado de gestión de ingresos subido exitosamente");
      // Invalidate and refetch the configuration status
      queryClient.invalidateQueries({ queryKey: ['statement-income-configured'] });
    },
    onError: (error) => {
      console.error("Error uploading statement income:", error);
      toast.error("Error al subir el estado de gestión de ingresos");
    },
  });
}

// Combined hook for easier usage
export function useCashFlowFileOperations() {
  const balanceConfigQuery = useBalanceSheetConfigStatus();
  const incomeConfigQuery = useStatementIncomeConfigStatus();
  const uploadBalanceMutation = useUploadBalanceSheet();
  const uploadIncomeMutation = useUploadStatementIncome();

  return {
    // Configuration status
    isBalanceConfigured: balanceConfigQuery.data,
    isLoadingBalanceConfig: balanceConfigQuery.isLoading,
    isIncomeConfigured: incomeConfigQuery.data,
    isLoadingIncomeConfig: incomeConfigQuery.isLoading,
    
    // Upload mutations
    uploadBalanceSheet: uploadBalanceMutation.mutateAsync,
    uploadStatementIncome: uploadIncomeMutation.mutateAsync,
    
    // Loading states
    isUploadingBalance: uploadBalanceMutation.isPending,
    isUploadingIncome: uploadIncomeMutation.isPending,
    isUploading: uploadBalanceMutation.isPending || uploadIncomeMutation.isPending,
  };
}
