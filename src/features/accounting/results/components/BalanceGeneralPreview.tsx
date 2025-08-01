import { DateRange } from "react-day-picker";
import { formatNumber } from "@/features/accounting/shared/utils/validate";
import { format } from "date-fns";
import { BalanceGeneralType, BalanceItemType } from "../types/types";
import { Fragment } from "react";

interface Props {
  data: BalanceGeneralType
  dateRange: DateRange
  currentLevel: number
  inSus?: boolean
}

export const BalanceGeneralPreview = ({ data, dateRange, currentLevel, inSus = false }: Props) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const iDate = dateRange.from && format(dateRange.from, FORMAT_DATE_INITIAL)
  const eDate = dateRange.to && format(dateRange.to, FORMAT_DATE_INITIAL)
  const moneyType = inSus ? "Dolares" : "Bolivianos";

  const messageDate = iDate && eDate
    ? (iDate === eDate ? `Del ${iDate}`
      : `Del ${iDate} al ${eDate}`)
    : `Del ${iDate}`

  const renderItem = (item: BalanceItemType, level = 1): JSX.Element => {
    return (
      <Fragment key={item.code}>
        <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40" >
          <td>{item.code}</td>
          <td style={{ paddingLeft: `${level * 10}px` }} className={`${currentLevel === level ? "font-normal" : "font-semibold"}`}>
            {item.description}
          </td>
          <td className={`text-end ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel === item.level ? formatNumber(item.sld) : " "}</td>
          <td className={`text-end ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel - 1 === item.level ? formatNumber(item.sld) : " "}</td>
          <td className={`text-end ${currentLevel === level ? "font-normal" : "font-semibold"}`}>{currentLevel - 2 === item.level ? formatNumber(item.sld) : " "}</td>
        </tr>
        {item.itemsChild.length > 0 && item.itemsChild.map((child) => renderItem(child, level + 1))}

        {/* Los totales */}
        {level === 1 && (
          <>
            {item.description === 'ACTIVO' && (
              <>
                <tr className="h-4"></tr>
                <tr className="bg-[#F0F0F0] font-bold dark:bg-gray-700 dark:text-gray-300">
                  <td></td>
                  <td>Total Activo</td>
                  <td className="text-end">{formatNumber(data.totalActive)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="h-4"></tr>
              </>
            )}
            {item.description === 'PASIVOS' && (
              <>
                <tr className="h-4"></tr>
                <tr className="bg-[#F0F0F0] dark:text-gray-300 font-bold dark:bg-gray-700">
                  <td></td>
                  <td>Total Pasivo</td>
                  <td className="text-end">{formatNumber(data.totalPassive)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="h-4"></tr>
              </>
            )}
            {item.description === 'PATRIMONIO' && (
              <>
                <tr className="h-4"></tr>
                <tr className="bg-[#F0F0F0] dark:text-gray-300 font-bold dark:bg-gray-700">
                  <td></td>
                  <td>Total Patrimonio</td>
                  <td className="text-end">{formatNumber(data.totalHeritage)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="bg-[#D0D0D0] dark:text-gray-300 font-bold dark:bg-gray-700">
                  <td></td>
                  <td>Resultado</td>
                  <td className="text-end">{formatNumber(data.result)}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr className="bg-[#C0C0C0] dark:text-gray-300 font-bold dark:bg-gray-700">
                  <td></td>
                  <td>Total Pasivo + Patrimonio + Resultado</td>
                  <td className="text-end">{formatNumber(data.liabilityEquityResult)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            )}
          </>
        )}
      </Fragment>)
  }

  if (data?.items.length <= 0) return <div>Sin Resultados</div>

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-1 pt-2 pb-4">
        <p className="w-full text-end">{messageDate}</p>
        <h3 className="text-xl font-bold">BALANCE GENERAL</h3>
        <p className="w-full text-center">(Expresado en {moneyType})</p>
      </div>
      <table className="w-full" border={1} cellPadding="5" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-[#E0E0E0] dark:text-gray-300 dark:bg-gray-700">
            <th className="font-semibold">Cuenta</th>
            <th className="font-semibold">Descripción</th>
            <th className="font-semibold">Imp. Niv. {currentLevel}</th>
            <th className="font-semibold">{(currentLevel - 1) <= 0 ? ' ' : `Imp. Niv. ${currentLevel - 1}`}</th>
            <th className="font-semibold">{(currentLevel - 2) <= 0 ? ' ' : `Imp. Niv. ${currentLevel - 2}`}</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => renderItem(item))}
        </tbody>
      </table>
    </>
  );

};
