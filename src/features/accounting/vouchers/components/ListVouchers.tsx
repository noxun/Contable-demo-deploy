"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VoucherType, VoucherTypeRoute } from "../../shared/types/sharedTypes";
import VoucherTable from "../../shared/components/VoucherTable";
import { fetchVouchers } from "@/lib/data"; 
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";

import { getVoucherTypeRoute } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import VoucherPagination from "./VoucherPagination";
import VoucherFilters from "./VoucherFilters";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Esto permite que al recargar la página mantengamos los filtros desde la URL
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);
  const initialType = searchParams.get("type") ?? "0";
  const initialGloss = searchParams.get("gloss") ?? "";
  const initialInitDate = searchParams.get("init") ?? firstDayOfYear;
  const initialEndDate = searchParams.get("end") ?? today;

  const pageSize = 10;

  const [page, setPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState("");
  const [selectedOption, setSelectedOption] = useState(initialType);
  const [glossQuery, setGlossQuery] = useState(initialGloss);
  const [debouncedGlossQuery] = useDebounce(glossQuery, 800);
  const [initDate, setInitDate] = useState(initialInitDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  
  const updateQueryParams = (params: {
    page?: number;
    type?: string;
    gloss?: string;
    init?: string;
    end?: string;
  }) => {
    const newParams = new URLSearchParams();

    if (params.page && params.page !== 1) newParams.set("page", params.page.toString());
    if (params.type && params.type !== "0") newParams.set("type", params.type);
    if (params.gloss) newParams.set("gloss", params.gloss);
    if (params.init && params.init !== firstDayOfYear) newParams.set("init", params.init);
    if (params.end && params.end !== today) newParams.set("end", params.end);

    router.replace(`?${newParams.toString()}`);
  };

  // Conserva los valores iniciales de la URL para detectar cambios posteriores
  const initialValues = useRef({
    type: initialType,
    gloss: initialGloss,
    initDate: initialInitDate,
    endDate: initialEndDate
  });

  // Resetea a page=1 solo cuando el usuario cambia filtros (no en carga inicial)
  useEffect(() => {
    const hasFilterChanged = 
      selectedOption !== initialValues.current.type ||
      debouncedGlossQuery !== initialValues.current.gloss ||
      initDate !== initialValues.current.initDate ||
      endDate !== initialValues.current.endDate;

    if (hasFilterChanged) {
      setPage(1);
    }
  }, [selectedOption, debouncedGlossQuery, initDate, endDate]);

  //Actualiza los parámetros de la URL
  useEffect(() => {
    updateQueryParams({
      page,
      type: selectedOption,
      gloss: debouncedGlossQuery,
      init: initDate,
      end: endDate,
    });
  }, [page, selectedOption, debouncedGlossQuery, initDate, endDate]);

  const voucherType = selectedOption as VoucherType;
  const voucherTypeRoute = getVoucherTypeRoute(selectedOption) as VoucherTypeRoute;

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: [
      "Vouchers",
      voucherType,
      page,
      pageSize,
      initDate,
      endDate,
      debouncedGlossQuery + (glossSuffix ? `${glossSuffix}` : ""),
      siat,
    ],
    queryFn: () =>
      fetchVouchers(
        voucherType,
        page,
        pageSize,
        initDate,
        endDate,
        debouncedGlossQuery + (glossSuffix ? `${glossSuffix}` : ""),
        siat
      ),
    placeholderData: keepPreviousData,
  });

  if (isLoading || isPending) return <div>Cargando...</div>;

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
