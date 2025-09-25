"use client";
import ListFolders from "@/features/accounting/folders/components/ListFolders";
import { Suspense } from "react";

export default function FoldersPage() {
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Lista de Planillas</h2>
      </div>
      <Suspense fallback={<div>Cargando...</div>}>
        <ListFolders />
      </Suspense>
    </section>
  );
}
