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
          {/* <td>{item.code}</td> */}
          <td style={{ paddingLeft: `${level * 10}px` }} className={`${currentLevel === level ? "font-normal" : "font-semibold"}`}>
            {(level >= currentLevel && level >= 3)? item.description.toLowerCase(): item.description}
            {/* {item.description} */}
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
              <tr className="h-1"></tr>
              <tr className="font-bold bg-gray-50 dark:bg-gray-800">
                <td colSpan={2}>TOTAL ACTIVO</td>
                <td colSpan={3} className="text-end">{formatNumber(data.totalActive)}</td>
              </tr>
              <tr className="h-6"></tr>
            </>
            )}
            {item.description === 'PASIVOS' && (
              <>
                <tr className="h-1"></tr>
                <tr className="font-bold bg-gray-50 dark:bg-gray-800">
                  <td colSpan={2}>TOTAL PASIVO</td>
                  <td colSpan={3} className="text-end">{formatNumber(data.totalPassive)}</td>
                </tr>
                <tr className="h-6"></tr>
              </>
            )}
            {item.description === 'PATRIMONIO' && (
              <>
                <tr className="h-2"></tr>
                <tr className="font-bold border-gray-300 dark:bg-gray-800 bg-gray-50">
                  <td colSpan={2}>TOTAL PATRIMONIO</td>
                  <td colSpan={3} className="text-right pr-4">{formatNumber(data.totalHeritage)}</td>
                </tr>
                <tr className="font-bold border-gray-300 dark:bg-gray-800 border-t bg-gray-50">
                  <td colSpan={2}>RESULTADO</td>
                  <td colSpan={3} className="text-right pr-4">{formatNumber(data.result)}</td>
                </tr>
                <tr className="font-bold border-gray-400 dark:bg-gray-800 bg-gray-50">
                  <td colSpan={2}>TOTAL + PATRIMONIO + RESULTADO</td>
                  <td colSpan={3} className="text-right pr-4">{formatNumber(data.liabilityEquityResult)}</td>
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
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        <h3 className="text-2xl font-bold">BALANCE GENERAL</h3>
        <p className="w-full text-center">{messageDate}</p>
        <p className="w-full text-center text-sm">(Expresado en {moneyType})</p>
      </div>
      <table className="w-full" border={1} cellPadding="5" style={{ borderCollapse: "collapse" }}>
        <thead>
          {/* <tr className="bg-[#E0E0E0] dark:text-[#4a4a4a]">
            <th className="font-semibold">Cuenta</th>
            <th className="font-semibold">Descripción</th>
            <th className="font-semibold">Imp. Niv. {currentLevel}</th>
            <th className="font-semibold">{(currentLevel - 1) <= 0 ? ' ' : `Imp. Niv. ${currentLevel - 1}`}</th>
            <th className="font-semibold">{(currentLevel - 2) <= 0 ? ' ' : `Imp. Niv. ${currentLevel - 2}`}</th>
          </tr> */}
        </thead>
        <tbody>
          {data.items.map((item) => renderItem(item))}
        </tbody>
      </table>
    </>
  );

};
