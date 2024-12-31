"use client";

import React, { useState } from "react";
import Select from "react-select"; // Asegúrate de tener react-select instalado
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAccountingBoxItemsById } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/accounting-box/components/columns";
import NewAccountingBoxDialog from "@/modules/accounting-box/components/NewAccountingBoxDialog";
import useAccountingBox from "@/modules/shared/hooks/useAccountingBox";
import CustomSelect from "@/components/custom/select";
import useAccountingBoxBalance from "@/modules/shared/hooks/useAccountingBoxBalance";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const AccountingBoxPage = () => {
  const [dateFilter, setDateFilter] = useState<
    | {
        range: DateRange;
        rangeCompare?: DateRange;
      }
    | undefined
  >();
  const [accountingBoxId, setAccountingBoxId] = useState<number | null>(null);

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

  if (isError) return <div>Error: {error.message}</div>;

  const accountingBoxOptions =
    (Array.isArray(accountingBoxList) ? accountingBoxList : []).map((box) => ({
      value: box.id,
      label: box.name,
    })) || [];

  const handleDateRangeChange = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    setDateFilter(values);
  };

  const filteredData =
    accountingBox?.filter((item) => {
      if (!dateFilter?.range?.from || !dateFilter?.range?.to) return true;
      const itemDate = new Date(item.fecha);
      return (
        itemDate >= dateFilter.range.from && itemDate <= dateFilter.range.to
      );
    }) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Caja</h1>
      <div className="flex justify-between items-center">
        <NewAccountingBoxDialog />
        <div>
          {isLoadingBalance || !balance ? (
            <span>Cargando saldo...</span>
          ) : (
            <span className="font-bold">Saldo: {balance.balance}</span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        {isPendingAccountingBoxList ? (
          <div>Cargando cajas...</div>
        ) : (
          <CustomSelect
            options={accountingBoxOptions}
            onChange={(selectedOption) =>
              setAccountingBoxId(selectedOption?.value || null)
            }
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
      {isPending ? (
        <div>Selecciona una Caja para mostrar sus datos...</div>
      ) : (
        <DataTable data={filteredData} columns={columns} />
      )}
    </div>
  );
};

export default AccountingBoxPage;
