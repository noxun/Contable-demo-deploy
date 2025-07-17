import {
  parseAsIsoDate,
  parseAsBoolean,
  useQueryState,
  parseAsInteger,
} from "nuqs";
import { parseAsLocalDate } from "../lib/parseAsLocalDate";

export function useInvoiceFilters() {
  const [applyVoucher, setApplyVoucher] = useQueryState(
    "applyVoucher",
    parseAsBoolean.withDefault(false)
  );
  const [orderByDesc, setOrderByDesc] = useQueryState(
    "orderByDesc",
    parseAsBoolean.withDefault(false)
  );
  const [initDate, setInitDate] = useQueryState("initDate", parseAsLocalDate);
  const [endDate, setEndDate] = useQueryState("endDate", parseAsLocalDate);

  const [pageNumber, setPageNumber] = useQueryState(
    "pageNumber",
    parseAsInteger.withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  );

  console.log("Dates:", {
    initDate,
    endDate,
  });

  return {
    filters: {
      applyVoucher,
      orderByDesc,
      initDate,
      endDate,
      pageNumber,
      pageSize,
    },
    setters: {
      setApplyVoucher,
      setOrderByDesc,
      setInitDate,
      setEndDate,
      setPageNumber,
      setPageSize,
    },
  };
}
