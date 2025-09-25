import { accountsSchema } from "@/features/accounting/account/schemas/account";
import { z } from "zod";
export type Account = z.infer<typeof accountsSchema>;