import { schemaFormFixedAssets } from "../schemas/schema";

export type SchemaFixedAsset = z.infer<typeof schemaFormFixedAssets>