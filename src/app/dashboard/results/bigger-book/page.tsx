"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, FileText, Sheet } from "lucide-react";
import { DateRange, isDateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, useCallback } from "react";
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
import { getApiReportExcel, numberToLiteral, searchByAccountBigguerBook } from "@/lib/data";
import { ReportExcelGenerate } from "@/modules/shared/components/ReportExcelGenerator";
import { ReportPaths } from "@/modules/shared/utils/validate";
import { useDebounce } from "use-debounce";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { SearchComponent } from "@/modules/shared/components/SearchComponent";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";

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
  totalSaldoSus: number;
  totalSaldoBs: number;
  hojaDeRuta: string
};

export type AccountData = {
  accountCode: string;
  accountDescription: string;
  voucherItems: VoucherItem[];
  totalDebit: number;
  totalAsset: number;
  totalSaldoNum: number;
  totalSaldoText: string;
  totalSaldoTextSus: string;
};


//Component for generate pdf file to biggerBook
const ReportGenerateBiggerBook = ({ data, dateRange, setFile, inSus, text }: { data: AccountData[], dateRange?: DateRange, setFile: (file: JSX.Element | null) => void, inSus: boolean, text?: string }) => {
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
  // un estado por el tipo de filtro o busqueda
  // un estado para elemento encontrado
  // un estado para limpiar el search
  const [accountSearch, setSearchAccount] = useState<any[] | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<'date' | 'account' | null>(null);
  const [resetSearch, setResetSearch] = useState(false)

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

  // hook para obtener los datos apartir de un rango de fechas
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
    enabled: !!accountDate?.from && !!accountDate?.to
  });

  const currentAccounts =
    currentSearchType === 'account' ? accountSearch : accountsData

  const currentAccount = currentAccounts?.[currentAccountIndex];


  const handleChangeIsSus = () => setInSus(!inSus)

  const handleSearch = () => {
    if (!searchDescription.trim()) {
      toast.error("Por favor ingrese una descripción para buscar");
      return;
    }

    const foundIndex = currentAccounts?.findIndex((account: AccountData) =>
      account.accountDescription
        .toLowerCase()
        .includes(searchDescription.toLowerCase())
    );

    if (foundIndex !== -1) {
      setCurrentAccountIndex(foundIndex);
      setActiveFile(null)
      toast.success(
        `Cuenta encontrada (${foundIndex + 1} de ${currentAccounts.length})`
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
    // { header: "Debe Sus", accessorKey: "debitSus" },
    // { header: "Haber Sus", accessorKey: "assetSus" },
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
      setCurrentSearchType("date")
      setFile(null)
      setResetSearch(true)
      setAccountDate({
        from: startDate,
        to: endDate
      })
    }
  };

  const handleSelect = (value: any) => {
    setResetSearch(false)
    setActiveFile(null)
    setFile(null)
    setAccountDate({ from: undefined, to: undefined })
    setCurrentSearchType('account')
    setSearchAccount([value])
  };

  return (
    <div className="space-y-6">
      {/* componente para buscar un recurso con una llamada a una api */}
      <div className="flex flex-col pt-2 gap-2">
        <SearchComponent
          onSelect={handleSelect}
          debounceTime={700}
          suggestionKey="accountDescription"
          placeholder="Buscar por cuenta..."
          buttonLabel="Buscar por cuenta"
          queryFn={(search: string) =>
            searchByAccountBigguerBook(search)
          }
          resetSearch={resetSearch}
        />
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
      </div>

      {currentAccount && (
        <>
          {
            accountDate?.from && accountDate.to && (
              <div className="flex items-center gap-4">
                <ReportGenerateBiggerBook
                  data={currentAccounts}
                  dateRange={accountDate}
                  setFile={setFile}
                  inSus={inSus}
                />
                <ReportExcelGenerate
                  dateRange={accountDate}
                  typeFile={ReportPaths.BookBigger}
                  inSus={inSus}
                />
              </div>
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
            total={currentAccounts?.length || 0}
            onPrevious={() => {
              setActiveFile(null)
              setCurrentAccountIndex((prev) => Math.max(0, prev - 1))
            }
            }
            onNext={() => {
              setActiveFile(null)
              setCurrentAccountIndex((prev) =>
                Math.min((currentAccounts?.length || 1) - 1, prev + 1)
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


function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 lg:gap-2 pb-2">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          return (
            <li key={href}>
              <div className="flex items-center">
                {index === 0 && (
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                )}
                {index > 0 && (
                  <>
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </>
                )}
                <Link
                  href={href}
                  className={`ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white  'text-gray-500 cursor-default' : ''
                    }`}
                >
                  {segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


// Main Component
export default function BiggerBookPage() {
  const currentPath = usePathname()


  return (
    <div className="flex flex-col gap-2 h-full">
      {/* <ReportSection /> */}

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
            label: "Libro Mayor",
            href: "/dashboard/results/bigger-book"
          }
        ]}
      />

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
