import { DateRange } from "react-day-picker";
import { BalanceGeneralType } from "../types/types";
import { formatNumber } from "@/modules/shared/utils/validate";
import { format } from "date-fns";

interface Props {
  data: BalanceGeneralType
  dateRange: DateRange
}

export const BalanceGeneralPreview = ({ data, dateRange }: Props) => {
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
          <th className="text-base md:text-xl text-left md:text-center pb-3" colSpan={5}>BALANCE GENERAL</th>
        </tr>
      </thead>

      <tbody>
        {/* ACTIVOS */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Activo Corriente</td>
          <td className="text-right">{formatNumber(data.totalActiveCurrent)}</td>
        </tr>
        {/* Activo corriente */}
        {data.activeCurrentItems.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        <tr className="h-5" />

        {/* Activo no corriente */}
        <tr style={{ fontWeight: 700 }} className="pt-8 hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Activo No Corriente</td>
          <td className="text-right">{formatNumber(data.totalActiveNoCurrent)}</td>
        </tr>
        {data.activeNoCurrentItems.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        {/* Resultado Activo */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Total Activo</td>
          <td className="text-right">{formatNumber(data.totalActive)}</td>
        </tr>
        <tr className="h-5" />

        {/* PASIVOS */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Pasivo Corriente</td>
          <td className="text-right">{formatNumber(data.totalLiabilityCurrent)}</td>
        </tr>
        {/* Pasivo corriente */}
        {data.liabilityCurrentItems.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        <tr className="h-5" />

        {/* Pasivo no corriente */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Pasivo No Corriente</td>
          <td className="text-right">{formatNumber(data.totalLiabilityNoCurrent)}</td>
        </tr>
        {data.liabilityNoCurrentItems.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        {/* Resultado Pasivo */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Total Pasivo</td>
          <td className="text-right">{formatNumber(data.totalLiability)}</td>
        </tr>
        <tr className="h-5" />

        {/* PATRIMONIOS */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Patrimonio</td>
          <td className="text-right">{formatNumber(data.totalEquity)}</td>
        </tr>
        {data.equityItems.map((item, index) => (
          <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
            <td className="pl-3">{item.account}</td>
            <td colSpan={2}>{item.description}</td>
            <td className="text-right">{formatNumber(item.amount)}</td>
          </tr>
        ))}
        {/* Resultados Patrimonio */}
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Total Patrimonio Neto</td>
          <td className="text-right">{formatNumber(data.totalLiabilityNoCurrent)}</td>
        </tr>
        <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td colSpan={3}>Total Pasivo y Patrimonio</td>
          <td className="text-right">{formatNumber(data.totalLiabilityEquity)}</td>
        </tr>
        <tr className="h-5" />
      </tbody>
    </table>
  );
};
