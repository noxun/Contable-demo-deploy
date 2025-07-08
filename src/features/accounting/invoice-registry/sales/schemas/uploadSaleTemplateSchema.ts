import { z } from "zod";

export const uploadSaleTemplateSchema = z.object({
  file: z.instanceof(File).refine((file) => file.name.endsWith(".xlsx"), {
    message: "El archivo debe ser un archivo de Excel (.xlsx)",
  }),
});

export type UploadSaleTemplateSchema = z.infer<typeof uploadSaleTemplateSchema>;
