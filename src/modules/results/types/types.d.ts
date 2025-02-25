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


//Ratios financieros
export interface FinancialRatiosResponse {
  liquidityRatios: {
    currentLiquidity: number;
    liqCurrentAsset: number;
    liqCurrentLiability: number;
    acidTest: number;
    acidInventories: number;
    acidCurrentLiability: number;
    cashRatio: number;
    cashAvailabilities: number;
    netWorkingCapital: number;
    netCurrentAsset: number;
    netCurrentLiability: number;
  };
  debtRatios: {
    liabilityToAsset: number;
    ltaCurrentLiability: number;
    ltaCurrentNonLiability: number;
    ltaAssetTotal: number;
    liabilityToEquity: number;
    lteCurrentLiability: number;
    lteCurrentNonLiability: number;
    lteNetEquity: number;
    debtToAsset: number;
    dtaShortFinancialDebts: number;
    dtaLongFinancialDebts: number;
    dtaAssetTotal: number;
    debtToEquity: number;
    dteShortFinancialDebts: number;
    dteLongFinancialDebts: number;
    dteNetEquity: number;
    debtToLiability: number;
    dtlShortFinancialDebts: number;
    dtlLongFinancialDebts: number;
    dtlCurrentLiability: number;
    dtlCurrentNonLiability: number;
  };
  profitabilityRatios: {
    profitability: number;
    proNetProfit: number;
    propSocialCapital: number;
    roi: number;
    roiNetProfit: number;
    roiTotalInvestment: number;
    roe: number;
    roeNetProfit: number;
    roeNetWorth: number;
    roa: number;
    roaNetProfit: number;
    roaTotalAsset: number;
  };
}

export interface RatioItem {
  name: string;
  value: number;
  interpretation?: string;
}

export interface FinancialRatiosData {
  liquidityRatios: {
    title: string;
    items: RatioItem[];
  };
  debtRatios: {
    title: string;
    items: RatioItem[];
  };
  profitabilityRatios: {
    title: string;
    items: RatioItem[];
  };
}
