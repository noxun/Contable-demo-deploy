
import { TooltipProps } from 'recharts'

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: { payload: { name: string; value: number }; }[];
}

/**
 * Componente de Tooltip personalizado para los gráficos de `recharts`.
 *
 * Muestra información adicional sobre el dato seleccionado en el gráfico,
 * incluyendo nombre, valor y porcentaje. 
 *
 * @props
 * - `payload`: Un arreglo de objetos que contienen la información del tooltip, como el nombre y el valor.
 * - `active`: Indica si el tooltip está activo y debe renderizarse.
 * 
 * @example
 * const samplePayload = [
 *   {
 *     payload: { name: 'Opción A', value: 50 },
 *   },
 * ];
 * 
 * <ToolTipChartCustom payload={samplePayload} active={true} />
 * 
 * @param {CustomTooltipProps} props Propiedades del componente.
 * @returns {JSX.Element | null} El componente de tooltip renderizado o null si no está activo.
 */

export const ToolTipChartCustom = ({ payload, active }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-white/90 to-white/60 dark:from-black/90 dark:to-black/60 px-2 py-1 rounded-md shadow-md text-sm">
        <div className="absolute inset-0 bg-[#3b82f6] h-full w-[4px] rounded-t-md rounded-b-md" />
        <p><strong>{data.name}</strong></p>
        <p>{`valor: ${data.value}`}</p>
        <p>{`porcentaje: ${data.value * 100}%`}</p>
      </div>
    );
  }
  return null;
}