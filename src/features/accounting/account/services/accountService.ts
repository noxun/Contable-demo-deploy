import { api } from "@/lib/api"

export const accountService = {
  async exportAccountsToExcel(){
    const response = await api.get('/api/Account/ExportAccountXlxs', {
      responseType: 'text'
    })
    return response.data as string;
  }
}