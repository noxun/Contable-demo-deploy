"use client";

import { Button } from "@/components/ui/button";
import { fetchContableNotesBlob } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function ContableNotesPage() {
  const downloadContableNotesWordMutation = useMutation({
    mutationFn: fetchContableNotesBlob,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
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
      {/* <Button onClick={handleClick} disabled={downloadContableNotesWordMutation.isPending}>
        {downloadContableNotesWordMutation.isPending
          ? "Descargando"
          : "Descargar"}
      </Button> */}
      <Button asChild>
        <Link
          download
          prefetch={false}
          href="https://res.cloudinary.com/consorcionoxun/raw/upload/v1740756921/report/tradecruz/w8gj8bpfcta0hp3ub1qz.docx"
        >
          {" "}
          Descargar
        </Link>
      </Button>
    </main>
  );
}
