"use client";

import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { DateSelector } from "@/modules/shared/components/DateSelector";
import { ReportExcelGenerate } from "@/modules/shared/components/ReportExcelGenerator";
import { formatNumber, ReportPaths } from "@/modules/shared/utils/validate";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { useQuery } from "@tanstack/react-query";
import { getAllDataBalanceGeneral, getAllDataReportByType } from "@/lib/data";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";
import { BalanceGeneralPreview } from "@/modules/results/components/BalanceGeneralPreview";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelData } from "@/modules/results/types/types";
import { LoaderIcon } from "lucide-react";
import { BalanceGeneralTemplate } from "@/modules/shared/components/templatePDF/BalanceGeneral";

export default function BalanceGeneralPage() {

  const [inSus, setInSus] = useState<boolean>(false);
  const [inSusSelected, setInSusSelected] = useState<boolean>(false);

  const [showDialog, setShowDialog] = useState(false);

  // --- Estados de los documentos para la tabla y el visor ---
  const [docs, setDocs] = useState<{ uri: string }[]>([]);

  /*
    Estos estados controlan la llave y el documento activo actual del visor
    debido a un error en la libreria, se necesita esto mas la funcion
    handleDocumentPage para rerenderizar el visor de archivos
    https://github.com/cyntler/react-doc-viewer/issues/161
    Probablemente esto sea arreglado en la proxima release de la libreria
    pero de momento este es el fix que se tiene.
   */
  const [viewerKey, setViewerKey] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

  useEffect(() => {
    setViewerKey((prevKey) => prevKey + 1);
  }, [docs]);

  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  }
  const [pdfFile, setPdfFile] = useState<JSX.Element | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [isLoadingBalanceGeneral, setIsLoadingBalanceGeneral] = useState(false)
  const [pendingLevel, setPendingLevel] = useState<LevelData>(1)
  const [selectedLevel, setSelectedLevel] = useState<LevelData>(1);


  const { data: dataBalanceGeneral, refetch: refetchBalanceGeneral } = useQuery({
    queryKey: ["AllBalanceGeneral"],
    queryFn: () => getAllDataBalanceGeneral({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typeFetchBalance: 2,
      level: pendingLevel,
      inSus
    }),
    enabled: false
  })

  const { refetch: refetchBalanceGeneralExcel, isFetching: isFetchingExcel } = useQuery({
    queryKey: ["AllBalanceGeneralExcel"],
    queryFn: () => getAllDataBalanceGeneral({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typeFetchBalance: 1,
      level: pendingLevel,
      inSus
    }),
    retry: 1,
    enabled: false
  })

  const handleOnDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null)
      setDateRange({
        from: startDate,
        to: endDate
      })
    }
  };

  const handleChangeIsSus = () => setInSus(!inSus)

  const handleOnGeneratePDF = async () => {
    setPdfFile(null)
    if (!dataBalanceGeneral) return
    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = (
        <BalanceGeneralTemplate
          currentLevel={selectedLevel}
          dateRange={dateRange}
          records={dataBalanceGeneral}
          inSus={inSusSelected}
        />
      );
      setPdfFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente")
    } finally {
      setIsLoadingPDF(false);
    }
  }

  const handleOnGenerateExcel = async () => {
    toast.info('Generando Excel...')

    try {
      const { data: linkExcel } = await refetchBalanceGeneralExcel()
      console.log('el excel aqui: ', linkExcel)

      if (!linkExcel) {
        throw new Error();
      }

      const link = document.createElement("a");
      link.href = linkExcel;
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al generar el archivo:", error);
      toast.error('Error al generar el archivo.');
    }
  }

  const handleOnRefetch = async () => {
    setIsLoadingBalanceGeneral(true)
    setSelectedLevel(pendingLevel)
    setInSusSelected(() => inSus)
    await refetchBalanceGeneral()
    setIsLoadingBalanceGeneral(false)
  }

  return (
    <>
      <div className="flex flex-col gap-6 h-full">
        <BreadcrumbDashboard
          items={[
            {
              label: "Panel",
              href: "/dashboard"
            },
            {
              label: "Reportes",
              href: "#"
            },
            {
              label: "Balance General",
              href: "/dashboard/results/balance-general"
            }
          ]}
        />
        <div className="flex flex-col items-start justify-evenly md:flex-row md:items-center">
          {/* Rango de fechas */}
          <div className="flex gap-2 flex-col">
            <DateSelector onDateChange={handleOnDateChange} />
            <div className="flex items-center space-x-2">
              <Checkbox id="inSus" checked={inSus} onCheckedChange={handleChangeIsSus} />
              <Label htmlFor="inSus">Generar el reporte en dolares?</Label>
            </div>
          </div>
          <div className="flex gap-4 py-3 flex-row justify-end lg:flex-row w-full md:flex-col md:w-auto sm:justify-start">
            <Select
              value={pendingLevel.toString()}
              onValueChange={(value) => setPendingLevel(Number(value) as LevelData)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecciona un nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Jerarquia</SelectLabel>
                  <SelectItem value="1">nivel 1</SelectItem>
                  <SelectItem value="2">nivel 2</SelectItem>
                  <SelectItem value="3">nivel 3</SelectItem>
                  <SelectItem value="4">nivel 4</SelectItem>
                  <SelectItem value="5">nivel 5</SelectItem>
                  <SelectItem value="6">nivel 6</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={handleOnRefetch} disabled={isLoadingBalanceGeneral}>
              {isLoadingBalanceGeneral ? "Cargando..." : "Ver Resultados"}
            </Button>
          </div>
        </div>
        {/* aqui generar el reporte */}
        <div className="flex gap-4 py-3 items-center">
          <Button
            onClick={handleOnGeneratePDF}
            disabled={!dataBalanceGeneral}
          >
            {isLoadingPDF ? 'Generando PDF...' : 'Generar PDF'}
          </Button>
          <Button
            className="w-fit flex gap-1 items-center"
            onClick={handleOnGenerateExcel}
            title={"Generar Excel"}
            disabled={isFetchingExcel || !dateRange.to}
          >
            {
              isFetchingExcel
                ? <><LoaderIcon className="animate-spin" />Cargando...</>
                : <>Generar Excel</>
            }

          </Button>
        </div>

        {/* Descargar pdf */}
        <div className="h-16 flex items-center">
          {pdfFile && (
            <ButtonLinkPDF
              pdfFile={pdfFile}
              nameFile="R_balance_general"
            />
          )}
        </div>
        {/* Vista Previa */}
      </div>
      {isLoadingBalanceGeneral && (
        <LoaderIcon className="mx-auto animate-spin size-10 text-[#2563EB]" />
      )}
      {
        dataBalanceGeneral && !isLoadingBalanceGeneral && (
          <div className="overflow-x-auto mx-auto w-[90vw] md:w-[900px] min-h-screen py-3">
            <div className="dark:text-[#bbbbbb] px-2">
              <BalanceGeneralPreview
                dateRange={dateRange}
                data={dataBalanceGeneral}
                currentLevel={selectedLevel}
                inSus={inSusSelected}
              />
            </div>
          </div>
        )
      }
    </>
  );
}
