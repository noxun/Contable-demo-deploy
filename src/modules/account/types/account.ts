import { accountsSchema } from "@/modules/account/schemas/account";
import { z } from "zod";



export type Account = z.infer<typeof accountsSchema>;