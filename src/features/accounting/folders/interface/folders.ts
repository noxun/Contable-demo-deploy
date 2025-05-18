export interface IResponseFolder {
  id: number;
  number: number;
  numRef: string;
  companyId: number;
  procedureTypeId: number;
  dim: null | string;
  fechaAceptacion: null | string;
  clienteCodigo: null;
  clienteNombre: string;
  mercaderia: string;
  tipo: string;
  referenciaCliente?: string;
  fobUsd?: string;
  cifBs?: string;
  nitCi?: string;
}
export interface IResponseConceptFolder {
  id: number;
  acronym: string;
  description: string;
  typeOfExpense: string;
  typeOfTax: string;
  order: number;
  accountId: number;
  carpeta: string;
  debitBs: number;
  assetBs: number;
  amount?: number;
}
export interface IResponseDispatchDocument {
  id: number;
  num: number;
  carpeta: string;
  invoiceId: number;
  totalSheet: number;
  totalInvoice: number;
  totalProcedure: number;
  url1: string | null;
  url2: string | null;
  simpleDispatch: boolean;
  status: string | null;
  registerDate: string | null;
  entityId: number;
  totalSheetText: string;
  totalInvoiceText: string;
  totalProcedureText: string;
  createdAt: string;
  createdById: number;
  entityDetail: null;
}
