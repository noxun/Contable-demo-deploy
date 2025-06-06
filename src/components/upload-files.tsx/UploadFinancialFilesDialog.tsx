"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadFinancialStateFiles } from "@/lib/data";

export function UploadFinancialFilesDialog() {
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [balanceFile, setBalanceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

const handleFileUpload = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log("Botón 'Subir Archivos' presionado")
  setIsUploading(true)

  if (!incomeFile || !balanceFile) {
    alert("Por favor selecciona ambos archivos.")
    setIsUploading(false)
    return
  }

  try {
    const result = await uploadFinancialStateFiles({
      incomeStatementFile: incomeFile,
      balanceSheetFile: balanceFile,
    })
    console.log('Upload successful:', result)
    alert('Archivos subidos correctamente')
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Error al subir los archivos')
  } finally {
    setIsUploading(false)
    setIncomeFile(null)
    setBalanceFile(null)
  }
}


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subir Archivos</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFileUpload}>
          <DialogHeader>
            <DialogTitle>Subir Archivos Financieros</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="incomeFile">Estado de Gestión de Ingresos</Label>
              <Input
                id="incomeFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setIncomeFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="balanceFile">Balance de Gestión</Label>
              <Input
                id="balanceFile"
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setBalanceFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Subiendo..." : "Subir Archivos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
