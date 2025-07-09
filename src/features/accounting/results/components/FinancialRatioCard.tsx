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
          financialRatios.map(({ name, value, isPercentage }, index) => (
            <Card className="p-4" key={index}>
              <CardHeader className="p-0 m-0">
                <CardTitle className="text-sm md:text-base text-center" >{name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 m-0">
                <div className="text-sm sm:text-base text-center">
                  {isPercentage ? `${value} %` : value}
                </div>
              </CardContent>
            </Card>
          ))
        }
      </CardContent>
    </Card>
  )
}