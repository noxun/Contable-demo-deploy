import AccountingExcelPage from "./accounting-excel";
import BalanceAmountsPage from "./balance-amounts";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-end justify-center">
      <AccountingExcelPage/>
      <BalanceAmountsPage/>
    </div>
  );
}
