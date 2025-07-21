import { useIndirectDirectCashFlow } from "../hooks/useIndirectDirectCashFlow";
import { formatNumber } from "../../shared/utils/validate";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBalanceSheetConfigStatus } from "../hooks/useCashFlowQueries";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function IndirectCashFlowPreview() {
  const {
    data: balanceSheetConfigStatus,
    isLoading: isLoadingBalanceSheetStatus,
    isError: isErrorBalanceSheetStatus,
  } = useBalanceSheetConfigStatus();

  const {
    data: cashFlowIndirect,
    isLoading,
    isError,
  } = useIndirectDirectCashFlow(
    balanceSheetConfigStatus || isErrorBalanceSheetStatus
  );

  if (isError)
    return <div>Error al cargar los datos del flujo de efectivo directo.</div>;

  if (!balanceSheetConfigStatus) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-[#2563EB]">
            Estado de flujos de efectivo Indirecto
          </AccordionTrigger>
          <AccordionContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Balance general no configurado</AlertTitle>
              <AlertDescription>
                Por favor, sube el balance general para continuar.
              </AlertDescription>
            </Alert>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  if (isLoading || !cashFlowIndirect || isLoadingBalanceSheetStatus)
    return <div>Cargando...</div>;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem className="dark:text-[#bbbbbb]" value="item-1">
        <AccordionTrigger className="text-[#2563EB]">
          Estado de flujos de efectivo Indirecto
        </AccordionTrigger>
        <AccordionContent>
          <table className="text-left min-w-[700px] md:w-full text-xs md:text-sm lg:text-base text-[#4A4A4A] dark:text-[#ECECEC]">
            <thead>
              <tr>
                <th
                  className="text-base md:text-xl text-left md:text-center pb-3"
                  colSpan={2}
                >
                  ESTADO DE FLUJO DE EFECTIVO - MÉTODO INDIRECTO
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Cobros */}
              <tr className="font-bold hover:bg-green-500/20 dark:hover:bg-green-500/40">
                <td>Cobros a clientes</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.cobrosClientes)}
                </td>
              </tr>
              <tr className="hover:bg-green-500/20 dark:hover:bg-green-500/40">
                <td className="pl-3">Otros cobros</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.otrosCobros)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Pagos */}
              <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td colSpan={2}>Pagos</td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Pagos por compras</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.pagosCompras)}
                </td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Pagos por gastos de administración</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.pagosGastosAdmin)}
                </td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Pagos por gastos de comercialización</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.pagosGastosComer)}
                </td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Pagos por gastos financieros</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.pagosGastosFinan)}
                </td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Pagos por impuestos</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.pagosImpuestos)}
                </td>
              </tr>
              <tr className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td className="pl-3">Otros pagos</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.otrosPagos)}
                </td>
              </tr>
              <tr className="h-5" />

              {/* Flujo de efectivo en actividades operativas */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Flujo de efectivo en actividades operativas</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.feao)}
                </td>
              </tr>

              {/* Resultado antes de intereses después de impuestos */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Resultado antes de intereses después de impuestos</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.resultAntesInteresImp)}
                </td>
              </tr>

              {/* Partidas que no generan movimientos de efectivo */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Partidas que no generan movimientos de efectivo</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.partidasNoGeneranMov)}
                </td>
              </tr>

              {/* CAPEX */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>CAPEX</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.capex)}
                </td>
              </tr>

              {/* Movimientos netos en activos y pasivos operativos */}
              <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                <td>Movimientos netos en activos y pasivos operativos</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.movNetosActivosPasivosOp)}
                </td>
              </tr>

              {/* FELF */}
              <tr className="font-bold hover:bg-green-500/20 dark:hover:bg-green-500/40">
                <td>FELF</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.felf)}
                </td>
              </tr>

              {/* FELP */}
              <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                <td>FELP</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.felp)}
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
