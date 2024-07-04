export interface IResponseStatus {
  id: number;
  typeOfExpense: string;
  carpeta: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  entityId: number;
  registerDate: string;
  dispatchDocumentId: number;
}
