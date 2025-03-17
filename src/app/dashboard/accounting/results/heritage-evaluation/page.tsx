"use client";

import CustomSelect from "@/components/custom/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import useHeritageEvaluation from "@/modules/shared/hooks/useHeritageEvaluation";
import { addDays } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import HeritageEvaluationPreview from "@/modules/results/heritage-evaluation/components/HeritageEvaluationPreview";
import { HeritageEvaluationData } from "@/lib/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HeritageEvaluationPDF from "@/modules/results/heritage-evaluation/components/HeritageEvaluationPDF";

const options = [
  // { value: "1", label: "Excel" },
  { value: "2", label: "Vista Previa" },
] as const;

export default function HeritageEvaluationPage() {
  const [inSus, setInSus] = useState<boolean | "indeterminate">(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
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
      <h1 className="text-4xl font-bold">Evolucion del Patrimonio</h1>
      <div className="flex justify-evenly items-center">
        <Label className="flex items-center justify-between w-28">
          En dolares?
          <Checkbox checked={inSus} onCheckedChange={setInSus} />
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
        <p>Cargando...</p>
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
              <Button asChild>
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
