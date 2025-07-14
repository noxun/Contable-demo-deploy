import { z } from "zod";

export const generatePurchaseSeatFormSchema = z.object({
  type: z.coerce
    .number()
    .int()
    // .min(1, "Debe seleccionar una modalidad de generación de asientos"),
});

export type GeneratePurchaseSeatFormSchema = z.infer<
  typeof generatePurchaseSeatFormSchema
>;
