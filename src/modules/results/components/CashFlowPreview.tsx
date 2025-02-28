import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { formatNumber } from "@/modules/shared/utils/validate"
import { format } from "date-fns";
import { DateRange } from "react-day-picker"

const mockup = {
  "balanceSheet": {
    "totalActiveCurrent": 278761.4,
    "totalActiveNoCurrent": 15751.8,
    "totalActive": 294513.2,
    "totalLiabilityCurrent": -2807.5499999999447,
    "totalLiabilityNoCurrent": 0,
    "totalLiability": -2807.5499999999447,
    "totalEquity": 320008.265,
    "totalLiabilityEquity": 317200.7150000001,
    "activeCurrentItems": [
      {
        "account": "111010100000",
        "description": "CAJA CENTRAL",
        "amount": 1.3599999999996726
      },
      {
        "account": "111010200000",
        "description": "CAJA VVI",
        "amount": 480
      },
      {
        "account": "111010300000",
        "description": "CAJA CHICA LP",
        "amount": 1000
      }
    ],
    "activeNoCurrentItems": [
      {
        "amountDetail": 0,
        "account": "122020100000",
        "description": " BOLETA DE GARANTÍA GESTION 2025 TRADECRUZ SRL",
        "amount": 15751.8
      }
    ],
    "liabilityCurrentItems": [
      {
        "account": "211010200001",
        "description": "FACT. CARMEN POR PAGAR - DIEGO",
        "amount": 4018
      },
      {
        "account": "211010200004",
        "description": "FACT. CARMEN POR PAGAR - CARMEN",
        "amount": -272
      }
    ],
    "liabilityNoCurrentItems": [
      {
        "account": "211010200001",
        "description": "FACT. CARMEN POR PAGAR - DIEGO",
        "amount": 4018
      }
    ],
    "equityItems": [
      {
        "account": "311040100000",
        "description": "RESULTADO ACUMULADO GESTIONES ANTERIORES",
        "amount": 297320.75
      },
      {
        "account": "311040300000",
        "description": "RESULTADO GESTION",
        "amount": 22687.515000000025
      }
    ]
  },
  "statementIncome": {
    "totalExpense": 97357.7,
    "totalIncome": 127607.72000000003,
    "periodUtility": 30250.020000000033,
    "taxOnProfits": 7562.505000000008,
    "managementResult": 22687.515000000025,
    "expenses": [
      {
        "account": "511010100002",
        "description": "UT ENCARGADO DANIEL CALLAO",
        "amount": 14285
      },
      {
        "account": "511020100005",
        "description": "OTRAS RETRIBUCIONES GESTORIA",
        "amount": 618
      }
    ],
    "income": [
      {
        "account": "411010100001",
        "description": "HT DANIEL CALLAO",
        "amount": 59050.00000000001
      },
      {
        "account": "411010100002",
        "description": "HT DIEGO CALLAO",
        "amount": 39407.950000000026
      }
    ]
  },
  cashFlowDirect: {
    cobros: [
      { description: "Cobros a clientes", amount: 3945053 },
      { description: "Otros cobros", amount: 171938 },
    ],
    pagos: [
      { description: "Pagos por compras", amount: -2395158 },
      { description: "Pagos por gastos de administración", amount: -130247 },
      { description: "Pagos por gastos de comercialización", amount: -467043 },
      { description: "Pagos por gastos financieros", amount: -106312 },
      { description: "Pagos por impuestos", amount: -92679 },
      { description: "Otros pagos", amount: -146929 },
    ],
    FEAO: { description: "Flujo de efectivo en actividades operativas", amount: 778623 },
    resultadoAntesIntereses: 391008,
    partidasNoEfectivo: 354187,
    CAPEX: -603756,
    movimientosNetos: 112729,
    FELF: 254168,
    FELP: -141763,
  },
  "clashFlowIndirect": {
    resultadoNeto: 311707,
    partidasNoEfectivo: [
      { description: "Depreciación de activos fijos", amount: 290862 },
      { description: "Amortización de activos intangibles", amount: 13364 },
      { description: "Previsión para incobrabilidad", amount: 23991 },
      { description: "Previsión para obsolescencia de inventarios", amount: 38246 },
      { description: "Previsión para indemnizaciones", amount: 13870 },
      { description: "Pérdida en inversiones permanentes", amount: -16247 },
      { description: "Ajuste por inflación y tenencia de bienes", amount: -18863 },
      { description: "Diferencia de cambio", amount: 8964 },
    ],
    movimientosNetos: [
      { description: "Cuentas por cobrar comerciales", amount: 156361 },
      { description: "Otras cuentas por cobrar", amount: 5712 },
      { description: "Inventario", amount: -95416 },
      { description: "Anticipos a proveedores", amount: -6272 },
      { description: "Gastos prepagados", amount: 43197 },
      { description: "Cuentas por pagar comerciales", amount: -22126 },
      { description: "Obligaciones fiscales y sociales", amount: 2717 },
      { description: "Intereses por pagar", amount: -3432 },
      { description: "Ingresos diferidos", amount: -11518 },
      { description: "Otras cuentas por pagar", amount: 3385 },
      { description: "Previsión para indemnizaciones", amount: 40121 },
    ],
    FEAO: { description: "Flujo de efectivo en actividades operativas", amount: 778623 },
    inversiones: [
      { description: "Inversiones temporarias", amount: 27416 },
      { description: "Inversión en PPE", amount: -480327 },
      { description: "Inversión en activos intangibles", amount: -123429 },
      { description: "Inversiones permanentes", amount: 164292 },
    ],
    FEAI: { description: "Flujo de efectivo en actividades de inversión", amount: -412048 },
    financiamiento: [
      { description: "Pago de dividendos", amount: -143301 },
      { description: "Deuda financiera", amount: -133501 },
      { description: "Deuda bursátil", amount: -183129 },
    ],
    FEAF: { description: "Flujo de efectivo en actividades de financiamiento", amount: -459931 },
    variacionEfectivo: -93356,
    saldoInicio: 203857,
    conversionMonetaria: 9899,
    saldoFinal: 120400,
  }
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
  data: {
    statementIncome: StatementIncome
    balanceSheet: CFBalanceGeneralType
  }
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
                {mockup.statementIncome.income.map((item, index) => (
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
                  <td colSpan={2}>Cobros</td>
                </tr>
                {mockup.cashFlowDirect.cobros.map((item, index) => (
                  <tr key={index} className="hover:bg-green-500/20 dark:hover:bg-green-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Pagos */}
                <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td colSpan={2}>Pagos</td>
                </tr>
                {mockup.cashFlowDirect.pagos.map((item, index) => (
                  <tr key={index} className="hover:bg-red-500/20 dark:hover:bg-red-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades operativas */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>{mockup.cashFlowDirect.FEAO.description}</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.FEAO.amount)}</td>
                </tr>

                {/* Resultado antes de intereses después de impuestos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Resultado antes de intereses después de impuestos</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.resultadoAntesIntereses)}</td>
                </tr>

                {/* Partidas que no generan movimientos de efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Partidas que no generan movimientos de efectivo</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.partidasNoEfectivo)}</td>
                </tr>

                {/* CAPEX */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>CAPEX</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.CAPEX)}</td>
                </tr>

                {/* Movimientos netos en activos y pasivos operativos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Movimientos netos en activos y pasivos operativos</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.movimientosNetos)}</td>
                </tr>

                {/* FELF */}
                <tr className="font-bold hover:bg-green-500/20 dark:hover:bg-green-500/40">
                  <td>FELF</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.FELF)}</td>
                </tr>

                {/* FELP */}
                <tr className="font-bold hover:bg-red-500/20 dark:hover:bg-red-500/40">
                  <td>FELP</td>
                  <td className="text-right">{formatNumber(mockup.cashFlowDirect.FELP)}</td>
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
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.resultadoNeto)}</td>
                </tr>

                {/* Partidas que no generan movimientos de efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={2}>Partidas que no generan movimientos de efectivo</td>
                </tr>
                {mockup.clashFlowIndirect.partidasNoEfectivo.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Movimientos netos en activos y pasivos operativos */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td colSpan={2}>Movimientos netos en activos y pasivos operativos</td>
                </tr>
                {mockup.clashFlowIndirect.movimientosNetos.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades operativas */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>{mockup.clashFlowIndirect.FEAO.description}</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.FEAO.amount)}</td>
                </tr>

                {/* Inversiones */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Inversiones</td>
                </tr>
                {mockup.clashFlowIndirect.inversiones.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades de inversión */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>{mockup.clashFlowIndirect.FEAI.description}</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.FEAI.amount)}</td>
                </tr>

                {/* Financiamiento */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Financiamiento</td>
                </tr>
                {mockup.clashFlowIndirect.financiamiento.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                    <td className="pl-3">{item.description}</td>
                    <td className="text-right">{formatNumber(item.amount)}</td>
                  </tr>
                ))}
                <tr className="h-5" />

                {/* Flujo de efectivo en actividades de financiamiento */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>{mockup.clashFlowIndirect.FEAF.description}</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.FEAF.amount)}</td>
                </tr>

                {/* Variación total en efectivo */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Variación en efectivo total</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.variacionEfectivo)}</td>
                </tr>

                {/* Saldo inicial */}
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Saldo al inicio</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.saldoInicio)}</td>
                </tr>

                {/* Efectos de la conversión monetaria */}
                <tr className="hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Efectos de la conversión monetaria y otros métodos de conciliación</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.conversionMonetaria)}</td>
                </tr>

                {/* Saldo final */}
                <tr className="font-bold hover:bg-blue-500/20 dark:hover:bg-blue-500/40">
                  <td>Saldo al final</td>
                  <td className="text-right">{formatNumber(mockup.clashFlowIndirect.saldoFinal)}</td>
                </tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}