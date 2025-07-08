import { z } from "zod";

export const generateSaleSeatFormSchema = z.object({
  type: z.coerce
    .number()
    .int()
    .min(1, "Debe seleccionar una modalidad de generación de asientos"),
});

export type GenerateSaleSeatFormSchema = z.infer<
  typeof generateSaleSeatFormSchema
>;
