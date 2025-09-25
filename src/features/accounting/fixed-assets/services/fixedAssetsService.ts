import { api } from "@/lib/api"

export const fixedAssetsService = {
  async postFixedAssetAccount(name: string){
    const response = await api.post('/api/')
    return response.data;
  }
}