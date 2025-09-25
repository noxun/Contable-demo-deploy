import { z } from "zod";
import { modelSeatFormSchema } from "../schemas/modelSeat";

export type ModelSeatForm = z.infer<typeof modelSeatFormSchema>;