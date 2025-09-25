import { z } from "zod";

export const ufvSchema = z.object({
  tc: z.string(),
  ufv: z.string(),
})

export const configValuesToRegisterSchema = z.object({
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
})

export const ufvRegisterFormSchema = configValuesToRegisterSchema.pick({
  ufvValue: true,
  dollarValue: true,
})

export type Ufv = z.infer<typeof ufvSchema>;
export type UfvRegister = z.infer<typeof ufvRegisterFormSchema>;
export type NewConfigValues = z.infer<typeof configValuesToRegisterSchema>;