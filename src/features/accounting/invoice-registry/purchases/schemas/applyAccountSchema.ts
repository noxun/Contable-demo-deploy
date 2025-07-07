import { z } from "zod";

export const applyAccountFormSchema = z.object({
  mode: z.enum(["one","nit","all"], {
    required_error: "El modo de aplicar la cuenta es requerido",
  }).default("one"),
  accountDebitId: z.coerce.number().int().positive().min(1, "Debe seleccionar una cuenta débito"),
  accountAssetId: z.coerce.number().int().positive().min(1, "Debe seleccionar una cuenta haber"),
  id: z.coerce.number().int().positive().nullable(),
  nit: z.coerce.number().nullable(),
  all: z.boolean(),
});

export const applyAccountSchema = applyAccountFormSchema.omit({
  mode: true,
})

export type ApplyAccountSchema = z.infer<typeof applyAccountSchema>;
export type ApplyAccountFormSchema = z.infer<typeof applyAccountFormSchema>;