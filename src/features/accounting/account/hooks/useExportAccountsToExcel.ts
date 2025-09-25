import { useMutation } from "@tanstack/react-query";
import { accountService } from "../services/accountService";
import { toast } from "sonner";

export function useExportAccountsToExcel() {
  return useMutation({
    mutationFn: accountService.exportAccountsToExcel,
    onSuccess: (data) => {
      toast.info("Exportación exitosa");
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cuentas.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Archivo descargado exitosamente");
    },
  });
}
