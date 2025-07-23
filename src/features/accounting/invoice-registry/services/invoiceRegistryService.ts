import { api } from "@/lib/api";
import { CompanyNitData } from "../schemas/companyNitDataSchema";
import { format } from "date-fns";

export const invoiceRegistryService = {
  async fetchCompanyNitData(filter: "byBuy" | "bySale") {
    const response = await api.get("/api/Book/companies-register", {
      params: {
        byBuy: filter === "byBuy",
        bySale: filter === "bySale",
      },
    });
    return response.data as CompanyNitData[];
  },
  async generateExcelReport(
    type: "sale" | "buy",
    applyVoucher?: boolean,
    orderByDesc?: boolean,
    initDate?: Date,
    endDate?: Date
  ) {
    const formattedInitDate = initDate
      ? format(initDate, "yyyy-MM-dd")
      : undefined;

    const formattedEndDate = endDate
      ? format(endDate, "yyyy-MM-dd")
      : undefined;

    const response = await api.get(`/api/Book/${type}/xlsx`, {
      responseType: "text",
      params: {
        ApplyVoucher: applyVoucher,
        OrderByDesc: orderByDesc,
        InitDate: formattedInitDate,
        EndDate: formattedEndDate,
      },
    });
    return response.data as string;
  },
  async generateSingleSeat(params: { bookId: number; type: "sale" | "buy" }) {
    const { bookId, type } = params;
    const response = await api.post(
      `/api/Book/generate-seat/${bookId}/${type}`,
      {}
    );
    return response.data;
  },
  async deleteAllBookDataWithoutGeneratedSeats(type: "sale" | "buy") {
    const response = await api.delete(`/api/Book/without-voucher/${type}`);
    return response.data;
  },
};
