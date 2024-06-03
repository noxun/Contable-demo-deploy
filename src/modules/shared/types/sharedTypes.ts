export type Voucher = {
  id?: number;
  type?: number;// por alguna razon type solo aparece cuando haces PUT, despues es un query string
  num?: number;
  exchangeRate: number;
  voucherDate?: string | Date;
  coin: "USD" | "BOB";//this should be an enum
  checkNum: string;
  canceledTo?: string | Date;
  gloss: string
  bankId: number | string
  items?: VoucherItem[]
}

export type VoucherItem = {
      id?: number,
      debitBs: number,
      debitSus: number,
      assetBs: number,
      assetSus: number,
      gloss: string,
      accountId?: number | string
      voucherId?: number | string
}

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
