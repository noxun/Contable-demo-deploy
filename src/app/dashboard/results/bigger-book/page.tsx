"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, FileText, LoaderIcon, Sheet } from "lucide-react";
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
  DialogTrigger,
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
import { getApiReportExcel, getBigguerBookinExcel, numberToLiteral, searchByAccountBigguerBook } from "@/lib/data";
import { ReportExcelGenerate } from "@/modules/shared/components/ReportExcelGenerator";
import { formatNumber, ReportPaths } from "@/modules/shared/utils/validate";
import { useDebounce } from "use-debounce";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { SearchComponent } from "@/modules/shared/components/SearchComponent";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { ColumnDef } from "@tanstack/react-table";
import { BookBiggerData, BookBiggerDataVoucherItem } from "@/lib/types";

// Types
type VoucherItem = {
  accountId: number;
  id: number;
  createdAt: string;
  type: number;
  voucherId: number;
  voucherDate: string;
  description: string;
  gloss: string;
  debitBs: number;
  assetBs: number;
  debitSus: number;
  assetSus: number;
  typeDes?: string;
  totalSaldoSus: number;
  totalSaldoBs: number;
  hojaDeRuta?: string
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
const ReportGenerateBiggerBook = ({ data, dateRange, setFile, inSus, text, className }: { data: AccountData[], dateRange?: DateRange, setFile: (file: JSX.Element | null) => void, inSus: boolean, text?: string, className?: string }) => {
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
    <Button className={className} onClick={handleGenerateReport}>
      {isLoading ? 'Generando PDF...' : (text ? text : "Generar PDF")}
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

  const currentAccounts = currentSearchType === 'account' ? accountSearch : accountsData

  const currentAccount = currentAccounts?.[currentAccountIndex];

  // cambio a la moneda seleccionada
  const messages = {
    debitMsg: `Debe ${inSus ? "Sus" : "Bs"}`,
    assetMsg: `Haber ${inSus ? "Sus" : "Bs"}`,
    saldoMsg: `Saldo ${inSus ? "Sus" : "Bs"}`,
  };

  const { assetMsg, debitMsg, saldoMsg } = messages
  const debitValue = inSus ? "debitSus" : "debitBs"
  const assetValue = inSus ? "assetSus" : "assetBs"
  const saldoValue = inSus ? "totalSaldoSus" : "totalSaldoBs"

  const tDebitKey = inSus ? "totalDebitSus" : "totalDebit"
  const tAssetKey = inSus ? "totalAssetSus" : "totalAsset"
  const tSaldoKey = inSus ? "totalSaldoNumSus" : "totalSaldoNum"
  const tPreviousBalanceKey = inSus ? "previousBalanceSus" : "previousBalance"

  const handleChangeIsSus = () => setInSus(!inSus)

  const handleOnSelectedAccount = (accountCode: string) => {
    const foundIndex = currentAccounts?.findIndex((account: AccountData) =>
      account.accountCode.toLowerCase() === accountCode.toLowerCase()
    );
    setCurrentAccountIndex(foundIndex)
  }

  const columnsBook: ColumnDef<BookBiggerDataVoucherItem>[] = [
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ row }) =>
        format(new Date(row.original.voucherDate), "yyyy-MM-dd"),
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => {
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
      cell: ({ row }) => row.original.gloss || "sin glosa",
    },
    { header: "Hoja Ruta", accessorKey: "hojaDeRuta" },
    { header: debitMsg, accessorKey: "debitBs", cell: ({ row }) => formatNumber(row.original[debitValue]) },
    { header: assetMsg, accessorKey: "assetBs", cell: ({ row }) => formatNumber(row.original[assetValue]) },
    { header: saldoMsg, accessorKey: "totalSaldoBs", cell: ({ row }) => formatNumber(row.original[saldoValue]) },
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
      setCurrentAccountIndex(0)
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
        {/* <SearchComponent
          onSelect={handleSelect}
          debounceTime={700}
          suggestionKey="accountDescription"
          placeholder="Buscar por cuenta..."
          buttonLabel="Buscar por cuenta"
          queryFn={(search: string) =>
            searchByAccountBigguerBook(search)
          }
          resetSearch={resetSearch}
        /> */}
        {/* AUN FUNCIONA PERO SE DESHABILITO ESTA CARACTERISTICA */}
        <div className="flex items-center justify-evenly mt-5">
          <div className="space-y-2">
            <DateSelector onDateChange={handleDateChange} />
            <div className="flex items-center space-x-2">
              <Checkbox id="inSus" checked={inSus} onCheckedChange={handleChangeIsSus} />
              <Label htmlFor="inSus">Generar el reporte en dolares?</Label>
            </div>
          </div>

          <Button disabled={isLoadingAccounts}>
            {isLoadingAccounts
              ? "Listando Transacciones..."
              : "Ver Transacciones"}
          </Button>
        </div>
      </div>

      {(currentAccount) && (
        <>
          <div className="flex items-center gap-4">
            <ReportGenerateBiggerBook
              data={currentAccounts}
              dateRange={accountDate}
              setFile={setFile}
              inSus={inSus}
            />
            <BiggerBookExcelGenerate
              dateRange={accountDate}
              search={searchDescription}
              inSus={inSus}
            />
          </div>

          {/* <DownloadSingleAccountReportButton data={currentAccount} /> */}
          {file !== null && (
            <div style={{ height: "500px" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                {file}
              </PDFViewer>
            </div>
          )}

          <AccountInfo
            currentAccounts={currentAccounts}
            accountCode={currentAccount.accountCode}
            accountDescription={currentAccount.accountDescription}
            onSelectedAccountIndex={handleOnSelectedAccount}
          />

          <div className="relative flex justify-center">
            <Dialog >
              <DialogTrigger title={`Ver PDF de la cuenta de ${currentAccount.accountDescription}`}>
                <ReportGenerateBiggerBook
                  data={[currentAccount]}
                  dateRange={accountDate}
                  setFile={setActiveFile}
                  inSus={inSus}
                  text="Ver en PDF"
                  className="absolute right-0 bottom-0"
                />
              </DialogTrigger>
              <DialogContent className="min-w-[90vw] md:min-w-[70vw]">
                {
                  activeFile !== null && (
                    <div className="h-[500px]">
                      <PDFViewer style={{ width: "100%", height: "100%" }}>
                        {activeFile}
                      </PDFViewer>
                    </div>
                  )
                }
              </DialogContent>
            </Dialog>

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
          </div>

          <DataTable columns={columnsBook} data={currentAccount.voucherItems} />

          <div className="flex items-center justify-between">
            <AccountTotals
              totalDebit={currentAccount[tDebitKey]}
              totalAsset={currentAccount[tAssetKey]}
              totalSaldo={currentAccount[tSaldoKey]}
              totalPreviousBalance={currentAccount[tPreviousBalanceKey]}
            />
          </div>
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
  currentAccounts,
  accountCode,
  accountDescription,
  onSelectedAccountIndex
}: {
  currentAccounts: AccountData[]
  accountCode: string;
  accountDescription: string;
  onSelectedAccountIndex: (index: string) => void;
}) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedValue] = useDebounce(searchTerm, 400);
  const [filteredAccounts, setFilteredAccounts] = useState<AccountData[] | []>([])
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300));
    const filteredItems = currentAccounts.filter((account) => {
      return account.accountDescription.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setFilteredAccounts(filteredItems)
    setIsLoading(false)
  }

  useEffect(() => {
    handleOnSearch()
  }, [debouncedValue]);


  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="space-y-1">
        <p className="text-sm font-medium">Código de cuenta: {accountCode}</p>
        <p className="text-lg font-semibold">
          Descripción: {accountDescription}
        </p>
      </div>
      <div className="flex gap-2 relative">
        <Command shouldFilter={false} className="w-72">
          <CommandInput
            value={searchTerm}
            onValueChange={(value) => {
              console.log('cambiando: ', value.length > 0)
              setSearchTerm(value)
              setOpen(value.length > 0);
            }}
            placeholder="Buscar cuenta..."
          />
          {open && (
            <CommandList className="absolute z-50 top-full bg-white">
              {isLoading && (
                <CommandItem disabled>Cargando...</CommandItem>
              )}
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((item) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={item.accountCode}
                    value={item.accountCode}
                    onSelect={() => {
                      onSelectedAccountIndex(item.accountCode)
                      setSearchTerm(item.accountDescription)
                      setOpen(false)
                    }}
                  >
                    {item.accountDescription}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No hay resultados</CommandItem>
              )}
            </CommandList>
          )}
        </Command>
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
  totalSaldo,
  totalPreviousBalance,
}: {
  totalDebit: number;
  totalAsset: number;
  totalSaldo: number;
  totalPreviousBalance?: number;
}) => {
  return (
    <div className="flex justify-end gap-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Saldo Anterior</p>
        <p className="text-lg font-bold">{formatNumber(totalPreviousBalance ?? 0)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Debe:</p>
        <p className="text-lg font-bold">{formatNumber(totalDebit)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Haber:</p>
        <p className="text-lg font-bold">{formatNumber(totalAsset)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Saldo</p>
        <p className="text-lg font-bold">{formatNumber(totalSaldo)}</p>
      </div>
    </div>
  );
};

interface Props {
  dateRange: DateRange,
  inSus: boolean,
  search: string,
}

const BiggerBookExcelGenerate = ({ dateRange, search, inSus }: Props) => {


  const initialDate = dateRange.from && format(dateRange.from, "yyyy-MM-dd")
  const finallyDate = dateRange.to && format(dateRange.to, "yyyy-MM-dd")


  const { refetch, isLoading } = useQuery({
    queryKey: [dateRange, search],
    queryFn: () => getBigguerBookinExcel({
      initDate: initialDate,
      endDate: finallyDate,
      search: search,
      inSus
    }),
    enabled: false
  })

  const handleOnClick = async () => {
    toast.info('Generando Excel...')

    try {
      const { data: linkExcel } = await refetch()
      const fileUrl = linkExcel instanceof Blob ? URL.createObjectURL(linkExcel) : linkExcel;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "BookBiggerData.xlsx";
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      toast.error('Error al descargar el archivo.');
    }
  }

  return (
    <Button disabled={isLoading} className="flex gap-2 items-center" onClick={handleOnClick} >
      {isLoading ? (
        <><LoaderIcon className="animate-spin" />Cargando..</>
      ) : 'Generar Excel'}
    </Button>
  )
}
