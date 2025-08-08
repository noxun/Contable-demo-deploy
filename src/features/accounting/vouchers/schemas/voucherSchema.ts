import { z } from "zod";

export const voucherItemSchema = z.object({
  id: z.number(),
  debitBs: z.number(),
  debitSus: z.number(),
  assetBs: z.number(),
  assetSus: z.number(),
  totalSaldoBs: z.number(),
  totalSaldoSus: z.number(),
  gloss: z.string().nullable(),
  accountId: z.number(),
  code: z.string().nullable(),
  description: z.string().nullable(),
  typeOfExpense: z.string().nullable(),
  createdAt: z.string(),
  voucherDate: z.string(),
  voucherId: z.number(),
  type: z.number(),
  typeDes: z.string().nullable(),
  hojaDeRuta: z.string().nullable(),
  sucursalId: z.number(),
  conceptExpenseId: z.number().nullable(),
  carpeta: z.string().nullable(),
});

export const voucherSchema = z.object({
  id: z.number(),
  num: z.number().nullable(),
  exchangeRate: z.number(),
  voucherDate: z.string(),
  coin: z.string().nullable(),
  checkNum: z.string().nullable(),
  canceledTo: z.string().nullable(),
  gloss: z.string().nullable(),
  bankId: z.number(),
  type: z.number(),
  hojaDeRuta: z.string().nullable(),
  sucursalId: z.number(),
  bankItemRef: z.number(),
  accountingBoxItemRef: z.number(),
  costCenterId: z.number().nullable(),
  createdById: z.number().nullable(),
  bookSBRef: z.number(),
  typeDocument: z.string().nullable(),
  provider: z.string().nullable(),
  invoice: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
  nit: z.string().nullable(),
  refCode: z.string().nullable(),
  movementType: z.number(),
  isHistoric: z.boolean(),
  isTransfer: z.boolean(),
  items: z.array(voucherItemSchema).nullable(),
});

export const voucherListSchema = voucherSchema
  .omit({
    items: true,
    type: true,
  })
  .extend({
    bankId: z.number().nullable(),
    bankName: z.string().nullable(),
  });

export const createVoucherItemSchema = voucherItemSchema
  .omit({
    code: true,
    hojaDeRuta: true,
    id: true,
    sucursalId: true,
    totalSaldoBs: true,
    totalSaldoSus: true,
    type: true,
    typeDes: true,
    voucherDate: true,
  })
  .extend({
    accountId: z.coerce.number(),
    gloss: z
      .string()
      .min(6, "La glosa es obligatoria y debe tener al menos 6 caracteres")
      .max(255, "La glosa no puede exceder los 255 caracteres"),
    debitBs: z.coerce.number().nonnegative(),
    debitSus: z.coerce.number().nonnegative(),
    assetBs: z.coerce.number().nonnegative(),
    assetSus: z.coerce.number().nonnegative(),
    conceptExpenseId: z.number().nullish(),
    createdAt: z.string().nullish(),
  });

export const createVoucherSchema = voucherSchema
  .omit({
    id: true,
  })
  .extend({
    bankId: z.number().nullable(), // en la api no lo dice pero puede ser null
    costCenterId: z.coerce.number().nullable(), // en la api no lo dice pero puede ser null
    sucursalId: z.coerce.number(), // puede ser 0
    items: z
      .array(createVoucherItemSchema)
      .min(2, "Debe agregar al menos dos items al voucher"),
    type: z.coerce.number(),
    gloss: z
      .string()
      .min(6, "La glosa es obligatoria y debe tener al menos 6 caracteres")
      .max(255, "La glosa no puede exceder los 255 caracteres"),
  });

export const updateVoucherSchema = createVoucherSchema.extend({
  id: z.number(),
  items: z
    .array(createVoucherItemSchema.extend({ id: z.number().optional() }))
    .min(2, "Debe agregar al menos dos items al voucher"),
});

export const voucherCreateResponseSchema = z.object({
  id: z.number(),
  type: z.number(),
});

export const voucherToList = z.array(voucherListSchema);

export type Voucher = z.infer<typeof voucherSchema>;
export type VoucherItem = z.infer<typeof voucherItemSchema>;
export type VoucherList = z.infer<typeof voucherToList>;
export type VoucherCreateResponse = z.infer<typeof voucherCreateResponseSchema>;

export type VoucherItemCreate = z.infer<typeof createVoucherItemSchema>;
export type CreateVoucher = z.infer<typeof createVoucherSchema>;
export type UpdateVoucher = z.infer<typeof updateVoucherSchema>;
