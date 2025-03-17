"use client";

import { addDays, format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CashFlowTemplate } from "@/modules/shared/components/templatePDF/CashFlow";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";
import { DateSelector } from "@/modules/shared/components/DateSelector";
import { useQuery } from "@tanstack/react-query";
import { getAllDataCashFlow, getAllDataCashFlowTemporal } from "@/lib/data";
import { formatNumber } from "@/modules/shared/utils/validate";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelData } from "@/modules/results/types/types";
import { CashFlowPreview } from "@/modules/results/components/CashFlowPreview";

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
        "description": " BOLETA DE GARANTÍA GESTION 2025 NOXUN SRL",
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

export default function ClashFlowPage() {

  const initialDateRange: DateRange = {
    from: new Date(Date.now()),
  }

  const [pdfFile, setPdfFile] = useState<JSX.Element | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const [isLoadingCashFlow, setIsLoadingCashFlow] = useState(false)
  const [pendingLevel, setPendingLevel] = useState<LevelData>(1)

  const { data: dataCashFlow, refetch: refetchCashFlow } = useQuery({
    queryKey: ["AllCashFlow"],
    queryFn: () => getAllDataCashFlowTemporal({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      level: pendingLevel,
    }),
    enabled: false
  })


  const { data: dataCashFlowExcel, refetch: refetchCashFlowExcel, isRefetching: isRefetchingExcel } = useQuery({
    queryKey: ["AllCashFlowExcel"],
    queryFn: () => getAllDataCashFlow({
      iDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
      eDate: format(dateRange.to || new Date(), 'yyyy-MM-dd'),
      typeFetchBalance: 1,
    }),
    enabled: false
  })

  const handleOnDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setPdfFile(null)
      setDateRange({
        from: startDate,
        to: endDate
      })
    }
  };

  const handleOnGeneratePDF = async () => {
    setPdfFile(null)
    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = (
        <CashFlowTemplate />
      );
      setPdfFile(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente")
    } finally {
      setIsLoadingPDF(false);
    }
  };

  const handleOnGenerateExcel = async () => {
    toast.info('Generando Excel...')

    try {
      const { data: linkExcel } = await refetchCashFlowExcel()

      if (!linkExcel) {
        throw new Error();
      }

      const link = document.createElement("a");
      link.href = linkExcel;
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al generar el archivo:", error);
      toast.error('Error al generar el archivo.');
    }
  }

  const handleOnRefetch = async () => {
    setIsLoadingCashFlow(true)
    await refetchCashFlow()
    console.log('tenemos los datos de: ', dataCashFlow)
    setIsLoadingCashFlow(false)
  }
  const messageDate = "Del 2024/01/01"

  return (
    <div className="flex flex-col gap-6 h-full">
      <BreadcrumbDashboard
        items={[
          {
            label: "Panel",
            href: "/dashboard/accounting"
          },
          {
            label: "Reportes",
            href: "#"
          },
          {
            label: "Flujo de efectivo",
            href: "/dashboard/accounting/results/cash-flow"
          }
        ]}
      />
      <div className="flex items-center justify-center gap-6">
        <DateSelector onDateChange={handleOnDateChange} />
        <Select
          value={pendingLevel.toString()}
          onValueChange={(value) => setPendingLevel(Number(value) as LevelData)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Selecciona un nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Jerarquia</SelectLabel>
              <SelectItem value="6">nivel 1</SelectItem>
              <SelectItem value="5">nivel 2</SelectItem>
              <SelectItem value="4">nivel 3</SelectItem>
              <SelectItem value="3">nivel 4</SelectItem>
              <SelectItem value="2">nivel 5</SelectItem>
              <SelectItem value="1">nivel 6</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleOnRefetch} disabled={isLoadingCashFlow}>
          {isLoadingCashFlow ? "Cargando..." : "Ver Resultados"}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* <Button
          onClick={handleOnGeneratePDF}
          className="w-fit"
        >
          {isLoadingPDF
            ? (<><LoaderIcon className="animate-spin" /> Generando PDF</>)
            : 'Generar PDF'}
        </Button> */}
        <Button
          className="w-fit flex gap-1 items-center"
          onClick={handleOnGenerateExcel}
          title={"Generar Excel"}
          disabled={isRefetchingExcel || !dateRange}
        >
          {
            isRefetchingExcel
              ? <><LoaderIcon className="animate-spin" />Cargando...</>
              : <>Generar Excel</>
          }
        </Button>
      </div>

      {/* <div>
        {
          pdfFile && (
            <ButtonLinkPDF
              pdfFile={pdfFile}
            // nameFile="R_balance_general"
            />
          )
        }
      </div> */}

      {
        dataCashFlow && (
          <CashFlowPreview
            dateRange={dateRange}
            data={{
              balanceSheet: dataCashFlow?.balanceSheet,
              statementIncome: dataCashFlow?.statementIncome
            }}
          />
        )
      }

    </div>
  );
}
