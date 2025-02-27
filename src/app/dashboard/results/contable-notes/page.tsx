"use client";

import { Button } from "@/components/ui/button";
import { fetchContableNotesBlob } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";

export default function ContableNotesPage() {
  const downloadContableNotesWordMutation = useMutation({
    mutationFn: fetchContableNotesBlob,
    onSuccess: (data) => {
      if(typeof window !== "undefined"){
        const url = URL.createObjectURL(
          new Blob([data], { type: "application/msword" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "Notas_a_los_Estados_Financieros.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    onError: (error) => {
      console.error("Descarga Fallida", error);
    },
  });

  const handleClick = () => {
    downloadContableNotesWordMutation.mutate();
  };

  return (
    <main>
      <h1>Notas a los Estados Financieros</h1>
      <Button onClick={handleClick} disabled={downloadContableNotesWordMutation.isPending}>
        {downloadContableNotesWordMutation.isPending
          ? "Descargando"
          : "Descargar"}
      </Button>
    </main>
  );
}
