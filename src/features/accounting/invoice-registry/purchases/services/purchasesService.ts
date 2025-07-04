import { api } from "@/lib/api";
import {
  CreatePurchase,
  Purchase,
  UpdatePurchase,
} from "../schemas/purchaseSchema";

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
};
