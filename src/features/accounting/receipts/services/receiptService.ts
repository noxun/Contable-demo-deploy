import { api } from "@/lib/api"
import { Receipt, StoreReceipt } from "../schemas/receiptSchema"

export const receiptService = {
  async fetchReceipts() {
    const response = await api.get('/api/Receipt')
    return response.data as Receipt[]
  },

  async fetchReceipt(id: number) {
    const response = await api.get(`/api/Receipt/${id}`)
    return response.data as Receipt
  },

  async createReceipt(receipt: StoreReceipt) {
    const response = await api.post('/api/Receipt', receipt)
    return response.data as Receipt
  },
  
  async updateReceipt(params: { id: number; receipt: StoreReceipt }) {
    const { id, receipt } = params
    const response = await api.patch(`/api/Receipt/${id}`, receipt)
    return response.data as Receipt
  },

  async deleteReceipt(id: number) {
    await api.delete(`/api/Receipt/${id}`)
  }
}