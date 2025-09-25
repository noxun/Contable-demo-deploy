import { z } from "zod";

export const applySaleAccountFormSchema = z.object({
  mode: z
    .enum(["one", "nit", "all"], {
      required_error: "El modo de aplicar la cuenta es requerido",
    })
    .default("one"),
  accountDebitId: z.coerce
    .number()
    .int()
    .positive()
    .min(1, "Debe seleccionar una cuenta débito"),
  id: z.coerce.number().int().positive().nullable(),
  nit: z.coerce.number().nullable(),
  all: z.boolean(),
});

export const applySaleAccountSchema = applySaleAccountFormSchema.omit({
  mode: true,
});

export type ApplySaleAccountSchema = z.infer<typeof applySaleAccountSchema>;
export type ApplySaleAccountFormSchema = z.infer<
  typeof applySaleAccountFormSchema
>;
