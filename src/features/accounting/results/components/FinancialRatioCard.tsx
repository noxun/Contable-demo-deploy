import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatioItem as FinancialRatioItem } from "../types/types"

interface Props {
  title: string
  financialRatios: FinancialRatioItem[],
}

export const FinancialRatiosCard = ({ title, financialRatios }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-xl md:text-2xl" >{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {
          financialRatios.map(({ name, value, isPercentage, formula, valores }, index) => (
            <Card className="group relative w-full overflow-hidden bg-white rounded-lg border transition-shadow duration-300 cursor-pointer">
              <div className="flex w-[200%] h-full transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                <div className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center p-4">
                  <div className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide text-center">
                    {name}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 text-center">
                    {isPercentage ? `${value} %` : value}
                  </div>
                </div>
                <div className="flex-shrink-0 w-1/2 flex flex-col items-center justify-center p-2 text-center relative">
                  <div className="text-[10px] md:text-sm divide-gray-200 pb-6">
                    {Array.isArray(valores) &&
                      valores.map((item, i) => (
                        <div key={i} className="flex justify-between gap-4">
                          <span className="text-gray-700">{item.title}</span>
                          <span className="text-gray-900 font-medium">{item.monto}</span>
                        </div>
                      ))}
                  </div>
                  <div className="text-[10px] absolute bottom-0 text-gray-500 bg-gray-100 py-0.5 px-4 mt-1">{formula}</div>
                </div>
              </div>
            </Card>
          ))
        }
      </CardContent>
    </Card>
  )
}