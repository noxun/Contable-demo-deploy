import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
import { ToolTipChartCustom } from "./ToolTipChartCustom";

interface Props {
  data: { name: string; value: number }[];
}

export const FinancialRatiosBarChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={420}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis type="number" dataKey="value" />
        <YAxis
          tick={{ fill: "#64748B" }}
          className="text-sm text-gray-800 dark:text-white"
          width={140}
          dataKey="name"
          type="category"
        />
        <Tooltip content={<ToolTipChartCustom />} />
        <Bar dataKey="value" fill="#3b82f6" radius={[0, 5, 5, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}