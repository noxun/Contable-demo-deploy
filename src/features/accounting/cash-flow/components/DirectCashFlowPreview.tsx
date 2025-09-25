import { useDirectCashFlow } from "../hooks/useDirectCashFlow";
import { formatNumber } from "../../shared/utils/validate";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBalanceSheetConfigStatus } from "../hooks/useCashFlowQueries";

export function DirectCashFlowPreview() {
  const { data: cashFlowDirect, isLoading, isError } = useDirectCashFlow();

  if (isError)
    return <div>Error al cargar los datos del flujo de efectivo directo.</div>;
  if (isLoading || !cashFlowDirect) return <div>Cargando...</div>;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
        <AccordionTrigger className="text-[#2563EB]">
          Estado de flujos de efectivo directo
        </AccordionTrigger>
        <AccordionContent>
          <table className="text-left min-w-[700px] md:w-full text-xs md:text-sm lg:text-base text-[#4A4A4A] dark:text-[#ECECEC]">
            <thead>
              <tr>
                <th
                  className="text-base md:text-xl text-left md:text-center pb-3"
                  colSpan={3}
                >
                  ESTADO DE FLUJO DE EFECTIVO - MÉTODO DIRECTO
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Resultado Neto */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Resultado Neto</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.netResult)}
                </td>
              </tr>

              {/* Partidas que no generan movimientos de efectivo */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td colSpan={2}>
                  Partidas que no generan movimientos de efectivo
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Depreciación de activos fijos</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.depActivosFijos)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Amortización de activos intangibles</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.amorActivosIntangibles)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Previsión para incobrabilidad</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.prevIncobrabilidad)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">
                  Previsión para obsolescencia de inventarios
                </td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.prevObsDeInventarios)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Previsión para indemnizaciones</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.prevIndemnizaciones)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Pérdida en inversiones permanentes</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.perdidaInvPermanentes)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">
                  Ajuste por inflación y tenencia de bienes
                </td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.ajusteInflacionTenBienes)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Diferencia de cambio</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.diferenciaDeBienes)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Movimientos netos en activos y pasivos operativos */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td colSpan={2}>
                  Movimientos netos en activos y pasivos operativos
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Cuentas por cobrar comerciales</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.cuentasCobrarComer)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Otras cuentas por cobrar</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.otrasCuentasCobrar)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Inventario</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.inventario)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Anticipos a proveedores</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.anticiposProveedores)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Gastos prepagados</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.gastosPrepagados)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Cuentas por pagar comerciales</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.cuentasPagarComer)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Obligaciones fiscales y sociales</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.obligFiscalesSociales)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Intereses por pagar</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.interesesPagar)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Ingresos diferidos</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.ingresosDiferidos)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Otras cuentas por pagar</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.otrasCuentasPagar)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Previsión para indemnizaciones</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.previsionParaIndemn)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Flujo de efectivo en actividades operativas */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Flujo de efectivo en actividades operativas</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feao)}
                </td>
              </tr>

              {/* Inversiones */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Inversiones</td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Inversiones temporarias</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaoInvTemp)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Inversión en PPE</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaoInvPPE)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Inversión en activos intangibles</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaoInvActiveInt)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Inversiones permanentes</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaoInvPermanentes)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Flujo de efectivo en actividades de inversión */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Flujo de efectivo en actividades de inversión</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feai)}
                </td>
              </tr>

              {/* Financiamiento */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Financiamiento</td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Pago de dividendos</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaiPagoDividendos)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Deuda financiera</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaiDeudaFinanciera)}
                </td>
              </tr>
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td className="pl-3">Deuda bursátil</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaiDeudaBursatil)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Flujo de efectivo en actividades de financiamiento */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Flujo de efectivo en actividades de financiamiento</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feaf)}
                </td>
              </tr>

              {/* Variación total en efectivo */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Variación en efectivo total</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feafEfectivTotal)}
                </td>
              </tr>

              {/* Saldo inicial */}
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Saldo al inicio</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feafSaldoInicio)}
                </td>
              </tr>

              {/* Efectos de la conversión monetaria */}
              <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>
                  Efectos de la conversión monetaria y otros métodos de
                  conciliación
                </td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.feafMonOtrosMetodos)}
                </td>
              </tr>

              {/* Saldo final */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Saldo al final</td>
                <td className="text-right">
                  {formatNumber(cashFlowDirect.saldoFinal)}
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
