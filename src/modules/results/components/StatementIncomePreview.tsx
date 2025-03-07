import { DateRange } from "react-day-picker";
import { ItemStatementIncomeType, StatementIncomeType } from "../types/types";
import { formatNumber } from "@/modules/shared/utils/validate";
import { format } from "date-fns";

interface Props {
  data: StatementIncomeType
  dateRange: DateRange
  currentLevel: number
  inSus?: boolean
}


export const StatementIncomePreview = ({ data, dateRange, currentLevel, inSus = false }: Props) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const iDate = dateRange.from && format(dateRange.from, FORMAT_DATE_INITIAL)
  const eDate = dateRange.to && format(dateRange.to, FORMAT_DATE_INITIAL)
  const moneyType = inSus ? "Dolares" : "Bolivianos";

  const messageDate = iDate && eDate ? (iDate === eDate ? `Del ${iDate}` : `Del ${iDate} al ${eDate}`) : `Del ${iDate}`

  const renderItem = (item: ItemStatementIncomeType, level = 1): JSX.Element => {
    return (
      <>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40" >
          <td>{item.code}</td>
          <td style={{ paddingLeft: `${level * 10}px` }} className={`${currentLevel === level ? "font-normal" : "font-semibold"}`}>
            {item.description}
          </td>
          <td className={`text-center ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel === item.level ? formatNumber(item.sld) : " "}</td>
          <td className={`text-center ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel - 1 === item.level ? formatNumber(item.sld) : " "}</td>
          <td className={`text-center ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel - 2 === item.level ? formatNumber(item.sld) : " "}</td>
        </tr>
        {item.itemsChild.length > 0 && item.itemsChild.map((child) => renderItem(child, level + 1))}

        {/* Los totales */}
        {level === 1 && (
          <>
            {/* Total ingresos */}
            {item.description === 'INGRESOS' && (
              <>
                <tr className="h-4"></tr>
                <tr className="bg-[#F0F0F0] font-bold dark:text-[#4a4a4a]">
                  <td></td>
                  <td>Total Ingresos</td>
                  <td className="text-end">{formatNumber(data.totalIncome)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="h-4"></tr>
              </>
            )}
            {/* Total Costos y Gastos */}
            {item.description === 'COSTOS Y GASTOS' && (
              <>
                <tr className="h-4"></tr>
                <tr className="bg-[#F0F0F0] font-bold dark:text-[#4a4a4a]">
                  <td></td>
                  <td>Total Costos y Gastos</td>
                  <td className="text-end">{formatNumber(data.totalExpense)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="h-4"></tr>
              </>
            )}

          </>
        )}
      </>)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <p className="w-full text-end">{messageDate}</p>
        <h3 className="text-xl font-bold">ESTADO DE RESULTADOS</h3>
        <p className="w-full text-center">(Expresado en {moneyType})</p>
      </div>
      <table className="w-full" border={1} cellPadding="5" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-[#E0E0E0] dark:text-[#4a4a4a]">
            <th className="font-semibold">Cuenta</th>
            <th className="font-semibold">Descripción</th>
            <th className="font-semibold">Imp. Niv. {currentLevel}</th>
            <th className="font-semibold">{(currentLevel - 1) <= 0 ? " " : `Imp. Niv. ${currentLevel - 1}`}</th>
            <th className="font-semibold">{(currentLevel - 2) <= 0 ? " " : `Imp. Niv. ${currentLevel - 2}`}</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => renderItem(item))}
          <tr className="h-4"></tr>
          {/* Periodo de utilidad */}
          <tr className="bg-[#F0F0F0] dark:text-[#4a4a4a] font-bold">
            <td></td>
            <td>Periodo de Utilidad</td>
            <td className="text-end">{formatNumber(data.periodUtility)}</td>
            <td></td>
            <td></td>
          </tr>
          {/* Impuestos sobre beneficios */}
          <tr className="bg-[#D0D0D0] dark:text-[#4a4a4a] font-bold">
            <td></td>
            <td>Impuestos sobre beneficios</td>
            <td className="text-end">{formatNumber(data.taxOnProfits)}</td>
            <td></td>
            <td></td>
          </tr>
          {/* Resultado de gestion */}
          <tr className="bg-[#C0C0C0] dark:text-[#4a4a4a] font-bold">
            <td></td>
            <td>Resultado de gestion</td>
            <td className="text-end">{formatNumber(data.managementResult)}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );

};
