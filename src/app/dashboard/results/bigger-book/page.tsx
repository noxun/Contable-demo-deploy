"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Sheet } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import axios from "axios";
import { es } from "date-fns/locale";
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

export default function BiggerBookPage() {
  // --- Estados del formulario ---
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [dateReport, setDateReport] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: addDays(new Date(2024, 0, 20), 20),
  });
  const [inSus, setInSus] = useState<boolean | "indeterminate">(false);

  // --- Estados de los links ---
  const [excelLink, setExcelLink] = useState<string | null>(null);
  const [pdfLink, setPdfLink] = useState<string | null>(null);

  // --- Estados de carga o visualización ---
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // --- Estados de los documentos para la tabla y el visor ---
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<
    { type: string; date: string; link: string }[]
  >([]);
  const [generatedFilesReports, setGeneratedFilesReports] = useState<
    {
      accountId: number;
      id: number;
      createdAt: string;
      type: string;
      voucherId: number;
      description: string;
      gloss: string;
      debitBs: number;
      assetBs: number;
      debitSus: number;
      assetSus: number;
    }[]
  >([]);

  const [accountCode, setAccountCode] = useState<string>("");
  const [accountDescription, setAccountDescription] = useState<string>("");
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0);
  const [responseData, setResponseData] = useState<any[]>([]);

  // --- Estados para el visor ---
  const [viewerKey, setViewerKey] = useState(0);
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document: any) => {
    setActiveDocument(document);
    setViewerKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setViewerKey((prevKey) => prevKey + 1);
  }, [docs]);

  // --- Lógica para generar reportes ---
  const handleClick = async () => {
    if (date?.from && date?.to) {
      setIsLoading(true);
      setExcelLink(null);
      setPdfLink(null);
      setDocs([]);
      toast("Generando reporte...");
      try {
        const excelResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/BiggerBook`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              type: "xlsx",
              inSus: inSus,
              businessId: 0,
            },
            responseType: "text",
          }
        );

        const pdfResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/BiggerBook`,
          {
            params: {
              InitDate: format(date.from, "yyyy/MM/dd"),
              EndDate: format(date.to, "yyyy/MM/dd"),
              type: "pdf",
              inSus: inSus,
              businessId: 0,
            },
            responseType: "text",
          }
        );

        const currentDate = new Date().toLocaleString();
        if (pdfResponse.data) {
          setPdfLink(pdfResponse.data);
          setDocs((prevDocs) => [...prevDocs, { uri: pdfResponse.data }]);
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "PDF",
              date: currentDate,
              link: pdfResponse.data,
            },
          ]);
        }
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
  };

  // --- Lógica para mostrar las transacciones de la cuenta actual ---
  const handleClickReport = async () => {
    if (dateReport?.from && dateReport?.to) {
      setIsLoading(true);
      toast("Listando Transacciones...");
      try {
        const reportResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/BookBiggerData`,
          {
            params: {
              InitDate: format(dateReport?.from, "yyyy/MM/dd"),
              EndDate: format(dateReport?.to, "yyyy/MM/dd"),
              type: "json",
              inSus: inSus,
              businessId: 0,
            },
            responseType: "json", 
          }
        );

        if (reportResponse.data && Array.isArray(reportResponse.data)) {
          setResponseData(reportResponse.data);         
          const firstAccount = reportResponse.data[0]; 
          setAccountCode(firstAccount.accountCode);
          setAccountDescription(firstAccount.accountDescription);

          const vouchers = firstAccount.voucherItems.map((item: any) => ({
            accountId: firstAccount.accountId, 
            id: item.id,
            createdAt: item.createdAt,
            type: item.type,
            voucherId: item.voucherId,
            description: item.description,
            gloss: item.gloss || "Sin glosa",
            debitBs: item.debitBs || 0,
            debitSus: item.debitSus || 0,
            assetBs: item.assetBs || 0,
            assetSus: item.assetSus || 0,
          }));

          setGeneratedFilesReports(vouchers); 
          setCurrentAccountIndex(0); 
          toast.success("Reporte generado exitosamente");
        } else {
          toast.error("La respuesta está mal formateada o vacía.");
        }
      } catch (error) {
        console.error("Error al generar el reporte:", error);
        toast.error("Error al generar el reporte, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Por favor, selecciona un rango de fechas.");
    }
  };

  // Botón "Siguiente" para cambiar de cuenta
  const handleNextAccount = () => {
    if (currentAccountIndex < responseData.length - 1) {
      setCurrentAccountIndex(currentAccountIndex + 1);
      const account = responseData[currentAccountIndex + 1];
      setAccountCode(account.accountCode);
      setAccountDescription(account.accountDescription);

      // Actualizar los vouchers de la nueva cuenta
      const accountData = responseData[currentAccountIndex + 1];
      const vouchers = accountData.voucherItems.map((item: any) => ({
        accountId: item.accountId,
        id: item.id,
        createdAt: item.createdAt,
        type: item.type,
        voucherId: item.voucherId,
        description: item.description,
        gloss: item.gloss || "Sin glosa",
        debitBs: item.debitBs || 0,
        debitSus: item.debitSus || 0,
        assetBs: item.assetBs || 0,
        assetSus: item.assetSus || 0,
      }));

      setGeneratedFilesReports(vouchers);
    }
  };

  // Botón "Anterior" para cambiar de cuenta
  const handlePreviousAccount = () => {
    if (currentAccountIndex > 0) {
      setCurrentAccountIndex(currentAccountIndex - 1);
      const account = responseData[currentAccountIndex - 1];
      setAccountCode(account.accountCode);
      setAccountDescription(account.accountDescription);

      // Actualizar los vouchers de la nueva cuenta
      const accountData = responseData[currentAccountIndex - 1];
      const vouchers = accountData.voucherItems.map((item: any) => ({
        accountId: item.accountId,
        id: item.id,
        createdAt: item.createdAt,
        type: item.type,
        voucherId: item.voucherId,
        description: item.description,
        gloss: item.gloss || "Sin glosa",
        debitBs: item.debitBs || 0,
        assetBs: item.assetBs || 0,
        debitSus: item.debitSus || 0,
        assetSus: item.assetSus || 0,
      }));

      setGeneratedFilesReports(vouchers);
    }
  };

  // Función para Editar
  const handleEdit = (id: number, type: number) => {
    console.log("Editar ID:", id, "Editar tipo:", type);
  };

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

  const columnsBook = [
    { header: "ID", accessorKey: "accountId" },
    { header: "ID Vocher", accessorKey: "id" },
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ row }: any) => {
        return format(new Date(row.original.createdAt), "yyyy-MM-dd");
      },
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }: any) => {
        const type = row.original.type;
        if (type === 1) return "Egreso";
        if (type === 0) return "Traspaso";
        if (type === 2) return "Ingreso";
        return "Desconocido";
      },
    },
    { header: "N° Doc", accessorKey: "voucherId" },
    { header: "Descripción", accessorKey: "description" },
    {
      header: "Glosa",
      accessorKey: "gloss",
      cell: ({ row }: any) => {
        const gloss = row.original.gloss;
        return gloss === "" ? "sin glosa" : gloss;
      },
    },
    { header: "Debe Bs", accessorKey: "debitBs" },
    { header: "Haber Bs", accessorKey: "assetBs" },
    { header: "Debe Sus", accessorKey: "debitSus" },
    { header: "Haber Sus", accessorKey: "assetSus" },
    {
      header: "Acciones",
      accessorKey: "",
      cell: ({ row }: any) => (
        <Button
          onClick={() => handleEdit(row.original.id, row.original.type)}
          className="bg-blue-500 text-white"
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-evenly">
        <div className="w-72 space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y", { locale: es })
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                locale={es}
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center space-x-2">
            <Checkbox id="inSus" checked={inSus} onCheckedChange={setInSus} />
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>
        <Button onClick={handleClick} disabled={isLoading}>
          {isLoading ? "Generando Reporte..." : "Generar Reporte"}
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
            {pdfLink && (
              <Button onClick={() => window.open(pdfLink ?? "", "_self")}>
                <FileText className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={generatedFiles} />

      {/* Segunda función de fechas con botón */}
      <div className="flex mt-7 justify-start text-[25px] font-[500]">
        <h1>Reportes</h1>
      </div>
      <div className="flex items-center justify-evenly mt-6">
        <div className="w-72 space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dateReport"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateReport && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateReport?.from ? (
                  dateReport.to ? (
                    <>
                      {format(dateReport.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(dateReport.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(dateReport.from, "LLL dd, y", { locale: es })
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                locale={es}
                defaultMonth={dateReport?.from}
                selected={dateReport}
                onSelect={setDateReport}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleClickReport} disabled={isLoading}>
          {isLoading ? "Listando Transacciones..." : "Ver Transacciones"}
        </Button>
      </div>

      {/* Mostrar el Código de Cuenta y la Descripción de la Cuenta */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center mt-3">
          <Label htmlFor="accountCode">Código de Cuenta</Label>
          <input
            type="text"
            id="accountCode"
            value={accountCode}
            readOnly
            className="border px-4 py-2"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Label htmlFor="accountDescription">Descripción de Cuenta</Label>
          <input
            type="text"
            id="accountDescription"
            value={accountDescription}
            readOnly
            className="border px-4 py-2"
          />
        </div>
      </div>
      {/* Botones para navegar entre cuentas */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={handlePreviousAccount}
          disabled={currentAccountIndex === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNextAccount}
          disabled={currentAccountIndex === responseData.length - 1}
        >
          Siguiente
        </Button>
      </div>

      <DataTable columns={columnsBook} data={generatedFilesReports} />

      <DocViewer
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
        key={viewerKey}
        style={{ height: 1000 }}
        documents={docs}
        pluginRenderers={[PDFRenderer, MSDocRenderer]}
        language="es"
      />
    </div>
  );
}
