import { z } from "zod"

export const receiptSchema = z.object({
  id: z.number(),
  num: z.number(),
  concept: z.string(),
  amountBs: z.number(),
  amountSus: z.number(),
  receiverName: z.string(),
  receiverId: z.number().nullable(),
  payerName: z.string(),
  payerId: z.number().nullable(),
  createdAt: z.string()
})

export const storeReceiptSchema = receiptSchema.omit({
  id: true,
  num: true,
  createdAt: true
}).extend({
  concept: z.string().min(1, "El concepto es obligatorio"),
  amountBs: z.number().positive().min(0, "El monto en Bs es obligatorio"),
  amountSus: z.number().positive().min(0, "El monto en SUS es obligatorio"),
  receiverName: z.string().min(1, "El nombre del receptor es obligatorio"),
  payerName: z.string().min(1, "El nombre del pagador es obligatorio")
})

export type Receipt = z.infer<typeof receiptSchema>
export type StoreReceipt = z.infer<typeof storeReceiptSchema>