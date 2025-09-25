export interface IIncomeItem {
  id?: number;
  debitBs: string;
  debitSus: string;
  assetBs: string;
  assetSus: string;
  gloss: string;
  accountId: string;
  voucherId: string;
}
export interface IIncomeResponse {
  id: number;
  num: number;
  exchangeRate: number;
  coin: string;
  checkNum: string;
  canceledTo: string;
  gloss: string;
  bankId: number;
}
