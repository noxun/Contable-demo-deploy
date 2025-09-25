import { z } from "zod";

export const uploadPurchaseTemplateSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(".xlsx"), {
      message: "El archivo debe ser un archivo de Excel (.xlsx)",
    }),
})

export type UploadPurchaseTemplateSchema = z.infer<typeof uploadPurchaseTemplateSchema>;