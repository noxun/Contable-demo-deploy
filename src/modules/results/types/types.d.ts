export type LevelData = 6 | 5 | 4 | 3 | 2 | 1;

// Balance De Sumas y Saldos
export interface BalanceAmounts {
  debit: number;
  asset: number;
  debtor: number;
  creditor: number;
  items: ItemAmounts[];
}

interface ItemAmounts {
  code: string;
  description: string;
  debit: number;
  asset: number;
  debtor: number;
  creditor: number;
}

// Balance General
export interface BalanceGeneralType {
  totalActiveCurrent: number
  totalActiveNoCurrent: number
  totalActive: number
  totalLiabilityCurrent: number
  totalLiabilityNoCurrent: number
  totalLiability: number
  totalEquity: number
  totalLiabilityEquity: number
  activeCurrentItems: ItemBalance[]
  activeNoCurrentItems: ItemBalance[]
  liabilityCurrentItems: ItemBalance[]
  liabilityNoCurrentItems: ItemBalance[]
  equityItems: ItemBalance[]
}
interface ItemBalance {
  account: string,
  description: string
  amount: number
  amountDetail?: number
}

// Estado de Restultados
export interface StatementIncomeType {
  totalExpense: number;
  totalIncome: number;
  periodUtility: number;
  taxOnProfits: number;
  managementResult: number;
  expenses: StatementIncomeItem[];
  income: StatementIncomeItem[];
}

export interface StatementIncomeItem {
  account: string;
  description: string;
  amount: number;
}
