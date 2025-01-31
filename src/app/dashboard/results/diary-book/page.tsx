"use client";

import { DateRange } from "react-day-picker";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateSelector } from "@/modules/shared/components/DateSelector";
import { ReportGeneratorFile } from "@/modules/shared/components/ReportGeneratorFile";
import { PDFDownloadLink, PDFViewer, usePDF } from "@react-pdf/renderer";
import { GeneratedFilesTable } from "@/modules/shared/components/GeneratedFilesTable";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import DiaryBookPreview from "./DiaryBookPreview";
import { Button } from "@/components/ui/button";
import useDiaryBookExcel from "@/modules/shared/hooks/useDiaryBookExcel";
import DiaryBookExcelButton from "./DiaryBookExcelButton";

export default function DiaryBookPage() {
  // --- Estados del formulario ---
  // fecha
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  };
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [pdfFile, setPdfFile] = useState<React.JSX.Element | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [inSus, setInSus] = useState(false);
  const [excelEnabled, setExcelEnabled] = useState(false);

  const handleChangeIsSus = () => setInSus(!inSus);

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null);
      setDateRange({
        from: startDate,
        to: endDate,
      });
    }
  };

  return (
    <>
      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard",
          },
          {
            label: "Result",
            href: "#",
          },
          {
            label: "Libro Diario",
            href: "/dashboard/results/diary-book",
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
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>
        {/* seccion para generar el reporte y descargar */}
        <div className="flex gap-4 py-3 flex-row justify-end w-full md:flex-col md:w-auto sm:justify-start">
          <ReportGeneratorFile
            dateRange={dateRange!} // Asegúrate de que `dateRange` no sea `undefined` aquí
            inSus={inSus}
            reportNamePath="diarybook" // Ruta del reporte en el backend
            setGeneratedFiles={setGeneratedFiles}
            setShowDialog={setShowDialog}
            setFile={setPdfFile} // Pasas la función para guardar el PDF generado
          />
          {!pdfFile ? (
            <Button disabled>Descargar PDF</Button>
          ) : (
            <Button asChild>
              <PDFDownloadLink document={pdfFile} fileName="diarybook.pdf">
                Descargar PDF
              </PDFDownloadLink>
            </Button>
          )}
          {pdfFile && dateRange.from && dateRange.to && (
            <DiaryBookExcelButton dateRange={dateRange} inSus={inSus} />
          )}
        </div>
      </div>

      <div>
        {dateRange.from && dateRange.to && (
          <DiaryBookPreview dateRange={dateRange} inSus={inSus} />
        )}
      </div>
      {/* alternativa para descargar  */}
      {/* <GeneratedFilesTable nameFile="l_diario" data={generatedFiles} /> */}
    </>
  );
}
