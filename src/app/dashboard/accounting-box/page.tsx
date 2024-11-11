"use client";

import React, { useState } from "react";
import Select from "react-select"; // Asegúrate de tener react-select instalado
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAccountingBoxItemsById } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/modules/accounting-box/components/columns";
import NewAccountingBoxDialog from "@/modules/accounting-box/components/NewAccountingBoxDialog";
import useAccountingBox from "@/modules/shared/hooks/useAccountingBox";

const AccountingBoxPage = () => {
  const [accountingBoxId, setAccountingBoxId] = useState<number | null>(null);

  const { data: accountingBoxList, isPending: isPendingAccountingBoxList } =
    useAccountingBox();

  const {
    data: accountingBox,
    isPending,
    error,
  } = useQuery({
    queryKey: ["accountingBox", accountingBoxId],
    queryFn: () => fetchAccountingBoxItemsById(accountingBoxId!),
    enabled: !!accountingBoxId, // Solo ejecuta la query si hay un ID seleccionado
    placeholderData: keepPreviousData
  });

  if (error) return <div>Error: {error.message}</div>;

  const accountingBoxOptions =
    accountingBoxList?.map((box) => ({
      value: box.id,
      label: box.name,
    })) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Caja</h1>
      <NewAccountingBoxDialog />

      {isPendingAccountingBoxList ? (
        <div>Cargando cajas...</div>
      ) : (
        <Select
          options={accountingBoxOptions}
          onChange={(selectedOption) =>
            setAccountingBoxId(selectedOption?.value || null)
          }
          isClearable
          placeholder="Selecciona una caja"
        />
      )}

      {isPending ? (
        <div>Cargando datos de la caja...</div>
      ) : (
        <DataTable data={accountingBox} columns={columns} />
      )}
    </div>
  );
};

export default AccountingBoxPage;
