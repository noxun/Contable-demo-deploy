import { DateRange } from "react-day-picker";

// Types
export type VoucherItem = {
  accountId: number;
  id: number;
  createdAt: string;
  type: number;
  voucherId: number;
  voucherDate: string;
  description: string;
  gloss: string;
  debitBs: number;
  assetBs: number;
  debitSus: number;
  assetSus: number;
  typeDes?: string;
  totalSaldoSus: number;
  totalSaldoBs: number;
  hojaDeRuta?: string;
};

export type AccountData = {
  accountCode: string;
  accountDescription: string;
  voucherItems: VoucherItem[];
  totalDebit: number;
  totalAsset: number;
  totalDebitSus: number;
  totalAssetSus: number;
  totalSaldoNum: number;
  totalSaldoNumSus: number;
  totalSaldoText: string;
  totalSaldoTextSus: string;
  previousBalance: number;
  previousBalanceSus: number;
};
