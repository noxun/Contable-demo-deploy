import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { formatNumber } from "@/features/accounting/shared/utils/validate"
import { format } from "date-fns";
import { DateRange } from "react-day-picker"
import { CashFlowResponseData } from "@/features/accounting/cash-flow/types/types"

interface Props {
  dateRange: DateRange,
  data: CashFlowResponseData
}

export interface CFBalanceGeneralType {
  totalActiveCurrent: number;
  totalActiveNoCurrent: number;
  totalActive: number;
  totalLiabilityCurrent: number;
  totalLiabilityNoCurrent: number;
  totalLiability: number;
  totalEquity: number;
  totalLiabilityEquity: number;
  activeCurrentItems: CFBalanceGeneralItemType[];
  activeNoCurrentItems: any[];
  liabilityCurrentItems: CFBalanceGeneralItemType[];
  liabilityNoCurrentItems: any[];
  equityItems: CFBalanceGeneralItemType[];
}

export interface CFBalanceGeneralItemType {
  account: string;
  description: string;
  amount: number;
}

type FinancialEntry = {
  account: string;
  description: string;
  amount: number;
};

type StatementIncome = {
  totalExpense: number;
  totalIncome: number;
  periodUtility: number;
  taxOnProfits: number;
  managementResult: number;
  expenses: FinancialEntry[];
  income: FinancialEntry[];
};



interface Props {
  dateRange: DateRange,
  data: CashFlowResponseData
}

