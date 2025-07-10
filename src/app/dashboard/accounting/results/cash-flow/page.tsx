"use client";
import { addDays, format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { BreadcrumbDashboard } from "@/features/accounting/shared/components/BreadcrumDash";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CashFlowTemplate } from "@/features/accounting/shared/components/templatePDF/CashFlow";
import { ButtonLinkPDF } from "@/features/accounting/results/components/ButtonLinkPDF";
import { DateSelector } from "@/features/accounting/shared/components/DateSelector";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBranches,
} from "@/lib/data";
import { formatNumber } from "@/features/accounting/shared/utils/validate";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LevelData } from "@/features/accounting/results/types/types";
import { CashFlowPreview } from "@/features/accounting/results/components/CashFlowPreview";
import { SelectAsync } from "@/features/accounting/results/components/SelectAsync";
import { DownloadTemplatesButton } from "@/components/download-templates/download-templates";
import { getWorkSheetCashFlowData, getAllDataCashFlow } from "@/features/accounting/cash-flow/services/service";
import { UploadFinancialFilesDialog } from "@/features/accounting/cash-flow/components/UploadFinancialFilesDialog";
import { DialogWorkSheet } from "@/features/accounting/cash-flow/components/DialogWorkSheet";


export default function ClashFlowPage() {
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  };

  const [pdfFile, setPdfFile] = useState<JSX.Element | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isLoadingCashFlow, setIsLoadingCashFlow] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<LevelData>(1);
  const [branch, setBranch] = useState<string | undefined>(undefined);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: dataCashFlow, refetch: refetchCashFlow } = useQuery({
    queryKey: ["AllCashFlow", dateRange.from, dateRange.to, pendingLevel, branch],
    queryFn: () =>
      getAllDataCashFlow({
        iDate: format(dateRange.from || new Date(), "yyyy-MM-dd"),
        eDate: format(dateRange.to || new Date(), "yyyy-MM-dd"),
        level: pendingLevel,
        typeFetchBalance: 2,
        sucursalId: branch,
      }),
    enabled: false,
  });

  const {
    data: dataCashFlowExcel,
    refetch: refetchCashFlowExcel,
    isRefetching: isRefetchingExcel,
  } = useQuery({
    queryKey: ["AllCashFlowExcel", dateRange.from, dateRange.to, branch],
    queryFn: () =>
      getAllDataCashFlow({
        iDate: format(dateRange.from || new Date(), "yyyy-MM-dd"),
        eDate: format(dateRange.to || new Date(), "yyyy-MM-dd"),
        typeFetchBalance: 1,
        sucursalId: branch,
      }),
    enabled: false,
  });

  const handleOnDateChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      if (startDate && endDate) {
        setPdfFile(null);
        setDateRange({
          from: startDate,
          to: endDate,
        });
      }
    },
    []
  );

  const handleOnGeneratePDF = async () => {
    setPdfFile(null);
    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = <CashFlowTemplate />;
      setPdfFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente");
    } finally {
      setIsLoadingPDF(false);
    }
  };

  // const handleOnGenerateExcel = async () => {
  //   toast.info("Generando Excel...");

  //   try {
  //     const { data: linkExcel } = await refetchCashFlowExcel();

  //     if (!linkExcel) {
  //       throw new Error();
  //     }

  //     const link = document.createElement("a");
  //     link.href = linkExcel;
  //     toast.success("Archivo generado...");
  //     link.click();
  //   } catch (error) {
  //     console.error("Error al generar el archivo:", error);
  //     toast.error("Error al generar el archivo.");
  //   }
  // };

  const handleOnRefetch = async () => {
    setIsLoadingCashFlow(true);
    try {
      await refetchCashFlow();
      console.log("tenemos los datos de: ", dataCashFlow);
      toast.success("Reporte de flujo de efectivo generado exitosamente");
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Error al generar el reporte de flujo de efectivo");
    } finally {
      setIsLoadingCashFlow(false);
    }
  };
  const messageDate = "Del 2024/01/01";

  return (
    <div className="flex flex-col gap-6 h-full">
      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard/accounting",
          },
          {
            label: "Reportes",
            href: "#",
          },
          {
            label: "Flujo de efectivo",
            href: "/dashboard/accounting/results/cash-flow",
          },
        ]}
      />
      <div className="flex items-center flex-col md:flex-row justify-center gap-6">
        <DateSelector onDateChange={handleOnDateChange} />
        <div className="flex items-center flex-wrap gap-4">
          <SelectAsync
            options={branches || []}
            label="Sucursal..."
            nameGroup="Sucursales"
            labelKey={"nameSucutsal"}
            valueKey={"id"}
            value={branch}
            onChange={setBranch}
          />
          <Select
            value={pendingLevel.toString()}
            onValueChange={(value) =>
              setPendingLevel(Number(value) as LevelData)
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Jerarquia</SelectLabel>
                <SelectItem value="6">nivel 1</SelectItem>
                <SelectItem value="5">nivel 2</SelectItem>
                <SelectItem value="4">nivel 3</SelectItem>
                <SelectItem value="3">nivel 4</SelectItem>
                <SelectItem value="2">nivel 5</SelectItem>
                <SelectItem value="1">nivel 6</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleOnRefetch} disabled={isLoadingCashFlow}>
            {isLoadingCashFlow ? "Cargando..." : "Ver Resultados"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* <Button
          onClick={handleOnGeneratePDF}
          className="w-fit"
        >
          {isLoadingPDF
            ? (<><LoaderIcon className="animate-spin" /> Generando PDF</>)
            : 'Generar PDF'}
        </Button> */}
        {/* <Button
          className="w-fit flex gap-1 items-center"
          onClick={handleOnGenerateExcel}
          title={"Generar Excel"}
          disabled={isRefetchingExcel || !dateRange}
        >
          {isRefetchingExcel ? (
            <>
              <LoaderIcon className="animate-spin" />
              Cargando...
            </>
          ) : (
            <>Generar Excel</>
          )}
        </Button> */}
        <DownloadTemplatesButton />
        <DialogWorkSheet/>
        <UploadFinancialFilesDialog />
      </div>

      {/* <div>
        {
          pdfFile && (
            <ButtonLinkPDF
              pdfFile={pdfFile}
            // nameFile="R_balance_general"
            />
          )
        }
      </div> */}

      {dataCashFlow && (
        <CashFlowPreview
          dateRange={dateRange}
          data={dataCashFlow}
        />
      )}
    </div>
  );
}
