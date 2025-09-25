import { api } from "@/lib/api";
import type { VoucherFile, UploadVoucherFiles } from "../schemas/voucherFileSchema";

export const voucherFileService = {
  uploadFiles: async (data: UploadVoucherFiles): Promise<VoucherFile[]> => {
    const formData = new FormData();
    formData.append("voucherId", data.voucherId.toString());
    
    data.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await api.post(`/vouchers/${data.voucherId}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getVoucherFiles: async (voucherId: number): Promise<VoucherFile[]> => {
    const response = await api.get(`/vouchers/${voucherId}/files`);
    return response.data;
  },

  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/voucher-files/${fileId}`);
  },
};