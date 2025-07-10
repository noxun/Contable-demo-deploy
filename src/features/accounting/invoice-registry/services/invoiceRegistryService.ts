import { api } from "@/lib/api";
import { CompanyNitData } from "../schemas/companyNitDataSchema";

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
};
