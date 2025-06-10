"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { DateSelector } from "@/features/accounting/shared/components/DateSelector";
import { fetchBranches } from "@/lib/data";
import { formatNumber } from "@/features/accounting/shared/utils/validate";
import { SelectAsync } from "@/features/accounting/results/components/SelectAsync";
import EditVoucher from "@/features/accounting/shared/components/EditVoucher";
import { VoucherType } from "@/features/accounting/shared/types/sharedTypes";
import ExportSingleAccountToExcelButton from "@/features/accounting/bigger-book/components/ExportSingleAccountToExcelButton";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { BookBiggerDataVoucherItem } from "@/lib/types";
import { AccountData } from "../types";
import { ReportGenerateBiggerBook } from "./ReportGenerateBiggerBook";
import { AccountInfo } from "./AccountInfo";
import { AccountNavigation } from "./AccountNavigation";
import { AccountTotals } from "./AccountTotals";
import { BiggerBookExcelGenerate } from "./BiggerBookExcelGenerate";

export const AccountSection = () => {
  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  };
  // un estado por el tipo de filtro o busqueda
  // un estado para elemento encontrado
  // un estado para limpiar el search
  const [accountSearch, setSearchAccount] = useState<any[] | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<
    "date" | "account" | null
  >(null);
  const [resetSearch, setResetSearch] = useState(false);

  const [accountDate, setAccountDate] = useState<DateRange>(initialDateRange);
  const [file, setFile] = useState<JSX.Element | null>(null);
  const [searchDescription, setSearchDescription] = useState<string>("");
  const [currentAccountIndex, setCurrentAccountIndex] = useState<number>(0);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [inSus, setInSus] = useState(false);
  const [branch, setBrach] = useState<string | undefined>(undefined);
  const [activeFile, setActiveFile] = useState<JSX.Element | null>(null);
  const [editData, setEditData] = useState<{
    id: string;
    type: VoucherType;
  } | null>(null);
  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  // hook para obtener los datos apartir de un rango de fechas
  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["bookBiggerData", JSON.stringify(accountDate), branch], //stringify para que react query compare el valor de la cadena, ya que no puede comparar objetos
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
            ...(branch ? { sucursalId: branch } : {}),
          },
        }
      );
      return response.data;
    },
    enabled: !!accountDate?.from && !!accountDate?.to,
  });

  const currentAccounts =
    currentSearchType === "account" ? accountSearch : accountsData;

  const currentAccount = currentAccounts?.[currentAccountIndex];

  // cambio a la moneda seleccionada
  const messages = {
    debitMsg: `Debe ${inSus ? "Sus" : "Bs"}`,
    assetMsg: `Haber ${inSus ? "Sus" : "Bs"}`,
    saldoMsg: `Saldo ${inSus ? "Sus" : "Bs"}`,
  };

  const { assetMsg, debitMsg, saldoMsg } = messages;
  const debitValue = inSus ? "debitSus" : "debitBs";
  const assetValue = inSus ? "assetSus" : "assetBs";
  const saldoValue = inSus ? "totalSaldoSus" : "totalSaldoBs";

  const tDebitKey = inSus ? "totalDebitSus" : "totalDebit";
  const tAssetKey = inSus ? "totalAssetSus" : "totalAsset";
  const tSaldoKey = inSus ? "totalSaldoNumSus" : "totalSaldoNum";
  const tPreviousBalanceKey = inSus ? "previousBalanceSus" : "previousBalance";

  const handleChangeIsSus = () => setInSus(!inSus);

  const handleOnSelectedAccount = (accountCode: string) => {
    const foundIndex = currentAccounts?.findIndex(
      (account: AccountData) =>
        account.accountCode.toLowerCase() === accountCode.toLowerCase()
    );
    setCurrentAccountIndex(foundIndex);
  };

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
    {
      header: debitMsg,
      accessorKey: "debitBs",
      cell: ({ row }) => formatNumber(row.original[debitValue]),
    },
    {
      header: assetMsg,
      accessorKey: "assetBs",
      cell: ({ row }) => formatNumber(row.original[assetValue]),
    },
    {
      header: saldoMsg,
      accessorKey: "totalSaldoBs",
      cell: ({ row }) => formatNumber(row.original[saldoValue]),
    },
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
  const handleDateChange = useCallback(
    (startDate: Date | null, endDate: Date | null) => {
      if (startDate && endDate) {
        setCurrentSearchType("date");
        setCurrentAccountIndex(0);
        setFile(null);
        setResetSearch(true);
        setAccountDate({
          from: startDate,
          to: endDate,
        });
      }
    },
    []
  );
  const handleSelect = (value: any) => {
    setResetSearch(false);
    setActiveFile(null);
    setFile(null);
    setAccountDate({ from: undefined, to: undefined });
    setCurrentSearchType("account");
    setSearchAccount([value]);
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

          <Button disabled={isLoadingAccounts}>
            {isLoadingAccounts
              ? "Listando Transacciones..."
              : "Ver Transacciones"}
          </Button>
        </div>
      </div>

      {currentAccount && (
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

          <div className="flex justify-between w-full">
            <Dialog>
              <DialogTrigger
                title={`Ver PDF de la cuenta de ${currentAccount.accountDescription}`}
              >
                <ReportGenerateBiggerBook
                  data={[currentAccount]}
                  dateRange={accountDate}
                  setFile={setActiveFile}
                  inSus={inSus}
                  text="Ver en PDF"
                />
              </DialogTrigger>
              <DialogContent className="min-w-[90vw] md:min-w-[70vw]">
                {activeFile !== null && (
                  <div className="h-[500px]">
                    <PDFViewer style={{ width: "100%", height: "100%" }}>
                      {activeFile}
                    </PDFViewer>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <AccountNavigation
              currentIndex={currentAccountIndex}
              total={currentAccounts?.length || 0}
              onPrevious={() => {
                setActiveFile(null);
                setCurrentAccountIndex((prev) => Math.max(0, prev - 1));
              }}
              onNext={() => {
                setActiveFile(null);
                setCurrentAccountIndex((prev) =>
                  Math.min((currentAccounts?.length || 1) - 1, prev + 1)
                );
              }}
            />

            <ExportSingleAccountToExcelButton
              account={currentAccount}
              initDate={format(accountDate.from!, "yyyy/MM/dd")}
              endDate={format(accountDate.to!, "yyyy/MM/dd")}
              inSus={inSus}
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
