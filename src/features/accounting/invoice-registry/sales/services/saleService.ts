import { api } from "@/lib/api";
import { CreateSale, Sale, UpdateSale } from "../schemas/saleSchema";
import { ApplySaleAccountSchema } from "../schemas/applySaleAccountSchema";
import { UploadSaleTemplateSchema } from "../schemas/uploadSaleTemplateSchema";

export const saleService = {
  async fetchSalesList() {
    const response = await api.get("/api/Book/sale/list");
    return response.data as Sale[];
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
