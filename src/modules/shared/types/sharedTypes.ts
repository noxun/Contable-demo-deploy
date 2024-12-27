export type Voucher = {
  id?: number;
  type?: number; // por alguna razon type solo aparece cuando haces PUT, despues es un query string
  num?: number;
  exchangeRate: number;
  voucherDate?: string | Date;
  coin: "USD" | "BOB"; //this should be an enum
  checkNum?: string | undefined;
  canceledTo?: string | Date;
  gloss: string;
  bankId: number | string | null;
  items?: VoucherItem[];
};

export type VoucherItem = {
  id?: number;
  debitBs: number | null;
  debitSus: number;
  assetBs: number | null;
  assetSus: number;
  gloss: string;
  accountId?: number | string;
  code?: string;
  description?: string;
  typeOfExpense?: any;
  createdAt?: "string";
  voucherId?: number | string;
  type?: number;
  canDebit?: boolean //para el uso de inputs en los asientos modelo
  canAsset?: boolean
};

export enum VoucherType {
  DIARY = "0",
  EXPENSE = "1",
  INCOME = "2",
}

export enum VoucherTypeRoute {
  DIARY = "diary",
  EXPENSE = "expenses",
  INCOME = "income",
}
