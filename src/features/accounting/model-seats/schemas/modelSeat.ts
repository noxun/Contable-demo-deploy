import { z } from "zod";

export const modelSeatItemSchema = z.object({
  debit: z.boolean(),
  asset: z.boolean(),
  percentage: z.coerce.number().min(0).max(100),
  accountId: z.coerce.number(),
});

export const modelSeatFormSchema = z.object({
  description: z.string().min(1).max(100),
  typeTransaction: z.enum(["ingresos", "egresos", "diarios"]).optional(),
  type: z.coerce.number(),
  accounts: z.array(modelSeatItemSchema).min(1),
});