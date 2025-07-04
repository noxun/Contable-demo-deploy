import { z } from "zod";

export const applyAccountSchema = z.object({
  accountDebitId: z.coerce.number().int().positive(),
  accountAssetId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive().nullable(),
  nit: z.coerce.number().nullable(),
  all: z.boolean(),
});

export type ApplyAccountSchema = z.infer<typeof applyAccountSchema>;