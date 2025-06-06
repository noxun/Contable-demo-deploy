import { z } from "zod";

export const accountsSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  coin: z.string(),
  active: z.boolean().default(true),
  isBudgetable: z.boolean(),
  isMotion: z.boolean(),
  isCost: z.boolean(),
  isOperation: z.boolean(),
  isInitialBalance: z.boolean(),
  isInvestment: z.boolean(),
  isFinancing: z.boolean(),
  accountChild: z
    .array(
      z.object({
        id: z.number(),
        code: z.string(),
        description: z.string(),
        coin: z.string(),
        active: z.boolean().default(true),
        isBudgetable: z.boolean(),
        isMotion: z.boolean(),
        isCost: z.boolean(),
        isOperation: z.boolean(),
        isInitialBalance: z.boolean(),
        isInvestment: z.boolean(),
        isFinancing: z.boolean(),
      })
    )
    .optional(),
});

export interface ITypeCompany {
  id: number;
  name: string;
  accounts: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdById: null;
  updatedById: null;
  deletedById: null;
}
