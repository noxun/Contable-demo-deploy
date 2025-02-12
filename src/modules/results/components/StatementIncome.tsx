import { DateRange } from "react-day-picker";
import { StatementIncomeType } from "../types/types";
import { formatNumber } from "@/modules/shared/utils/validate";
import { format } from "date-fns";

interface Props {
  data: StatementIncomeType
  dateRange: DateRange
}

export const StatementIncomePreview = ({ data, dateRange }: Props) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const iDate = dateRange.from && format(dateRange.from, FORMAT_DATE_INITIAL)
  const eDate = dateRange.to && format(dateRange.to, FORMAT_DATE_INITIAL)

  const messageDate = iDate && eDate ? (iDate === eDate ? `Del ${iDate}` : `Del ${iDate} al ${eDate}`) : `Del ${iDate}`

  return (
    <table className="text-left min-w-[700px] md:w-full text-xs md:text-sm lg:text-base text-[#4A4A4A] dark:text-[#ECECEC]">
      {/* HEADER */}
      <thead>
        <tr className="text-left md:text-right">
          <th style={{ fontWeight: 500 }} colSpan={5}>{messageDate}</th>
        </tr>
        <tr>
          <th
            className="text-base md:text-xl text-left md:text-center pb-3"
            colSpan={5}
          >
            ESTADO DE RESULTADOS
          </th>
        </tr>
      </thead>

      <tbody>
        {/* INGRESOS */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Ingresos</td>
          <td className="text-right">{formatNumber(data.totalIncome)}</td>
        </tr>
        {/* INGRESOS ITEMS */}
        {data.income.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        <tr className="h-5" />

        {/* GASTOS */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Gastos</td>
          <td className="text-right">{formatNumber(data.totalExpense)}</td>
        </tr>
        {/* GASTOS ITEMS */}
        {data.expenses.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        <tr className="h-5" />

        {/* Resultados */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={4}>Resultados</td>
        </tr>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3" colSpan={3}>Total Ingresos</td>
          <td className="text-right">{formatNumber(data.totalIncome)}</td>
        </tr>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3" colSpan={3}>Total Gastos</td>
          <td className="text-right">{formatNumber(data.totalExpense)}</td>
        </tr>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3" colSpan={3}>Utilidades antes de impuestos</td>
          <td className="text-right">{formatNumber((data.periodUtility))}</td>
        </tr>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3" colSpan={3}>Impuestos alas utilidades</td>
          <td className="text-right">{formatNumber((data.taxOnProfits))}</td>
        </tr>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3" colSpan={3}>Resultado de la gestion</td>
          <td className="text-right">{formatNumber(data.managementResult)}</td>
        </tr>
      </tbody>

    </table>
  );
};
