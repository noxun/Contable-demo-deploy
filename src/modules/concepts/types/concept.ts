export type Concept = {
  id?: number;
  acronym: string;
  description: string;
  typeOfExpense: string;
  typeOfTax: string;
  order: number;
  accountId: number | string;
}