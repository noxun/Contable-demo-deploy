"use client";

import React, { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAccountingBoxItemsById } from "@/lib/data";
import NewAccountingBoxDialog from "@/features/accounting/accounting-box/components/NewAccountingBoxDialog";
import useAccountingBox from "@/features/accounting/accounting-box/hooks/useAccountingBox";
import CustomSelect from "@/components/custom/select";
import useAccountingBoxBalance from "@/features/accounting/accounting-box/hooks/useAccountingBoxBalance";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { numberWithDecimals } from "@/features/accounting/shared/utils/validate";
import { AccountingBox } from "@/lib/types";
import BiggerBookByAccountCodeDialog from "@/features/accounting/bigger-book/components/BiggerBookByAccountCodeDialog";
import BiggerBookTable from "@/features/accounting/bigger-book/components/BiggerBookTableByAccountCode";

const AccountingBoxPage = () => {
  const [dateFilter, setDateFilter] = useState<
    | {
        range: DateRange;
        rangeCompare?: DateRange;
      }
    | undefined
  >();
  const [accountingBoxId, setAccountingBoxId] = useState<number | null>(null);
  const [selectedAccountingBox, setSelectedAccountingBox] =
    useState<AccountingBox | null>(null);

  const { data: accountingBoxList, isPending: isPendingAccountingBoxList } =
    useAccountingBox();

  const {
    data: accountingBox,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["accountingBox", accountingBoxId],
    queryFn: () => fetchAccountingBoxItemsById(accountingBoxId!),
    enabled: !!accountingBoxId, // Solo ejecuta la query si hay un ID seleccionado
    placeholderData: keepPreviousData,
  });

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useAccountingBoxBalance(accountingBoxId);

  const filteredData = useMemo(() => {
    return accountingBox?.filter((item) => {
      if (!dateFilter?.range?.from || !dateFilter?.range?.to) return true;
      const itemDate = new Date(item.fecha);
      return (
        itemDate >= dateFilter.range.from && itemDate <= dateFilter.range.to
      );
    }) ?? [];
  }, [accountingBox, dateFilter]);

  if (isError) return <div>Error: {error.message}</div>;

  const handleDateRangeChange = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    setDateFilter(values);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Caja</h1>
      <div className="flex justify-between items-center">
        <NewAccountingBoxDialog />

        <div>
          {isLoadingBalance || !balance ? (
            <span>Cargando saldo...</span>
          ) : (
            <span className="font-bold">
              Saldo: {numberWithDecimals(balance.balance)}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        {isPendingAccountingBoxList ? (
          <div>Cargando cajas...</div>
        ) : (
          <CustomSelect
            options={Array.isArray(accountingBoxList) ? accountingBoxList : []}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id.toString()}
            onChange={(selectedOption) => {
              setAccountingBoxId(selectedOption?.id || null);
              setSelectedAccountingBox(selectedOption || null);
              console.log(selectedOption);
            }}
            isClearable
            placeholder="Selecciona una caja"
          />
        )}
        <DateRangePicker
          showCompare={false}
          locale="es-ES"
          onUpdate={handleDateRangeChange}
        />
      </div>
      {isPending || !selectedAccountingBox ? (
        <div>Selecciona una Caja para mostrar sus datos...</div>
      ) : (
        <div className="flex flex-col gap-4">
          <BiggerBookByAccountCodeDialog accountCode={selectedAccountingBox.account.code}/>
          <BiggerBookTable accountCode={selectedAccountingBox.account.code} />
          {/* <DataTable data={filteredData} columns={columns} /> */}
        </div>
      )}
    </div>
  );
};

export default AccountingBoxPage;

