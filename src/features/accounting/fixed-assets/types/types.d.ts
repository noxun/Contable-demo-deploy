import { schemaFormFixedAssets } from "../schemas/schema";

export type SchemaFixedAsset = z.infer<typeof schemaFormFixedAssets>

export interface FixedAssetsAll {
  totalIncreiceUpdate: number;
  totalDActual: number;
  totalIncreiceUpdateDP: number;
  getFixed: FixedAsset[];
}

export interface FixedAsset {
  fixedAssetsId?: number;
  id: number;
  typeActive: string;
  detail: string;
  reference: string;
  proveedor: string;
  invoice: string;
  registrationDate: Date;
  lifeMonths: number;
  timeMonths: number;
  depreciationPorcentage: number;
  startDate: Date;
  initialUFV: number;
  lastDate: Date;
  endUFV: number;
  initialNetWorth: number;
  worthUpdated: number;
  increaseUpdated: number;
  updatedDA: number;
  previousDA: number;
  increaseUpdatedDA: number;
  currentDepreciation: number;
  endNetWorth: number;
  activePropertiesValue: number;
  glossValue: number;
  assetDepreciation: number;
  fixedAseetsNetValue: number;
  currentDepreciationP: number;
}
