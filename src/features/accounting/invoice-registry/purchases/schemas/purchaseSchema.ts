import { z } from "zod";


const accountSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string().nullable(),
})

export const purchaseSchema = z.object({
  id: z.number(),
  number: z.number(),
  specification: z.number(),
  providerNit: z.number(),
  providerBusinessName: z.string().nullable(),
  authorizationCode: z.string().nullable(),
  invoiceNumber: z.number(),
  duanDimNumber: z.string().nullable(),
  invoiceDuanDimDate: z.string(),
  totalPurchaseAmount: z.number(),
  iceAmount: z.number(),
  ieHdAmount: z.number(),
  ipjAmount: z.number(),
  taxesAmount: z.number(),
  otherNonVatCreditSubject: z.number(),
  exemptAmounts: z.number(),
  zeroRatePurchaseAmount: z.number(),
  subtotal: z.number(),
  discountsBonusesRebates: z.number(),
  giftCardAmount: z.number(),
  vatCreditBaseAmount: z.number(),
  vatCredit: z.number(),
  purchaseType: z.number(),
  controlCode: z.string().nullable(),
  applyVoucher: z.boolean(),
  accountAsset: accountSchema,
  accountDebit: accountSchema,
});


export const createPurchaseSchema = purchaseSchema.omit({
  applyVoucher: true,
  id: true,
  accountAsset: true,
  accountDebit: true,
}).extend({
  number: z.coerce.number(),
  specification: z.coerce.number(),
  providerNit: z.coerce.number(),
  invoiceNumber: z.coerce.number(),
  totalPurchaseAmount: z.coerce.number(),
  iceAmount: z.coerce.number(),
  ieHdAmount: z.coerce.number(),
  ipjAmount: z.coerce.number(),
  vatCreditBaseAmount: z.coerce.number(),
  vatCredit: z.coerce.number(),
  giftCardAmount: z.coerce.number(),
  discountsBonusesRebates: z.coerce.number(),
  taxesAmount: z.coerce.number(),
  otherNonVatCreditSubject: z.coerce.number(),
  exemptAmounts: z.coerce.number(),
  zeroRatePurchaseAmount: z.coerce.number(),
  subtotal: z.coerce.number(),
  accountAssetId: z.coerce.number().nullable(),
  accountDebitId: z.coerce.number().nullable(),
  purchaseType: z.coerce.number(),
})

export const updatePurchaseSchema = createPurchaseSchema.extend({
  updatedAt: z.string(),
})


export type Purchase = z.infer<typeof purchaseSchema>;
export type CreatePurchase = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchase = z.infer<typeof updatePurchaseSchema>;