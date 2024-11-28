"use client";
import { Button } from "@/components/ui/button";
import { getMassPurchaseFormInExcel } from "@/lib/data";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function DownloadMassPurchaseFormButton() {
  const downloadFileMutation = useMutation({
    mutationFn: getMassPurchaseFormInExcel,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        const link = document.createElement("a");
        link.href = data;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error al descargar el archivo");
    },
  });

  function handleClick() {
    downloadFileMutation.mutate();
  }

  return (
    <Button onClick={handleClick} disabled={downloadFileMutation.isPending}>
      {downloadFileMutation.isPending
        ? "Descargando..."
        : "Descargar Compras Masivas SIAT"}
    </Button>
  );
}
