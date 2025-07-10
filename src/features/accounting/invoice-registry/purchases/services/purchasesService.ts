import { api } from "@/lib/api";
import {
  CreatePurchase,
  Purchase,
  UpdatePurchase,
} from "../schemas/purchaseSchema";
import { UploadPurchaseTemplateSchema } from "../schemas/uploadPurchaseTemplateSchema";
import { ApplyAccountSchema } from "../schemas/applyAccountSchema";

export const purchasesService = {
  async fetchPurchasesList() {
    const response = await api.get("/api/Book/buy/list");
    return response.data as Purchase[];
  },
  async postPurchase(data: CreatePurchase) {
    const response = await api.post("/api/Book/buy", data);
    return response.data as Purchase;
  },
  async updatePurchase({ id, data }: { id: number; data: UpdatePurchase }) {
    const response = await api.put(`/api/Book/buy/${id}`, data);
    return response.data as Purchase;
  },
  async uploadPurchaseTemplate(data: UploadPurchaseTemplateSchema) {
    const formData = new FormData();
    formData.append("file", data.file);
    const response = await api.post("/api/Book/buy/fill", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  async applyPurchaseAccount(data: ApplyAccountSchema) {
    const response = await api.post("/api/Book/buy/apply-account", data);
    return response.data;
  },
  async generatePurchaseSeats(type: number) {
    const response = await api.post(
      "/api/Book/buy/generate-seats",
      {},
      {
        params: {
          type,
        },
      }
    );
    return response.data;
  },
  async downloadPurchaseTemplate() {
    const response = await api.get("/api/templates/standard-purchase-template", {
      responseType: "blob",
    });
    return response.data;
  },
};
