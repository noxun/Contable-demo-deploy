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
      <tr className="text-left md:text-right">
        <td colSpan={5}>{messageDate}</td>
      </tr>
      <tr>
        <th className="text-base md:text-xl text-left md:text-center pb-3" colSpan={5}>BALANCE GENERAL</th>
      </tr>
      {/* ACTIVOS */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Activo Corriente</th>
        <th className="text-right">{formatNumber(data.totalActiveCurrent)}</th>
      </tr>
      {/* Activo corriente */}
      {data.activeCurrentItems.map((item, index) => (
        <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3">{item.account}</td>
          <td colSpan={2}>{item.description}</td>
          <td className="text-right">{formatNumber(item.amount)}</td>
        </tr>
      ))}
      <br />
      {/* Activo no corriente */}
      <tr className="pt-8 hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Activo No Corriente</th>
        <th className="text-right">{formatNumber(data.totalActiveNoCurrent)}</th>
      </tr>
      {data.activeNoCurrentItems.map((item, index) => (
        <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3">{item.account}</td>
          <td colSpan={2}>{item.description}</td>
          <td className="text-right">{formatNumber(item.amount)}</td>
        </tr>
      ))}
      {/* Resultado Activo */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Total Activo</th>
        <th className="text-right">{formatNumber(data.totalActive)}</th>
      </tr>

      <br />
      {/* PASIVOS */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Pasivo Corriente</th>
        <th className="text-right">{formatNumber(data.totalLiabilityCurrent)}</th>
      </tr>
      {/* Pasivo corriente */}
      {data.liabilityCurrentItems.map((item, index) => (
        <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3">{item.account}</td>
          <td colSpan={2}>{item.description}</td>
          <td className="text-right">{formatNumber(item.amount)}</td>
        </tr>
      ))}
      <br />
      {/* Pasivo no corriente */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Pasivo No Corriente</th>
        <th className="text-right">{formatNumber(data.totalLiabilityNoCurrent)}</th>
      </tr>
      {data.liabilityNoCurrentItems.map((item, index) => (
        <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3">{item.account}</td>
          <td colSpan={2}>{item.description}</td>
          <td className="text-right">{formatNumber(item.amount)}</td>
        </tr>
      ))}
      {/* Resultado Pasivo */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Total Pasivo</th>
        <th className="text-right">{formatNumber(data.totalLiability)}</th>
      </tr>

      <br />
      {/* PATRIMONIOS */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Patrimonio</th>
        <th className="text-right">{formatNumber(data.totalEquity)}</th>
      </tr>
      {data.equityItems.map((item, index) => (
        <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
          <td className="pl-3">{item.account}</td>
          <td colSpan={2}>{item.description}</td>
          <td className="text-right">{formatNumber(item.amount)}</td>
        </tr>
      ))}
      {/* Resultados Patrimonio */}
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Total Patrimonio Neto</th>
        <th className="text-right">{formatNumber(data.totalLiabilityNoCurrent)}</th>
      </tr>
      <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
        <th colSpan={3}>Total Pasivo y Patrimonio</th>
        <th className="text-right">{formatNumber(data.totalLiabilityEquity)}</th>
      </tr>
      <br />
    </table>
  );
};
