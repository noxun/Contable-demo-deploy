import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { HeritageEvaluationData } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const HeritageEvaluationGraph = ({
  data,
}: {
  data: HeritageEvaluationData;
}) => {
  const chartConfig = {
    initial: {
      // label: `Inicial (${data.items[0].sldDateText})`,
      label: "Inicial",
      color: "#8884d8",
    },
    final: {
      // label: `Final (${data.resultFinal.sldDateText})`,
      label: "Final",
      color: "#82ca9d",
    },
  } satisfies ChartConfig;

  // Create a new array with transformed data for comparison
  const comparisonData = [
    {
      category: "Capital Social",
      initial: data?.items[0]?.sldPaidCapital ?? 0,
      final: data.resultFinal.sldPaidCapital,
    },
    {
      category: "Ajuste de Capital",
      initial: data?.items[0]?.sldCapitalAdjust ?? 0,
      final: data.resultFinal.sldCapitalAdjust,
    },
    {
      category: "Reserva Legal",
      initial: data?.items[0]?.sldLegalReserv ?? 0,
      final: data.resultFinal.sldLegalReserv,
    },
    {
      category: "Resultados Acumulados",
      initial: data?.items[0]?.sldCumulResults ?? 0,
      final: data.resultFinal.sldCumulResults,
    },
    {
      category: "Total",
      initial: data?.items[0]?.sldNetWorth ?? 0,
      final: data.resultFinal.sldNetWorth,
    },
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
      <BarChart data={comparisonData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="initial" fill="var(--color-initial)" radius={4} />
        <Bar dataKey="final" fill="var(--color-final)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
