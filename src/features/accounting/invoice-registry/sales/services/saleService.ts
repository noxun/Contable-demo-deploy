import { api } from "@/lib/api";
import { CreateSale, Sale, UpdateSale } from "../schemas/saleSchema";
import { ApplySaleAccountSchema } from "../schemas/applySaleAccountSchema";
import { UploadSaleTemplateSchema } from "../schemas/uploadSaleTemplateSchema";
import { format } from "date-fns";

export type PaginationInvoice = {
  CurrentPage: number;
  ItemsPerPage: number;
  TotalItems: number;
  TotalPages: number;
};

export const saleService = {
  async fetchSalesList(
    applyVoucher?: boolean,
    orderByDesc?: boolean,
    initDate?: Date,
    endDate?: Date,
    pageNumber?: number,
    pageSize?: number
  ) {
    const parsedInitDate = initDate
      ? format(initDate, "yyyy-MM-dd")
      : undefined;
    const parsedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : undefined;

    const response = await api.get("/api/Book/sale/list", {
      params: {
        applyVoucher,
        orderByDesc,
        parsedInitDate,
        parsedEndDate,
        pageNumber,
        pageSize,
      },
    });

    const pagination: PaginationInvoice = JSON.parse(
      response.headers["pagination"] || "{}"
    );

    return {
      data: response.data as Sale[],
      pagination,
    };
  },
  async postSale(data: CreateSale) {
    const response = await api.post("/api/Book/sale", data);
    return response.data as Sale;
  },
  async updateSale({ id, data }: { id: number; data: UpdateSale }) {
    const response = await api.put(`/api/Book/sale/${id}`, data);
    return response.data as Sale;
  },
  async uploadSaleTemplate(data: UploadSaleTemplateSchema) {
    const formData = new FormData();
    formData.append("file", data.file);
    const response = await api.post("/api/Book/sale/fill", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  async applySaleAccount(data: ApplySaleAccountSchema) {
    const response = await api.post("/api/Book/sale/apply-account", data);
    return response.data;
  },
  async generateSaleSeats(type: number) {
    const response = await api.post(
      "/api/Book/sale/generate-seats",
      {},
      {
        params: {
          type,
        },
      }
    );
    return response.data;
  },
  async downloadSalesTemplate() {
    const response = await api.get("/api/templates/standard-sales", {
      responseType: "blob",
    });
    return response.data;
  },
};
