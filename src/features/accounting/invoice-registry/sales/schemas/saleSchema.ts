import { z } from "zod";

const accountSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string().nullable(),
});

export const saleSchema = z.object({
  id: z.number(),
  number: z.number(),
  specification: z.number(),
  invoiceDate: z.string().datetime(),
  invoiceNumber: z.number(),
  authorizationCode: z.string().nullable(),
  clientNitCi: z.string().nullable(),
  complement: z.string().nullable(),
  clientNameOrBusinessName: z.string().nullable(),
  totalSaleAmount: z.number(),
  iceAmount: z.number(),
  ieHdAmount: z.number(),
  ipjAmount: z.number(),
  taxesAmount: z.number(),
  otherNonTaxableAmounts: z.number(),
  exportsAndExemptOperations: z.number(),
  zeroRateSales: z.number(),
  subtotal: z.number(),
  discountsBonusesRebates: z.number(),
  giftCardAmount: z.number(),
  taxDebitBaseAmount: z.number(),
  taxDebit: z.number(),
  status: z.string(),
  controlCode: z.string().nullable(),
  saleType: z.number(),
  applyVoucher: z.boolean(),
  accountDebit: accountSchema,
});

export const createSaleSchema = saleSchema
  .omit({
    id: true,
    applyVoucher: true,
    accountDebit: true,
  })
  .extend({
    number: z.coerce.number(),
    specification: z.coerce.number(),
    invoiceNumber: z.coerce.number(),
    totalSaleAmount: z.coerce.number(),
    iceAmount: z.coerce.number(),
    ieHdAmount: z.coerce.number(),
    ipjAmount: z.coerce.number(),
    taxesAmount: z.coerce.number(),
    otherNonTaxableAmounts: z.coerce.number(),
    exportsAndExemptOperations: z.coerce.number(),
    zeroRateSales: z.coerce.number(),
    subtotal: z.coerce.number(),
    discountsBonusesRebates: z.coerce.number(),
    giftCardAmount: z.coerce.number(),
    taxDebitBaseAmount: z.coerce.number(),
    taxDebit: z.coerce.number(),
    saleType: z.coerce.number(),
    accountDebitId: z.coerce.number(),
  });

export const updateSaleSchema = createSaleSchema.extend({
  updatedAt: z.string().datetime(),
});

export type Sale = z.infer<typeof saleSchema>;
export type CreateSale = z.infer<typeof createSaleSchema>;
export type UpdateSale = z.infer<typeof updateSaleSchema>;
