"use client";

import CustomSelect from "@/components/custom/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import useHeritageEvaluation from "@/features/accounting/shared/hooks/useHeritageEvaluation";
import { addDays } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import HeritageEvaluationPreview from "@/features/accounting/results/heritage-evaluation/components/HeritageEvaluationPreview";
import { HeritageEvaluationData } from "@/lib/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HeritageEvaluationPDF from "@/features/accounting/results/heritage-evaluation/components/HeritageEvaluationPDF";
import { Loader } from "lucide-react";

const options = [
  // { value: "1", label: "Excel" },
  { value: "2", label: "Vista Previa" },
] as const;

export default function HeritageEvaluationPage() {
  const [inSus, setInSus] = useState<boolean | "indeterminate">(false);
  const [dateRange, setDateRange] = useState<DateRange | null>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [responseType, setResponseType] = useState<"1" | "2">("2");

  const {
    data: heritageEvaluationData,
    isLoading,
    isFetching,
    isFetched,
    isError,
  } = useHeritageEvaluation(
    dateRange?.from?.toISOString() ?? new Date().toISOString(),
    dateRange?.to?.toISOString()!,
    inSus as boolean,
    responseType
  );

  const handleUpdateDateRange = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    setDateRange(values.range);
  };

  if (isError) {
    return <main>Error</main>;
  }

  return (
    <main className="flex flex-col gap-4">
      <div className="flex justify-evenly items-center bg-[#f8f8f8] p-4 rounded-xl dark:bg-gray-800">
        <Label className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg">
          <Checkbox checked={inSus} onCheckedChange={setInSus} />
          En dolares?
        </Label>
        <DateRangePicker
          onUpdate={handleUpdateDateRange}
          initialDateFrom={new Date(new Date().getFullYear(), 0, 1)}
          initialDateTo={new Date()}
          locale="es-BO"
          showCompare={false}
        />
        <CustomSelect
          className="min-w-96"
          options={options}
          placeholder="Tipo de Respuesta"
          onChange={(selectedValue) =>
            setResponseType(selectedValue?.value ?? "2")
          }
        />
      </div>
      {isLoading || isFetching || !heritageEvaluationData ? (
        <div className="flex flex-row gap-2 items-center">
          <Loader className="h-5 w-5 animate-spin" />
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          {/* <Button
            asChild={responseType === "1" && isFetched}
            disabled={responseType !== "1"}
          >
            <Link
              prefetch={false}
              download
              href={heritageEvaluationData as string}
            >
              Descargar Excel
            </Link>
          </Button> */}
          {responseType === "2" ? (
            <>
              <Button asChild className="w-fit">
                <PDFDownloadLink
                  document={
                    <HeritageEvaluationPDF
                      data={heritageEvaluationData as HeritageEvaluationData}
                    />
                  }
                  fileName="heritage.pdf"
                >
                  Descargar PDF
                </PDFDownloadLink>
              </Button>
              <HeritageEvaluationPreview
                data={heritageEvaluationData as HeritageEvaluationData}
              />
            </>
          ) : null}
        </>
      )}
    </main>
  );
}
