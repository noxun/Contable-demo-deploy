"use client";

import { DateRange } from "react-day-picker";
import React, { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateSelector } from "@/features/accounting/shared/components/DateSelector";
import { ReportGeneratorFile } from "@/features/accounting/shared/components/ReportGeneratorFile";
import { PDFDownloadLink, PDFViewer, usePDF } from "@react-pdf/renderer";
import { GeneratedFilesTable } from "@/features/accounting/shared/components/GeneratedFilesTable";
import { BreadcrumbDashboard } from "@/features/accounting/shared/components/BreadcrumDash";
import DiaryBookPreview from "./DiaryBookPreview";
import { Button } from "@/components/ui/button";
import useDiaryBookExcel from "@/features/accounting/shared/hooks/useDiaryBookExcel";
import DiaryBookExcelButton from "./DiaryBookExcelButton";
import { ButtonLinkPDF } from "@/features/accounting/results/components/ButtonLinkPDF";
import { fetchBranches } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { SelectAsync } from "@/features/accounting/results/components/SelectAsync";

export default function DiaryBookPage() {
  // --- Estados del formulario ---
  // fecha
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  };
  const [branch, setBrach] = useState<string | undefined>(undefined);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [pdfFile, setPdfFile] = useState<React.JSX.Element | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [inSus, setInSus] = useState(false);
  const [excelEnabled, setExcelEnabled] = useState(false);
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const handleChangeIsSus = () => setInSus(!inSus);

  const handleDateChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null);
      setDateRange({
        from: startDate,
        to: endDate,
      });
    }
  }, []);

  return (
    <>
      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard/accounting",
          },
          {
            label: "Result",
            href: "#",
          },
          {
            label: "Libro Diario",
            href: "/dashboard/accounting/results/diary-book",
          },
        ]}
      />

      <div className="flex items-start justify-evenly flex-col md:flex-row gap-2 md:items-center">
        {/* seccion del selector de fecha y de cambio */}
        <div className="space-y-2">
          <DateSelector onDateChange={handleDateChange} />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inSus"
              checked={inSus}
              onCheckedChange={handleChangeIsSus}
            />
            <Label htmlFor="inSus">Generar el reporte en dolares?</Label>
          </div>
        </div>
        <div>
          <SelectAsync
            options={branches || []}
            label="Seleccione una sucursal..."
            nameGroup="Sucursales"
            labelKey={"nameSucutsal"}
            valueKey={"id"}
            value={branch}
            onChange={setBrach}
          />
        </div>

        {/* seccion para generar el reporte y descargar */}
        <div className="flex gap-4 py-3 flex-row justify-end w-full md:flex-col md:w-auto sm:justify-start">
          <ReportGeneratorFile
            dateRange={dateRange!}
            inSus={inSus}
            sucursalId={branch}
            reportNamePath="diarybook"
            setGeneratedFiles={setGeneratedFiles}
            setShowDialog={setShowDialog}
            setFile={setPdfFile}
          />
          {dateRange.from && dateRange.to && (
            <DiaryBookExcelButton dateRange={dateRange} inSus={inSus} sucursalId={branch} />
          )}
        </div>
      </div>

      {pdfFile && (
        <ButtonLinkPDF
          pdfFile={pdfFile}
          nameFile="R_libro_diario"
        />
      )}

      <div>
        {dateRange.from && dateRange.to && (
          <DiaryBookPreview dateRange={dateRange} inSus={inSus} sucursalID={branch} />
        )}
      </div>
      {/* alternativa para descargar  */}
      {/* <GeneratedFilesTable nameFile="l_diario" data={generatedFiles} /> */}
    </>
  );
}
