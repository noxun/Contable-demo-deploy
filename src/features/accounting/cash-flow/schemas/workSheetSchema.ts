import { z } from "zod";

export const workSheetCashFlowItemSchema = z.object({
  id: z.number(),
  codeAccount: z.string().nullable(),
  nameAccount: z.string().nullable(),
  balanceSheetBack: z.number(),
  balanceSheetPresent: z.number(),
  difference: z.string().nullable(),
  periodDepression: z.number(),
  amorOfIntangibleAsset: z.number(),
  aitb: z.number(),
  valueMaintenance: z.number(),
  provCompensation: z.number(),
  payCompensation: z.number(),
  payDividends: z.number(),
  purchaseFixedAssets: z.number(),
  saleFixedAssets: z.number(),
  paymentCompensation: z.number(),
  paymentDividends: z.number(),
  diference: z.number(),
  clasification: z.string().nullable(),
});

export const workSheetCashFlowSchema = z.object({
  balanceSheetBackTotal: z.number(),
  balanceSheetPresentTotal: z.number(),
  differenceTotal: z.string().nullable(),
  periodDepressionTotal: z.number(),
  amorOfIntangibleAssetTotal: z.number(),
  aitbTotal: z.number(),
  valueMaintenanceTotal: z.number(),
  provCompensationTotal: z.number(),
  payCompensationTotal: z.number(),
  payDividendsTotal: z.number(),
  purchaseFixedAssetsTotal: z.number(),
  saleFixedAssetsTotal: z.number(),
  paymentCompensationTotal: z.number(),
  paymentDividendsTotal: z.number(),
  diferenceTotal: z.number(),
  clasificationTotal: z.string().nullable(),
  netChangeInCash: z.number(),
  initialBalanceOfCash: z.number(),
  finalBalanceOfCash: z.number(),
  finalBalanceOfCashOfBalanceSheet: z.number(),
  difference: z.number(),
  items: z.array(workSheetCashFlowItemSchema).nullable(),
});

export const workSheetResponse = workSheetCashFlowSchema

export const updateWorkSheetCashFlowItemSchema = workSheetCashFlowItemSchema.omit({
  id: true,
  nameAccount: true,
  codeAccount: true,
  balanceSheetBack: true,
  balanceSheetPresent: true,
  difference: true,
  diference: true,
})


export type WorkSheetCashFlowItem = z.infer<typeof workSheetCashFlowItemSchema>;
export type WorkSheetCashFlow = z.infer<typeof workSheetCashFlowSchema>;
export type WorkSheetResponse = z.infer<typeof workSheetResponse>;
export type UpdateWorkSheetCashFlowItem = z.infer<typeof updateWorkSheetCashFlowItemSchema>;