"use client";

import { Button } from "@/components/ui/button";
import { Download, LoaderIcon } from "lucide-react";
import { useDownloadPurchaseTemplate } from "../hooks/useDownloadPurchaseTemplate";

interface DownloadPurchaseTemplateButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function DownloadPurchaseTemplateButton({
  variant = "default",
  size = "default",
  className,
  children,
}: DownloadPurchaseTemplateButtonProps) {
  const downloadMutation = useDownloadPurchaseTemplate();

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={downloadMutation.isPending}
    >
      {downloadMutation.isPending ? (
        <>
          <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
          Descargando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {children || "Descargar Plantilla de Compras"}
        </>
      )}
    </Button>
  );
}
