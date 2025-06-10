import { formatNumber } from "@/features/accounting/shared/utils/validate";

interface AccountTotalsProps {
  totalDebit: number;
  totalAsset: number;
  totalSaldo: number;
  totalPreviousBalance?: number;
}

export const AccountTotals = ({
  totalDebit,
  totalAsset,
  totalSaldo,
  totalPreviousBalance,
}: AccountTotalsProps) => {
  return (
    <div className="flex justify-end gap-6 p-4 bg-gray-50 rounded-lg">
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Saldo Anterior</p>
        <p className="text-lg font-bold">
          {formatNumber(totalPreviousBalance ?? 0)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Debe:</p>
        <p className="text-lg font-bold">{formatNumber(totalDebit)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Haber:</p>
        <p className="text-lg font-bold">{formatNumber(totalAsset)}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Total Saldo</p>
        <p className="text-lg font-bold">{formatNumber(totalSaldo)}</p>
      </div>
    </div>
  );
};
