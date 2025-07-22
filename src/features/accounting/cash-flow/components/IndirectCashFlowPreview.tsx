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
    return <div>Error al cargar los datos del flujo de efectivo indirecto.</div>;

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

  const renderActivitySection = (
    title: string,
    activities: Array<{
      description: string | null;
      isTitle: boolean;
      amount: number | null;
    }> | null,
    colorClass: string
  ) => {
    if (!activities) return null;

    return (
      <>
        <tr className={`font-bold ${colorClass}`}>
          <td colSpan={2} className="py-2">{title}</td>
        </tr>
        {activities.map((activity, index) => {
          if (!activity.description) return null;
          
          return (
            <tr 
              key={index} 
              className={`${colorClass} ${activity.isTitle ? 'font-bold' : ''}`}
            >
              <td className={activity.isTitle ? '' : 'pl-3'}>
                {activity.description}
              </td>
              <td className="text-right">
                {activity.amount !== null ? formatNumber(activity.amount) : '-'}
              </td>
            </tr>
          );
        })}
        <tr className="h-3" />
      </>
    );
  };

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
              {/* Actividades de Operación */}
              {renderActivitySection(
                "Actividades de Operación",
                cashFlowIndirect.operationActivities,
                "hover:bg-blue-500/20 dark:hover:bg-blue-500/40"
              )}

              {/* Actividades de Inversión */}
              {renderActivitySection(
                "Actividades de Inversión",
                cashFlowIndirect.investmentActivities,
                "hover:bg-green-500/20 dark:hover:bg-green-500/40"
              )}

              {/* Actividades de Financiación */}
              {renderActivitySection(
                "Actividades de Financiación",
                cashFlowIndirect.financingActivities,
                "hover:bg-yellow-500/20 dark:hover:bg-yellow-500/40"
              )}

              {/* Resumen */}
              <tr className="h-5" />
              <tr className="font-bold hover:bg-purple-500/20 dark:hover:bg-purple-500/40">
                <td>Variación neta de efectivo y demás equivalentes de efectivo</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.netChangeInCash)}
                </td>
              </tr>
              <tr className="hover:bg-purple-500/20 dark:hover:bg-purple-500/40">
                <td>Efectivo y equivalentes al principio del periodo</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.cashAndCashEquivalentsStartPeriod)}
                </td>
              </tr>
              <tr className="hover:bg-purple-500/20 dark:hover:bg-purple-500/40">
                <td>Efectivo y equivalentes al final del periodo</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.cashAndCashEquivalentsEndPeriod)}
                </td>
              </tr>
              
              <tr className="h-3" />
              <tr className="font-bold hover:bg-gray-500/20 dark:hover:bg-gray-500/40">
                <td>SALDO FINAL DE EFECTIVO Y SUS EQUIVALENTES SEGÚN BALANCE GENERAL</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.finalBalanceBalanceSheet)}
                </td>
              </tr>
              <tr className="font-bold hover:bg-gray-500/20 dark:hover:bg-gray-500/40">
                <td>DIFERENCIA</td>
                <td className="text-right">
                  {formatNumber(cashFlowIndirect.difference)}
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