export const CashFlowPreview = ({ data, dateRange }: Props) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const iDate = dateRange.from && format(dateRange.from, FORMAT_DATE_INITIAL)
  const eDate = dateRange.to && format(dateRange.to, FORMAT_DATE_INITIAL)

  const messageDate = iDate && eDate
    ? (iDate === eDate ? `Del ${iDate}`
      : `Del ${iDate} al ${eDate}`)
    : `Del ${iDate}`

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
          <AccordionTrigger className="text-[#2563EB]">Balance General</AccordionTrigger>
          <AccordionContent>
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
                  <td className="text-right">{formatNumber(data.balanceSheet.totalActiveCurrent)}</td>
                </tr>
                {/* Activo corriente */}
                {data.balanceSheet.activeCurrentItems.map((item, index) => (
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
                  <td className="text-right">{formatNumber(data.balanceSheet.totalActiveNoCurrent)}</td>
                </tr>
                {data.balanceSheet.activeNoCurrentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.account}</td>
                    <td colSpan={2}>{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                {/* Resultado Activo */}
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Total Activo</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalActive)}</td>
                </tr>
                <tr className="h-5" />

                {/* PASIVOS */}
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Pasivo Corriente</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalLiabilityCurrent)}</td>
                </tr>
                {/* Pasivo corriente */}
                {data.balanceSheet.liabilityCurrentItems.map((item, index) => (
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
                  <td className="text-right">{formatNumber(data.balanceSheet.totalLiabilityNoCurrent)}</td>
                </tr>
                {data.balanceSheet.liabilityNoCurrentItems.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.account}</td>
                    <td colSpan={2}>{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                {/* Resultado Pasivo */}
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Total Pasivo</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalLiability)}</td>
                </tr>
                <tr className="h-5" />

                {/* PATRIMONIOS */}
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Patrimonio</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalEquity)}</td>
                </tr>
                {data.balanceSheet.equityItems.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.account}</td>
                    <td colSpan={2}>{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                {/* Resultados Patrimonio */}
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Total Patrimonio Neto</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalLiabilityNoCurrent)}</td>
                </tr>
                <tr style={{ fontWeight: 700 }} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={3}>Total Pasivo y Patrimonio</td>
                  <td className="text-right">{formatNumber(data.balanceSheet.totalLiabilityEquity)}</td>
                </tr>
                <tr className="h-5" />
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
          <AccordionTrigger className="text-[#2563EB]" >Estado de resultados</AccordionTrigger>
          <AccordionContent>
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
                  <td className="text-right">{formatNumber(data.statementIncome.totalIncome)}</td>
                </tr>
                {/* INGRESOS ITEMS */}
                {data.statementIncome.income.map((item, index) => (
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
                  <td className="text-right">{formatNumber(data.statementIncome.totalExpense)}</td>
                </tr>
                {/* GASTOS ITEMS */}
                {data.statementIncome.expenses.map((item, index) => (
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
                  <td className="text-right">{formatNumber(data.statementIncome.totalIncome)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3" colSpan={3}>Total Gastos</td>
                  <td className="text-right">{formatNumber(data.statementIncome.totalExpense)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3" colSpan={3}>Utilidades antes de impuestos</td>
                  <td className="text-right">{formatNumber((data.statementIncome.periodUtility))}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3" colSpan={3}>Impuestos alas utilidades</td>
                  <td className="text-right">{formatNumber((data.statementIncome.taxOnProfits))}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3" colSpan={3}>Resultado de la gestion</td>
                  <td className="text-right">{formatNumber(data.statementIncome.managementResult)}</td>
                </tr>
              </tbody>

            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
          <AccordionTrigger className="text-[#2563EB]">Estado de flujos de efectivo Directo</AccordionTrigger>
          <AccordionContent>
            <table className="text-left min-w-[700px] md:w-full text-xs md:text-sm lg:text-base text-[#4A4A4A] dark:text-[#ECECEC]">
              <thead>
                <tr>
                  <th className="text-base md:text-xl text-left md:text-center pb-3" colSpan={2}>
                    ESTADO DE FLUJO DE EFECTIVO - MÉTODO DIRECTO
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Cobros */}
                <tr className="font-bold hover:bg-green-500/20 dark:hover:bg-green-500/40">
                  <td>Cobros a clientes</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.cobrosClientes)}</td>
                </tr>
                <tr className="hover:bg-green-500/20 dark:hover:bg-green-500/40">
                  <td className="pl-3">Otros cobros</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.otrosCobros)}</td>
                </tr>
                <tr className="h-5" />

                {/* Pagos */}
                <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td colSpan={2}>Pagos</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Pagos por compras</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.pagosCompras)}</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Pagos por gastos de administración</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.pagosGastosAdmin)}</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Pagos por gastos de comercialización</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.pagosGastosComer)}</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Pagos por gastos financieros</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.pagosGastosFinan)}</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Pagos por impuestos</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.pagosImpuestos)}</td>
                </tr>
                <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td className="pl-3">Otros pagos</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.otrosPagos)}</td>
                </tr>
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades operativas */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Flujo de efectivo en actividades operativas</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.feao)}</td>
                </tr>

                {/* Resultado antes de intereses después de impuestos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Resultado antes de intereses después de impuestos</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.resultAntesInteresImp)}</td>
                </tr>

                {/* Partidas que no generan movimientos de efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Partidas que no generan movimientos de efectivo</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.partidasNoGeneranMov)}</td>
                </tr>

                {/* CAPEX */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>CAPEX</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.capex)}</td>
                </tr>

                {/* Movimientos netos en activos y pasivos operativos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Movimientos netos en activos y pasivos operativos</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.movNetosActivosPasivosOp)}</td>
                </tr>

                {/* FELF */}
                <tr className="font-bold hover:bg-green-500/20 dark:hover:bg-green-500/40">
                  <td>FELF</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.felf)}</td>
                </tr>

                {/* FELP */}
                <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td>FELP</td>
                  <td className="text-right">{formatNumber(data.clashFlowIndirect.felp)}</td>
                </tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
          <AccordionTrigger className="text-[#2563EB]">Estado de flujos de efectivo indirecto</AccordionTrigger>
          <AccordionContent>
            <table className="text-left min-w-[700px] md:w-full text-xs md:text-sm lg:text-base text-[#4A4A4A] dark:text-[#ECECEC]">
              <thead>
                <tr>
                  <th className="text-base md:text-xl text-left md:text-center pb-3" colSpan={3}>
                    ESTADO DE FLUJO DE EFECTIVO - MÉTODO INDIRECTO
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Resultado Neto */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Resultado Neto</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.netResult)}</td>
                </tr>

                {/* Partidas que no generan movimientos de efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={2}>Partidas que no generan movimientos de efectivo</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Depreciación de activos fijos</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.depActivosFijos)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Amortización de activos intangibles</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.amorActivosIntangibles)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Previsión para incobrabilidad</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.prevIncobrabilidad)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Previsión para obsolescencia de inventarios</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.prevObsDeInventarios)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Previsión para indemnizaciones</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.prevIndemnizaciones)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Pérdida en inversiones permanentes</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.perdidaInvPermanentes)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Ajuste por inflación y tenencia de bienes</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.ajusteInflacionTenBienes)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Diferencia de cambio</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.diferenciaDeBienes)}</td>
                </tr>
                <tr className="h-5" />

                {/* Movimientos netos en activos y pasivos operativos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={2}>Movimientos netos en activos y pasivos operativos</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Cuentas por cobrar comerciales</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.cuentasCobrarComer)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Otras cuentas por cobrar</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.otrasCuentasCobrar)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Inventario</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.inventario)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Anticipos a proveedores</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.anticiposProveedores)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Gastos prepagados</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.gastosPrepagados)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Cuentas por pagar comerciales</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.cuentasPagarComer)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Obligaciones fiscales y sociales</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.obligFiscalesSociales)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Intereses por pagar</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.interesesPagar)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Ingresos diferidos</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.ingresosDiferidos)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Otras cuentas por pagar</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.otrasCuentasPagar)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Previsión para indemnizaciones</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.previsionParaIndemn)}</td>
                </tr>
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades operativas */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Flujo de efectivo en actividades operativas</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feao)}</td>
                </tr>

                {/* Inversiones */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Inversiones</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Inversiones temporarias</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaoInvTemp)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Inversión en PPE</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaoInvPPE)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Inversión en activos intangibles</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaoInvActiveInt)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Inversiones permanentes</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaoInvPermanentes)}</td>
                </tr>
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades de inversión */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Flujo de efectivo en actividades de inversión</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feai)}</td>
                </tr>

                {/* Financiamiento */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Financiamiento</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Pago de dividendos</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaiPagoDividendos)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Deuda financiera</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaiDeudaFinanciera)}</td>
                </tr>
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td className="pl-3">Deuda bursátil</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaiDeudaBursatil)}</td>
                </tr>
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades de financiamiento */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Flujo de efectivo en actividades de financiamiento</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feaf)}</td>
                </tr>

                {/* Variación total en efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Variación en efectivo total</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feafEfectivTotal)}</td>
                </tr>

                {/* Saldo inicial */}
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Saldo al inicio</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feafSaldoInicio)}</td>
                </tr>

                {/* Efectos de la conversión monetaria */}
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Efectos de la conversión monetaria y otros métodos de conciliación</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.feafMonOtrosMetodos)}</td>
                </tr>

                {/* Saldo final */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Saldo al final</td>
                  <td className="text-right">{formatNumber(data.clashFlowDirect.saldoFinal)}</td>
                </tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}