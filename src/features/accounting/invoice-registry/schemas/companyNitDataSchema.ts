import z from "zod";

export const companyNitDataSchema = z.object({
  nit: z.string().nullable(),
  name: z.string().nullable(),
});

export type CompanyNitData = z.infer<typeof companyNitDataSchema>;
