import { z } from "zod";

export const voucherFileSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
});

export const uploadVoucherFilesSchema = z.object({
  voucherId: z.number(),
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
});

export type VoucherFile = z.infer<typeof voucherFileSchema>;
export type UploadVoucherFiles = z.infer<typeof uploadVoucherFilesSchema>;