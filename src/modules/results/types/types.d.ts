
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