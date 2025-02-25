"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbDashboard } from "@/modules/shared/components/BreadcrumDash"
import { DateSelector } from "@/modules/shared/components/DateSelector"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { FinancialRatiosBarChart } from "@/modules/results/components/FinancialRatiosBarChar";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFinancialRateExcelByDate, getFinancialRatiosByDate } from "@/modules/results/lib/data_results";
import { toast } from "sonner";
import { format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { FinancialRatiosTemplate } from "@/modules/shared/components/templatePDF/FinancialRatios";
import { FinancialRatiosCard } from "@/modules/results/components/FinancialRatioCard";
import { ButtonLinkPDF } from "@/modules/results/components/ButtonLinkPDF";
import { getMessageProfitability, getMessageROA, getMessageROE, getMessageROI } from "@/modules/results/lib/utils";


export default function FinancialRatiosPage() {
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [filePDF, setFilePDF] = useState<JSX.Element | null>(null)
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)
  const { data: FinancialRatiosData, refetch: refetchFinancialRatios } = useQuery({
    queryKey: ['FinancialRatiosData'],
    queryFn: () => {
      return getFinancialRatiosByDate({
        initDate: format(dateRange?.from ?? new Date(), 'yyyy/MM/dd'),
        endDate: format(dateRange?.to ?? new Date(), 'yyyy/MM/dd'),
      })
    },
    enabled: false
  })

  const { refetch: refetchExcel, isFetching: isFetchingExcel } = useQuery<string>({
    queryKey: ['financialRateExcel', dateRange],
    queryFn: async () => {
      const initDate = format(dateRange?.from ?? new Date(), 'yyyy/MM/dd');
      const endDate = format(dateRange?.to ?? new Date(), 'yyyy/MM/dd');
      return await getFinancialRateExcelByDate({ initDate, endDate });
    },
    enabled: false
  });

  const formattedFinancialRatios = {
    liquidityRatios: {
      title: "Ratios de Liquidez",
      items: [
        {
          name: "Liquidez Corriente",
          value: FinancialRatiosData?.liquidityRatios.currentLiquidity ?? 0,
          interpretation:
            FinancialRatiosData?.liquidityRatios.currentLiquidity ?? 0 >= 1
              ? `Cuenta con ${FinancialRatiosData?.liquidityRatios.currentLiquidity.toFixed(2)} Bs por cada 1 Bs de deuda a corto plazo.`
              : `Solo dispone de ${FinancialRatiosData?.liquidityRatios.currentLiquidity.toFixed(2)} Bs por cada 1 Bs de deuda, lo que puede ser riesgoso.`,
        },
        {
          name: "Prueba Ácida",
          value: FinancialRatiosData?.liquidityRatios.acidTest ?? 0,
          interpretation:
            FinancialRatiosData?.liquidityRatios.acidTest ?? 0 >= 1
              ? `Tiene ${FinancialRatiosData?.liquidityRatios.acidTest.toFixed(2)} Bs en activos líquidos (sin inventario) por cada 1 Bs de deuda.`
              : `Solo dispone de ${FinancialRatiosData?.liquidityRatios.acidTest.toFixed(2)} Bs en activos líquidos, lo que puede indicar falta de liquidez.`,
        },
        {
          name: "Razón de Efectivo",
          value: FinancialRatiosData?.liquidityRatios.cashRatio ?? 0,
          interpretation:
            FinancialRatiosData?.liquidityRatios.cashRatio ?? 0 >= 1
              ? `Tiene ${FinancialRatiosData?.liquidityRatios.cashRatio.toFixed(2)} Bs en efectivo por cada 1 Bs de deuda, asegurando liquidez inmediata.`
              : `Solo dispone de ${FinancialRatiosData?.liquidityRatios.cashRatio.toFixed(2)} Bs en efectivo por cada 1 Bs de deuda, lo que podría ser un riesgo.`,
        },
        {
          name: "Capital de Trabajo Neto",
          value: FinancialRatiosData?.liquidityRatios.netWorkingCapital ?? 0,
          interpretation:
            FinancialRatiosData?.liquidityRatios.netWorkingCapital ?? 0 >= 0
              ? `Tiene un excedente de ${FinancialRatiosData?.liquidityRatios.netWorkingCapital.toFixed(2)} Bs después de cubrir sus pasivos a corto plazo.`
              : `El capital de trabajo es negativo en ${FinancialRatiosData?.liquidityRatios.netWorkingCapital.toFixed(2)} Bs, posible señal de problemas de liquidez.`,
        },
      ]
    },
    debtRatios: {
      title: "Ratios de Endeudamiento",
      items: [
        {
          name: "Pasivo/Activo",
          value: FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0,
          interpretation:
            FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0 > 100
              ? `Un ratio de ${FinancialRatiosData?.debtRatios.liabilityToAsset}% indica que la empresa tiene más pasivos que activos, lo que puede ser riesgoso.`
              : `Un ratio de ${FinancialRatiosData?.debtRatios.liabilityToAsset}% indica que la empresa tiene más activos que pasivos, lo cual es positivo.`,
        },
        {
          name: "Pasivo/Patrimonio",
          value: FinancialRatiosData?.debtRatios.liabilityToEquity ?? 0,
          interpretation:
            FinancialRatiosData?.debtRatios.liabilityToEquity ?? 0 > 100
              ? `Un ratio de ${FinancialRatiosData?.debtRatios.liabilityToEquity}% indica que la empresa tiene más pasivos que patrimonio, lo que implica un alto nivel de endeudamiento.`
              : `Un ratio de ${FinancialRatiosData?.debtRatios.liabilityToEquity}% indica que la empresa tiene más patrimonio que pasivos, lo cual reduce el riesgo financiero.`,
        },
        {
          name: "Deuda/Activo",
          value: FinancialRatiosData?.debtRatios.debtToAsset ?? 0,
          interpretation:
            FinancialRatiosData?.debtRatios.debtToAsset ?? 0 > 50
              ? `Un ratio de ${FinancialRatiosData?.debtRatios.debtToAsset}% indica que más de la mitad de los activos están financiados con deuda, lo que puede generar obligaciones financieras elevadas.`
              : `Un ratio de ${FinancialRatiosData?.debtRatios.debtToAsset}% indica que la empresa depende menos de la deuda para financiar sus activos.`,
        },
        {
          name: "Deuda/Patrimonio",
          value: FinancialRatiosData?.debtRatios.debtToEquity ?? 0,
          interpretation:
            FinancialRatiosData?.debtRatios.debtToEquity ?? 0 > 100
              ? `Un ratio de ${FinancialRatiosData?.debtRatios.debtToEquity}% indica que la deuda es mayor que el patrimonio, lo que puede aumentar el riesgo financiero.`
              : `Un ratio de ${FinancialRatiosData?.debtRatios.debtToEquity}% indica que el patrimonio cubre la mayor parte de la deuda, lo cual es positivo.`,
        },
        {
          name: "Deuda/Pasivo",
          value: FinancialRatiosData?.debtRatios.debtToLiability ?? 0,
          interpretation:
            FinancialRatiosData?.debtRatios.debtToLiability ?? 0 > 50
              ? `Un ratio de ${FinancialRatiosData?.debtRatios.debtToLiability}% indica que más de la mitad de los pasivos corresponden a deuda financiera, lo que puede generar una alta carga financiera.`
              : `Un ratio de ${FinancialRatiosData?.debtRatios.debtToLiability}% indica que la mayor parte de los pasivos no provienen de deuda financiera, lo cual da más estabilidad.`,
        }
      ]
    },
    profitabilityRatios: {
      title: "Ratios de Rentabilidad",
      items: [
        {
          name: "Rentabilidad",
          value: FinancialRatiosData?.profitabilityRatios.profitability ?? 0,
          interpretation: getMessageProfitability((FinancialRatiosData?.profitabilityRatios.profitability ?? 0) * 100)
        },
        {
          name: "ROI",
          value: FinancialRatiosData?.profitabilityRatios.roi ?? 0,
          interpretation: getMessageROI((FinancialRatiosData?.profitabilityRatios.roi ?? 0) * 100)
        },
        {
          name: "ROE",
          value: FinancialRatiosData?.profitabilityRatios.roe ?? 0,
          interpretation: getMessageROE((FinancialRatiosData?.profitabilityRatios.roe ?? 0) * 100)
        },
        {
          name: "ROA",
          value: FinancialRatiosData?.profitabilityRatios.roa ?? 0,
          interpretation: getMessageROA((FinancialRatiosData?.profitabilityRatios.roa ?? 0) * 100)
        }
      ]
    }
  };

  const financialDataForChart = Object.values(formattedFinancialRatios).flatMap(category =>
    category.items.map(({ name, value }) => ({
      name,
      value
    }))
  );


  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({
        from: startDate,
        to: endDate,
      });
    }
  };

  const handleOnGenerateExcel = async () => {
    toast('generando excel...')

    const { data, error } = await refetchExcel()

    if (error) {
      toast.error('Algo salió mal...');
      console.error(error);
      return;
    }


    if (data && data.toString().startsWith('http')) {
      const linkExcel = data.toString()
      const ancore = document.createElement('a')
      ancore.href = linkExcel
      ancore.click()
      ancore.remove()
    } else {
      toast.error('Error al generar el archivo')
      console.error('La respuesta no es un Blob')
    }

  };

  const handleOnGeneratePDF = async () => {
    setFilePDF(null)
    if (!dateRange) return
    if (!formattedFinancialRatios) return

    try {
      setIsLoadingPDF(true);
      toast("Generando reporte...");
      const MyDocument = (
        <FinancialRatiosTemplate
          dateRange={dateRange}
          records={formattedFinancialRatios}
        />
      );
      setFilePDF(MyDocument);
      toast.success("Reporte generado exitosamente");
    } catch (error) {
      toast.error("Error al generar el reporte, intente nuevamente")
    } finally {
      setIsLoadingPDF(false);
    }
  }

  const handleOnRefetch = async () => {
    toast.info('obteniendo ratios...')
    await refetchFinancialRatios()
  }


  return (
    <>
      <main className="max-w-7xl flex flex-col gap-4">
        <BreadcrumbDashboard
          items={[
            {
              label: "Panel",
              href: "/dashboard",
            },
            {
              label: "Result",
              href: "#",
            },
            {
              label: "Ratios Financieros",
              href: "/dashboard/results/financial-ratios",
            },
          ]}
        />
        <div className="flex gap-6 justify-center items-center">
          <DateSelector
            onDateChange={handleDateChange}
          />
          <Button onClick={handleOnRefetch}>
            Listar
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            className="w-fit flex gap-1 items-center"
            onClick={handleOnGenerateExcel}
            title={"Generar Excel"}
            disabled={isFetchingExcel || !dateRange || !FinancialRatiosData}
          >
            {
              isFetchingExcel
                ? <><LoaderIcon className="animate-spin" />Cargando...</>
                : <>Generar Excel</>
            }

          </Button>
          <Button
            onClick={handleOnGeneratePDF}
            disabled={!FinancialRatiosData || !dateRange}
          >
            {isLoadingPDF ? 'Generando PDF...' : 'Generar PDF'}
          </Button>
        </div>

        {
          filePDF && (
            <ButtonLinkPDF
              pdfFile={filePDF}
              nameFile={`Ratios_Financieros`}
            />
          )
        }

        {
          dateRange?.to && FinancialRatiosData && (
            <>
              <FinancialRatiosCard
                title={formattedFinancialRatios.liquidityRatios.title}
                financialRatios={formattedFinancialRatios.liquidityRatios.items}
              />

              <FinancialRatiosCard
                title={formattedFinancialRatios.debtRatios.title}
                financialRatios={formattedFinancialRatios.debtRatios.items}
              />

              <FinancialRatiosCard
                title={formattedFinancialRatios.profitabilityRatios.title}
                financialRatios={formattedFinancialRatios.profitabilityRatios.items}
              />

              {/* grafico de barras */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-xl md:text-2xl">Comparación de Ratios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-[800px]">
                    <FinancialRatiosBarChart data={financialDataForChart} />
                  </div>
                </CardContent>
              </Card>
            </>
          )
        }
      </main>
    </>
  )
}


