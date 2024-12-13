"use client";
import { Button } from "@/components/ui/button";
import { getSingleAccountReport } from "@/lib/data";
import { InvoiceRegistryType } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function DownloadSingleAccountReportButton({
  data,
}: {
  data: any;
}) {
  const downloadFileMutation = useMutation({
    mutationFn: getSingleAccountReport,
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
    downloadFileMutation.mutate(data);
  }

  return (
    <Button onClick={handleClick} disabled={downloadFileMutation.isPending}>
      {downloadFileMutation.isPending
        ? "Descargando..."
        : "Reporte Cuenta Actual"}
    </Button>
  );
}
