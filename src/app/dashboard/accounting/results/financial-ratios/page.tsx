"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbDashboard } from "@/features/accounting/shared/components/BreadcrumDash"
import { DateSelector } from "@/features/accounting/shared/components/DateSelector"
import { useCallback, useState } from "react"
import { DateRange } from "react-day-picker"
import { FinancialRatiosBarChart } from "@/features/accounting/results/components/FinancialRatiosBarChar";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFinancialRateExcelByDate, getFinancialRatiosByDate } from "@/features/accounting/results/lib/data_results";
import { toast } from "sonner";
import { format } from "date-fns";
import { LoaderIcon } from "lucide-react";
import { FinancialRatiosTemplate } from "@/features/accounting/shared/components/templatePDF/FinancialRatios";
import { FinancialRatiosCard } from "@/features/accounting/results/components/FinancialRatioCard";
import { ButtonLinkPDF } from "@/features/accounting/results/components/ButtonLinkPDF";
import { getMessageProfitability, getMessageROA, getMessageROE, getMessageROI } from "@/features/accounting/results/lib/utils";


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
          formula:"Activo Corriente / Pasivo Corriente",
          valores: [
            {title:"Activo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentAsset},
            {title:"Pasivo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentLiability},
          ],
          interpretation:
            FinancialRatiosData?.liquidityRatios.currentLiquidity ?? 0 >= 1
              ? `Con un ratio de ${FinancialRatiosData?.liquidityRatios.currentLiquidity.toFixed(2)}, la empresa puede pagar sus deudas a corto plazo.`
              : `con un resultado menor a 1, la empresa no puede pagar sus deudas con sus activos más líquidos.`,
          isPercentage: false
        },
        {
          name: "Prueba Ácida",
          value: FinancialRatiosData?.liquidityRatios.acidTest ?? 0,
          formula:"(Activo Corriente - Inventarios) / Pasivo Corriente",
          valores: [
            {title:"Activo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentAsset},
            {title:"Inventarios", monto: FinancialRatiosData?.liquidityRatios.acidInventories},
            {title:"Pasivo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentLiability},
          ],
          interpretation:
            FinancialRatiosData?.liquidityRatios.acidTest ?? 0 >= 1
              ? `Con un ratio de ${FinancialRatiosData?.liquidityRatios.acidTest.toFixed(2)}, la empresa tiene suficientes activos líquidos para cubrir sus obligaciones a corto plazo.`
              : `Con un ratio menor a 1, indica que la empresa podría tener dificultades para pagar sus obligaciones a corto plazo`,
          isPercentage: false
        },
        {
          name: "Razón de Efectivo",
          value: (FinancialRatiosData?.liquidityRatios.cashRatio ?? 0) * 100,
          formula:"Pasivo Corriente / Disponibilidades",
          valores: [
            {title:"Pasivo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentLiability},
            {title:"Disponibilidades", monto: 0},
          ],
          interpretation:
            FinancialRatiosData?.liquidityRatios.cashRatio ?? 0 >= 1
              ? `Con un ratio de ${FinancialRatiosData?.liquidityRatios.cashRatio.toFixed(1)}, la empresa dispone de suficiente efectivo para cubrir sus pasivos corrientes.`
              : `Un valor inferior a 1 indica que la empresa no tiene suficiente efectivo para pagar sus pasivos corrientes. `,
          isPercentage: true
        },
        {
          name: "Capital de Trabajo Neto",
          value: FinancialRatiosData?.liquidityRatios.netWorkingCapital ?? 0,
          formula:"Activo Corriente - Pasivo Corriente",
          valores: [
            {title:"Activo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentAsset},
            {title:"Pasivo Corriente Total", monto: FinancialRatiosData?.liquidityRatios.liqCurrentLiability},
          ],
          interpretation:
            FinancialRatiosData?.liquidityRatios.netWorkingCapital ?? 0 >= 0
              ? `Con un capital de trabajo neto positivo de ${FinancialRatiosData?.liquidityRatios.netWorkingCapital.toFixed(2)}, la empresa es más capaz de enfrentar emergencias financieras y aprovechar oportunidades comerciales.`
              : `Con un capital de trabajo neto negativo, la empresa tendría dificultades para enfrentar emergencias financieras y no podría aprovechar oportunidades comerciales.`,
          isPercentage: false
        },
      ]
    },
    debtRatios: {
      title: "Ratios de Endeudamiento",
      items: [
        {
          name: "Pasivo/Activo",
          value: (FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0) * 100,
          formula:"(Pasivo Coriente + Pasivo No Corriente) / Activo Total",
          valores: [
            {title:"Pasivo Corriete Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentLiability},
            {title:"Pasivo No Corriente Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentNonLiability},
            {title:"Activo Total", monto: FinancialRatiosData?.debtRatios.ltaAssetTotal},
          ],
          interpretation:
            ((FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0) > 1)
              ? `Un ratio de ${((FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0) * 100)}% indica que la empresa tiene más pasivos que activos, lo que puede ser riesgoso.`
              : `Un ratio de ${((FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0) * 100)}% indica que la empresa tiene más activos que pasivos, lo cual es positivo.`,
          isPercentage: true
        },
        {
          name: "Pasivo/Patrimonio",
          value: (FinancialRatiosData?.debtRatios.liabilityToEquity ?? 0) * 100,
          formula:"(Pasivo Coriente + Pasivo No Corriente) / Patrimonio Neto",
          valores: [
            {title:"Pasivo Corriete Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentLiability},
            {title:"Pasivo No Corriente Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentNonLiability},
            {title:"Patrimonio Neto Total", monto: FinancialRatiosData?.debtRatios.lteNetEquity},
          ],
          interpretation:
            ((FinancialRatiosData?.debtRatios.liabilityToAsset ?? 0) > 1)
              ? `Un ratio de ${((FinancialRatiosData?.debtRatios.liabilityToEquity ?? 0) * 100)}% indica que la empresa tiene más pasivos que patrimonio, lo que implica un alto nivel de endeudamiento.`
              : `Un ratio de ${((FinancialRatiosData?.debtRatios.liabilityToEquity ?? 0) * 100)}% indica que la empresa tiene más patrimonio que pasivos, lo cual reduce el riesgo financiero.`,
          isPercentage: true
        },
        {
          name: "Deuda/Activo",
          value: (FinancialRatiosData?.debtRatios.debtToAsset ?? 0) * 100,
          formula:"(Deudas Fin.(corto p.) + Deudas Fin.(largo p.)) / Activo Total",
          valores: [
            {title:"Deudas Financieras(corto plazo)", monto: FinancialRatiosData?.debtRatios.dtaShortFinancialDebts},
            {title:"Deudas Financieras(largo plazo)", monto: FinancialRatiosData?.debtRatios.dtaLongFinancialDebts},
            {title:"Activo Total", monto: FinancialRatiosData?.debtRatios.dtaAssetTotal},
          ],
          interpretation:
            FinancialRatiosData?.debtRatios.debtToAsset ?? 0 > 50
              ? `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToAsset ?? 0) * 100)}% indica que más de la mitad de los activos están financiados con deuda, lo que puede generar obligaciones financieras elevadas.`
              : `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToAsset ?? 0) * 100)}% indica que la empresa depende menos de la deuda para financiar sus activos.`,
          isPercentage: true
        },
        {
          name: "Deuda/Patrimonio",
          value: (FinancialRatiosData?.debtRatios.debtToEquity ?? 0) * 100,
          formula:"(Deudas Fin.corto  + Deudas Fin. largo) / Patrimonio Neto",
          valores: [
            {title:"Deudas Financieras(corto plazo)", monto: FinancialRatiosData?.debtRatios.dtaShortFinancialDebts},
            {title:"Deudas Financieras(largo plazo)", monto: FinancialRatiosData?.debtRatios.dtaLongFinancialDebts},
            {title:"Patrimonio Neto Total", monto: FinancialRatiosData?.debtRatios.dteNetEquity},
          ],
          interpretation:
            FinancialRatiosData?.debtRatios.debtToEquity ?? 0 > 100
              ? `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToEquity ?? 0) * 100)}% indica que la deuda es mayor que el patrimonio, lo que puede aumentar el riesgo financiero.`
              : `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToEquity ?? 0) * 100)}% indica que el patrimonio cubre la mayor parte de la deuda, lo cual es positivo.`,
          isPercentage: true
        },
        {
          name: "Deuda/Pasivo",
          value: (FinancialRatiosData?.debtRatios.debtToLiability ?? 0) * 100,
          formula:"(Deudas Fin.(corto p.) + Deudas Fin.(largo p.)) / (Pasivo Corriente + Pasivo No Corriente)",
          valores: [
            {title:"Deudas Financieras(corto plazo)", monto: FinancialRatiosData?.debtRatios.dtaShortFinancialDebts},
            {title:"Deudas Financieras(largo plazo)", monto: FinancialRatiosData?.debtRatios.dtaLongFinancialDebts},
            {title:"Pasivo Corriete Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentLiability},
            {title:"Pasivo No Corriente Total", monto: FinancialRatiosData?.debtRatios.ltaCurrentNonLiability},
          ],
          interpretation:
            FinancialRatiosData?.debtRatios.debtToLiability ?? 0 > 50
              ? `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToLiability ?? 0) * 100)}% indica que más de la mitad de los pasivos corresponden a deuda financiera, lo que puede generar una alta carga financiera.`
              : `Un ratio de ${((FinancialRatiosData?.debtRatios.debtToLiability ?? 0) * 100)}% indica que la mayor parte de los pasivos no provienen de deuda financiera, lo cual da más estabilidad.`,
          isPercentage: true
        }
      ]
    },
    profitabilityRatios: {
      title: "Ratios de Rentabilidad",
      items: [
        {
          name: "Rentabilidad",
          value: (FinancialRatiosData?.profitabilityRatios.profitability ?? 0) * 100,
          formula:"Utilidad Neta / Capital Social",
          valores: [
            {title:"Utilidad Neta", monto: FinancialRatiosData?.profitabilityRatios.proNetProfit},
            {title:"Capital Social", monto: FinancialRatiosData?.profitabilityRatios.propSocialCapital},
          ],
          interpretation: getMessageProfitability((FinancialRatiosData?.profitabilityRatios.profitability ?? 0) * 100),
          isPercentage: true
        },
        {
          name: "ROI",
          value: (FinancialRatiosData?.profitabilityRatios.roi ?? 0) * 100,
          formula:"Utilidad Neta / Inversion Total",
          valores: [
            {title:"Utilidad Neta", monto: FinancialRatiosData?.profitabilityRatios.proNetProfit},
            {title:"Inversion Total", monto: FinancialRatiosData?.profitabilityRatios.roiTotalInvestment},
          ],
          interpretation: getMessageROI((FinancialRatiosData?.profitabilityRatios.roi ?? 0) * 100),
          isPercentage: true
        },
        {
          name: "ROE",
          value: (FinancialRatiosData?.profitabilityRatios.roe ?? 0) * 100,
          formula:"Utilidad Neta / Patrimonio Neto",
          valores: [
            {title:"Utilidad Neta", monto: FinancialRatiosData?.profitabilityRatios.proNetProfit},
            {title:"Patrimonio Neto", monto: FinancialRatiosData?.profitabilityRatios.roeNetWorth},
          ],
          interpretation: getMessageROE((FinancialRatiosData?.profitabilityRatios.roe ?? 0) * 100),
          isPercentage: true
        },
        {
          name: "ROA",
          value: (FinancialRatiosData?.profitabilityRatios.roa ?? 0) * 100,
          formula:"Utilidad Neta / Activo Total",
          valores: [
            {title:"Utilidad Neta", monto: FinancialRatiosData?.profitabilityRatios.proNetProfit},
            {title:"Activo Total", monto: FinancialRatiosData?.profitabilityRatios.roaTotalAsset},
          ],
          interpretation: getMessageROA((FinancialRatiosData?.profitabilityRatios.roa ?? 0) * 100),
          isPercentage: true
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


  const handleDateChange = useCallback( (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange({
        from: startDate,
        to: endDate,
      });
    }
  },[]);

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
      <main className="flex flex-col gap-4">
        <BreadcrumbDashboard
          items={[
            {
              label: "Panel",
              href: "/dashboard/accounting",
            },
            {
              label: "Result",
              href: "#",
            },
            {
              label: "Ratios Financieros",
              href: "/dashboard/accounting/results/financial-ratios",
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


