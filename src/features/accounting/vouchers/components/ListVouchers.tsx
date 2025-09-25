"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VoucherType, VoucherTypeRoute } from "../../shared/types/sharedTypes";
import VoucherTable from "../../shared/components/VoucherTable";
import { fetchVouchers } from "../services/voucherService";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";

import { getVoucherTypeRoute } from "@/lib/utils";
import VoucherPagination from "./VoucherPagination";
import VoucherFilters from "./VoucherFilters";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useVouchers } from "../hooks/useVouchers";

type ListVouchersProps = {
  siat?: "siat" | "";
  glossSuffix?: string;
};

const firstDayOfYear = format(
  new Date(new Date().getFullYear(), 0, 1),
  "yyyy-MM-dd"
);
const today = format(new Date(), "yyyy-MM-dd");

export default function ListVouchers({
  siat = "",
  glossSuffix = "",
}: ListVouchersProps) {

  const pageSize = 10;

  // Estados con nuqs - se sincronizan automáticamente con la URL
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [selectedOption, setSelectedOption] = useQueryState('type', parseAsString.withDefault('0'));
  const [glossQuery, setGlossQuery] = useQueryState('gloss', parseAsString.withDefault(''));
  const [initDate, setInitDate] = useQueryState('init', parseAsString.withDefault(firstDayOfYear));
  const [endDate, setEndDate] = useQueryState('end', parseAsString.withDefault(today));
  
  // Estado local para paginación input y debounce
  const [inputPage, setInputPage] = useQueryState('inputPage', parseAsString.withDefault(''));
  const [debouncedGlossQuery] = useDebounce(glossQuery, 800);

  //para rastrear los valores iniciales y detectar cambios reales del usuario
  const initialValues = useRef({
    selectedOption,
    glossQuery,
    initDate,
    endDate,
    isInitialized: false
  });

  // Resetea a page=1 solo cuando el usuario cambia filtros (no en carga inicial)
  useEffect(() => {
    if (!initialValues.current.isInitialized) {
      initialValues.current = {
        selectedOption,
        glossQuery,
        initDate,
        endDate,
        isInitialized: true
      };
      return;
    }

    // Verifica si algún filtro cambió después de la inicialización
    const hasFilterChanged = 
      selectedOption !== initialValues.current.selectedOption ||
      debouncedGlossQuery !== initialValues.current.glossQuery ||
      initDate !== initialValues.current.initDate ||
      endDate !== initialValues.current.endDate;

    if (hasFilterChanged) {
      setPage(1);
      initialValues.current = {
        selectedOption,
        glossQuery: debouncedGlossQuery,
        initDate,
        endDate,
        isInitialized: true
      };
    }
  }, [selectedOption, debouncedGlossQuery, initDate, endDate, setPage]);

  const voucherType = selectedOption as VoucherType;
  const voucherTypeRoute = getVoucherTypeRoute(selectedOption) as VoucherTypeRoute;

  const { data, isLoading, isPending, error } = useVouchers({
    voucherType,
    page,
    pageSize,
    initDate,
    endDate,
    gloss: debouncedGlossQuery,
    siat,
    glossSuffix,
  });

  if (isLoading || isPending || !data) return <div>Cargando...</div>;

  if (error)
    return "Ocurrió un error al obtener los vouchers: " + error.message;

  const vouchers = data?.data ?? [];
  const pagination = data.pagination;

  const handleGlossSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlossQuery(e.target.value);
  };

  const handleDateRangeChange = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    console.log(values);

    if (values?.range?.from && values?.range?.to) {
      setInitDate(format(values.range.from, "yyyy-MM-dd"));
      setEndDate(format(values.range.to, "yyyy-MM-dd"));
      setPage(1);
    } else {
      setInitDate("");
      setEndDate("");
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold absolute">Transacciones</h2>
      <VoucherFilters
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        glossQuery={glossQuery}
        onGlossSearch={handleGlossSearch}
        initDate={initDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
      />
      <VoucherTable
        voucherType={voucherType}
        voucherTypeRoute={voucherTypeRoute}
        data={vouchers ?? []}
      />
      {pagination && (
        <VoucherPagination
          page={page}
          setPage={setPage}
          inputPage={inputPage}
          setInputPage={setInputPage}
          pagination={pagination}
        />
      )}
    </section>
  );
}
