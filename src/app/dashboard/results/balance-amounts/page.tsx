"use client";
import "@cyntler/react-doc-viewer/dist/index.css";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Sheet } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DocViewer, {
  PDFRenderer,
  MSDocRenderer,
} from "@cyntler/react-doc-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { useQuery } from "@tanstack/react-query";
import { getAllDataReportByType } from "@/lib/data";
import { DateSelector } from "@/modules/shared/components/DateSelector";
import { BalanceAmountsTemplate } from "@/modules/shared/components/templatePDF/BalanceAmounts";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";
import { formatNumber } from "@/modules/shared/utils/validate";
import { DataTableCustom } from "@/modules/shared/components/DataTableCustom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelData } from "@/modules/results/types/types";


export default function BalanceAmountsPage() {
  const [inSus, setInSus] = useState<boolean>(false);
  // --- Estados de los links ---
  const [excelLink, setExcelLink] = useState<string | null>(null);
  // const [pdfLink, setPdfLink] = useState<string | null>(null);

  // --- Estados de carga o visualizacion ---
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // --- Estados de los documentos para la tabla y el visor ---
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<
    { type: string; date: string; link: string }[]
  >([]);

  /*
    Estos estados controlan la llave y el documento activo actual del visor
    debido a un error en la libreria, se necesita esto mas la funcion
    handleDocumentPage para rerenderizar el visor de archivos
    https://github.com/cyntler/react-doc-viewer/issues/161
    Probablemente esto sea arreglado en la proxima release de la libreria
    pero de momento este es el fix que se tiene.
   */
  const [viewerKey, setViewerKey] = useState(0);
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document: any) => {
    setActiveDocument(document);
    setViewerKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setViewerKey((prevKey) => prevKey + 1);
  }, [docs]);

  //version modificada
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  }
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange)

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null)
      setDateRange({
        from: startDate,
        to: endDate
      })
    }
  };
  const handleChangeIsSus = () => setInSus(!inSus)

  const [pdfFile, setPdfFile] = useState<JSX.Element | null>(null)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<LevelData>(2)

  const [isLoadingBalanceAmounts, setIsLoadingBalanceAmounts] = useState(false)


  const { data: BalanceAmounts, refetch: refetchBalanceAmounts } = useQuery({
    queryKey: ["AllBalanceAmounts"],
    queryFn: () => getAllDataReportByType({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typePath: "balanceDeSumas",
      level: selectedLevel
    }),
    enabled: false
  })

  //excel
  const handleOnClickExcel = async () => {
    setIsLoading(true);
    setExcelLink(null);
    setDocs([]);
    toast("Generando reporte...");
    try {
      // Generar el reporte de Excel
      if (!dateRange.from || !dateRange.to) return
      const excelResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/Xlxs/balanceDeSumas`,
        {
          params: {
            InitDate: format(dateRange.from, "yyyy/MM/dd"),
            EndDate: format(dateRange.to, "yyyy/MM/dd"),
            Level: selectedLevel,
            inSus: inSus,
          },
          responseType: "text",
        }
      );

      const currentDate = new Date().toLocaleString();

      if (excelResponse.data) {
        setExcelLink(excelResponse.data);
        setDocs((prevDocs) => [...prevDocs, { uri: excelResponse.data }]);
        setGeneratedFiles((prevFiles) => [
          ...prevFiles,
          {
            type: "Excel",
            date: currentDate,
            link: excelResponse.data,
          },
        ]);
      }
      setShowDialog(true);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      console.error("Error al generar los reportes", error);
      toast.error("Error al generar el reporte, intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOnGeneratePDF = async () => {
    setPdfFile(null)
    if (!BalanceAmounts) return
    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = (
        <BalanceAmountsTemplate
          dateRange={dateRange}
          records={BalanceAmounts}
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

  const handleOnRefetch = async () => {
    setIsLoadingBalanceAmounts(true)
    await refetchBalanceAmounts()
    setIsLoadingBalanceAmounts(false)
  }

  const columns = [
    { header: "Tipo", accessorKey: "type" },
    { header: "Fecha", accessorKey: "date" },
    {
      header: "Enlace",
      accessorKey: "link",
      cell: ({ row }: any) => (
        <a href={row.original.link} target="_blank" rel="noopener noreferrer">
          Descargar
        </a>
      ),
    },
  ];

  const columnsBalanceAmounts = [
    {
      header: "Cuenta",
      accessorKey: "type",
      cell: ({ row }: any) => row.original.code
    },
    {
      header: "Nombre",
      accessorKey: "description",
      cell: ({ row }: any) => row.original.description
    },
    {
      header: "Debe",
      accessorKey: "debit",
      cell: ({ row }: any) => formatNumber(row.original.debit)
    },
    {
      header: "Haber",
      accessorKey: "asset",
      cell: ({ row }: any) => formatNumber(row.original.asset)
    },
    {
      header: "Deudor",
      accessorKey: "debtor",
      cell: ({ row }: any) => formatNumber(row.original.debtor)
    },
    {
      header: "Acreedor",
      accessorKey: "creditor",
      cell: ({ row }: any) => formatNumber(row.original.creditor)
    },
  ];

  return (
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
            label: "Balance de sumas y saldos",
            href: "/dashboard/results/balance-amounts"
          }
        ]}
      />
      <div className="flex flex-col items-start justify-evenly md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <DateSelector onDateChange={handleDateChange} />
          <div className="flex items-center space-x-2">
            <Checkbox id="inSus" checked={inSus} onCheckedChange={handleChangeIsSus} />
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>
        <div className="flex gap-4 py-3 flex-row justify-end lg:flex-row w-full md:flex-col md:w-auto sm:justify-start">
          <Select
            value={selectedLevel.toString()}
            onValueChange={(value) => setSelectedLevel(Number(value) as LevelData)}
          >
            <SelectTrigger className="w-[150px]">
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
          <Button onClick={handleOnRefetch} disabled={isLoadingBalanceAmounts}>
            {isLoadingBalanceAmounts ? "Cargando..." : "Ver Resultados"}
          </Button>
        </div>
      </div>
      <div className="flex gap-4 py-3 items-center">
        <Button onClick={handleOnClickExcel} disabled={isLoading}>
          {isLoading ? "Generando Reporte..." : "Generar Reporte"}
        </Button>
        <Button
          onClick={handleOnGeneratePDF}
          disabled={!BalanceAmounts}
        >
          {isLoadingPDF ? 'Generando PDF...' : 'Generar PDF'}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {/* Comentado pero podria ser util si se requiere en algun momento */}
        {/* <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Mostrar Links
          </Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archivos Generados</DialogTitle>
            <DialogDescription>
              Puedes descargar los reportes generados a continuación:
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-4">
            {excelLink && (
              <Button onClick={() => window.open(excelLink ?? "", "_self")}>
                <Sheet className="mr-2 h-4 w-4" /> Descargar Excel
              </Button>
            )}
            {/* {pdfLink && (
              <Button onClick={() => window.open(pdfLink ?? "", "_self")}>
                <FileText className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
            )} */}
          </div>
        </DialogContent>
      </Dialog>
      {pdfFile && (
        <ButtonLinkPDF
          pdfFile={pdfFile}
          nameFile="R_sumas_y_saldos"
        />
      )}
      <DataTable columns={columns} data={generatedFiles} />
      {
        BalanceAmounts?.items && (
          <>
            <DataTableCustom
              columns={columnsBalanceAmounts}
              data={BalanceAmounts.items}
              filter={{
                columnName: "description",
                placeholder: "Buscar por cuenta...",
                type: "text"
              }}
            />
            <div className="flex gap-4 justify-end items-center ">
              {
                [
                  { label: 'Debe', value: BalanceAmounts?.asset },
                  { label: 'Haber', value: BalanceAmounts?.debit },
                  { label: 'Deudor', value: BalanceAmounts?.debtor },
                  { label: 'Acreedor', value: BalanceAmounts?.creditor },
                ].map((item, index) => (
                  <div key={index} className="pb-6" >
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-lg font-bold">{formatNumber(item.value)}</p>
                  </div>
                ))
              }
            </div>
          </>
        )
      }
      {/* <DocViewer
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
        key={viewerKey}
        style={{ height: "100%" }}
        documents={docs}
        pluginRenderers={[PDFRenderer, MSDocRenderer]}
        language="es"
      /> */}
    </div>
  );
}
