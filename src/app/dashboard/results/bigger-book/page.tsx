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
import EditVoucher from "@/modules/shared/components/EditVoucher";
import { VoucherType } from "@/modules/shared/types/sharedTypes";
import { useQuery } from "@tanstack/react-query";
import DownloadSingleAccountReportButton from "./DownloadSingleAccountReportButton";
import { BiggerBookTemplate } from "@/modules/shared/components/templatePDF/BiggerBook";
import { PDFViewer } from "@react-pdf/renderer";
import { DateSelector } from "@/modules/shared/components/DateSelector";

// Types
type VoucherItem = {
  accountId: number;
  id: number;
  createdAt: string;
  type: number;
  voucherId: number;
  description: string;
  gloss: string;
  debitBs: number;
  assetBs: number;
  debitSus: number;
  assetSus: number;
  totalDebit: number;
  totalAsset: number;
  typeDes?: string;
};

export type AccountData = {
  accountCode: string;
  accountDescription: string;
  voucherItems: VoucherItem[];
  totalDebit: number;
  totalAsset: number;
};


//Component for generate pdf file to biggerBook
const ReportGenerateBiggerBook = ({ data, dateRange, setFile, inSus, text }: { data: AccountData[], dateRange: DateRange, setFile: (file: JSX.Element | null) => void, inSus: boolean, text?: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {

    try {
      setIsLoading(true);
      toast("Generando reporte...");
      const MyDocument = (
        <BiggerBookTemplate
          inSus={inSus}
          dateRange={dateRange}
          records={data}
        />
      );
      setFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente")
    } finally {
      setIsLoading(false);
    }
  }

  return <>
    <Button onClick={handleGenerateReport}>
      {isLoading ? 'Generando Reporte...' : (text ? text : "Generar Reporte")}
    </Button>
  </>
}


// AccountSection Component
const AccountSection = () => {
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  }
  const [accountDate, setAccountDate] = useState<DateRange>(initialDateRange);
  const [file, setFile] = useState<JSX.Element | null>(null)
  const [searchDescription, setSearchDescription] = useState<string>("");
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [inSus, setInSus] = useState(false)
  const [activeFile, setActiveFile] = useState<JSX.Element | null>(null)
  const [editData, setEditData] = useState<{
    id: string;
    type: VoucherType;
  } | null>(null);

  // React Query Hook
  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["bookBiggerData", JSON.stringify(accountDate)], //stringify para que react query compare el valor de la cadena, ya que no puede comparar objetos
    queryFn: async () => {
      if (!accountDate?.from || !accountDate?.to) return null;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/BookBiggerData`,
        {
          params: {
            InitDate: format(accountDate.from, "yyyy/MM/dd"),
            EndDate: format(accountDate.to, "yyyy/MM/dd"),
            type: "json",
            businessId: 0,
          },
        }
      );
      return response.data;
    },
    enabled: !!accountDate?.from && !!accountDate?.to,
  });

  const currentAccount = accountsData?.[currentAccountIndex];

  const handleChangeIsSus = () => {
    setInSus(!inSus)
  }

  const handleSearch = () => {
    if (!searchDescription.trim()) {
      toast.error("Por favor ingrese una descripción para buscar");
      return;
    }

    const foundIndex = accountsData?.findIndex((account: AccountData) =>
      account.accountDescription
        .toLowerCase()
        .includes(searchDescription.toLowerCase())
    );

    if (foundIndex !== -1) {
      setCurrentAccountIndex(foundIndex);
      setActiveFile(null)
      toast.success(
        `Cuenta encontrada (${foundIndex + 1} de ${accountsData.length})`
      );
    } else {
      toast.error("No se encontró ninguna cuenta con esa descripción");
    }
  };

  const columnsBook = [
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ row }: any) =>
        format(new Date(row.original.createdAt), "yyyy-MM-dd"),
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
      cell: ({ row }: any) => row.original.gloss || "sin glosa",
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
          onClick={() => {
            setEditData({
              id: row.original.voucherId,
              type: row.original.type,
            });
            setDialogOpen(true);
          }}
          className="bg-blue-500 text-white"
        >
          Editar
        </Button>
      ),
    },
  ];
  //metodo para cambiar la fecha
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setFile(null)
      setAccountDate({
        from: startDate,
        to: endDate
      })
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-evenly mt-5">
        <div className="space-y-2">
          <DateSelector onDateChange={handleDateChange} />
          <div className="flex items-center space-x-2">
            <Checkbox id="inSus" checked={inSus} onCheckedChange={handleChangeIsSus} />
            <Label htmlFor="inSus">Devolver el reporte en dolares?</Label>
          </div>
        </div>

        <Button disabled={isLoadingAccounts}>
          {isLoadingAccounts
            ? "Listando Transacciones..."
            : "Ver Transacciones"}
        </Button>
      </div>

      {currentAccount && accountDate?.from && accountDate.to && (
        <>
          {
            accountDate?.from && accountDate.to && (
              <ReportGenerateBiggerBook
                data={accountsData}
                dateRange={accountDate}
                setFile={setFile}
                inSus={inSus}
              />
            )
          }
          {/* <DownloadSingleAccountReportButton data={currentAccount} /> */}
          {file !== null && (
            <div style={{ height: "500px" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                {file}
              </PDFViewer>
            </div>
          )}

          <AccountInfo
            accountCode={currentAccount.accountCode}
            accountDescription={currentAccount.accountDescription}
            searchDescription={searchDescription}
            onSearchChange={setSearchDescription}
            onSearch={handleSearch}
          />

          <AccountNavigation
            currentIndex={currentAccountIndex}
            total={accountsData?.length || 0}
            onPrevious={() => {
              setActiveFile(null)
              setCurrentAccountIndex((prev) => Math.max(0, prev - 1))
            }
            }
            onNext={() => {
              setActiveFile(null)
              setCurrentAccountIndex((prev) =>
                Math.min((accountsData?.length || 1) - 1, prev + 1)
              )
            }
            }
          />

          <DataTable columns={columnsBook} data={currentAccount.voucherItems} />

          <div className="flex items-center justify-between">
            <ReportGenerateBiggerBook
              data={[currentAccount]}
              dateRange={accountDate}
              setFile={setActiveFile}
              inSus={inSus}
              text="Ver en PDF"
            />
            <AccountTotals
              totalDebit={currentAccount.totalDebit}
              totalAsset={currentAccount.totalAsset}
            />
          </div>

          {activeFile !== null && (
            <div style={{ height: "500px" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                {activeFile}
              </PDFViewer>
            </div>
          )}

        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl">
          <h2 className="text-lg font-bold">Formulario para editar Egreso</h2>
          {editData && (
            <EditVoucher
              id={editData.id}
              type={editData.type}
              accountDate={JSON.stringify(accountDate)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Component
export default function BiggerBookPage() {
  return (
    <div className="flex flex-col gap-2 h-full">
      {/* <ReportSection /> */}

      <div className="flex justify-start text-[25px] font-[500]">
        <h1>Reportes</h1>
      </div>

      <AccountSection />
    </div>
  );
}

// Account Components
const AccountInfo = ({
  accountCode,
  accountDescription,
  searchDescription,
  onSearchChange,
  onSearch,
}: {
  accountCode: string;
  accountDescription: string;
  searchDescription: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="space-y-1">
        <p className="text-sm font-medium">Código de cuenta: {accountCode}</p>
        <p className="text-lg font-semibold">
          Descripción: {accountDescription}
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchDescription}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por descripción..."
          className="px-3 py-2 border rounded-md"
        />
        <Button onClick={onSearch}>Buscar</Button>
      </div>
    </div>
  );
};

const AccountNavigation = ({
  currentIndex,
  total,
  onPrevious,
  onNext,
}: {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button onClick={onPrevious} disabled={currentIndex === 0}>
        Anterior
      </Button>
      <span className="text-sm">
        Cuenta {currentIndex + 1} de {total}
      </span>
      <Button onClick={onNext} disabled={currentIndex === total - 1}>
        Siguiente
      </Button>
    </div>
  );
};

const AccountTotals = ({
  totalDebit,
  totalAsset,
}: {
  totalDebit: number;
  totalAsset: number;
}) => {
  return (
    <div className="flex justify-end gap-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Debe:</p>
        <p className="text-lg font-bold">{totalDebit.toFixed(2)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Haber:</p>
        <p className="text-lg font-bold">{totalAsset.toFixed(2)}</p>
      </div>
    </div>
  );
};
