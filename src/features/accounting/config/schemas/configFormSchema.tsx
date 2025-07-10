import { z } from "zod";

export const configValuesSchema = z.object({
  id: z.number(),
  ufvValue: z.number(),
  dollarValue: z.number(),
  stateMain: z.boolean(),
  ivaValue: z.number(),
  itValue: z.number(),
  iceValue: z.number(),
  iehdValue: z.number(),
  itfValue: z.number(),
  tributosAduaneros: z.number(),
  ufvDate: z.string(),
  minimumWage: z.number(),
  accountImpId: z.number(),
  accountSaleId: z.number(),
  accountDebitIvaId: z.number(),
  accountImpByPayId: z.number(),
  accountCreditIvaId: z.number(),
});

export const configFormSchema = configValuesSchema.omit({ id: true }).extend({
  ufvValue: z.coerce.number(),
  dollarValue: z.coerce.number(),
  stateMain: z.boolean(),
  ivaValue: z.coerce.number(),
  itValue: z.coerce.number(),
  iceValue: z.coerce.number(),
  iehdValue: z.coerce.number(),
  itfValue: z.coerce.number(),
  tributosAduaneros: z.coerce.number(),
  ufvDate: z.string(),
  minimumWage: z.coerce.number(),
  accountImpId: z.coerce.number(),
  accountSaleId: z.coerce.number(),
  accountDebitIvaId: z.coerce.number(),
  accountImpByPayId: z.coerce.number(),
  accountCreditIvaId: z.coerce.number(),
});

export type ConfigValuesType = z.infer<typeof configValuesSchema>;

export type ConfigFormType = z.infer<typeof configFormSchema>;
