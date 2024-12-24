import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Document, Page, PDFDownloadLink, Text } from "@react-pdf/renderer";
import { DiaryBookTemplate } from "./templatePDF/DiaryBook";
import { es } from "date-fns/locale";

interface GeneratedFile {
  type: string;
  date: string;
  link: string;
}

interface ReportGeneratorProps {
  dateRange: DateRange;
  inSus: boolean;
  reportNamePath: string;
  setGeneratedFiles: React.Dispatch<React.SetStateAction<GeneratedFile[]>>;
  setShowDialog: (show: boolean) => void;
  setFile: (file: JSX.Element | null) => void;
};

export const ReportGeneratorFile: React.FC<ReportGeneratorProps> = ({
  dateRange,
  inSus,
  reportNamePath,
  setGeneratedFiles,
  setShowDialog,
  setFile
}) => {
  const FORMAT_DATE = "yyyy/MM/dd";
  const [isLoading, setIsLoading] = useState(false);
  const URL_REQUEST = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Report/${reportNamePath}`;

  const handleGenerateReport = async () => {
    const { from, to } = dateRange;

    if (from && to) {
      setIsLoading(true);
      try {
        const response = await axios.get(URL_REQUEST, {
          params: {
            InitDate: format(from, FORMAT_DATE),
            EndDate: format(to, FORMAT_DATE),
            inSus,
          },
          responseType: "json",
        });

        if (response.data) {
          const currentDate = new Date().toLocaleString();

          const FORMAT_DATE_TEXT = "dd 'de' MMMM 'del' yyyy";
          const dateText = {
            from: format(from, FORMAT_DATE_TEXT, { locale: es }),
            to: format(to, FORMAT_DATE_TEXT, { locale: es })
          }

          const MyDocument = (
            <DiaryBookTemplate
              dateRange={dateText}
              isSus={inSus}
              records={response.data}
            />
          );

          // const pdfLink = (
          //   <PDFDownloadLink
          //     document={MyDocument}
          //     fileName={`Reporte_${currentDate}.pdf`}
          //   />
          // );
          setGeneratedFiles((prevFiles) => [
            ...prevFiles,
            {
              type: "PDF",
              date: currentDate,
              link: response.data,
            },
          ]);
          setFile(MyDocument);
          setShowDialog(true);
          toast.success("Reporte generado exitosamente");
        }
      } catch (error) {
        console.error("Error al generar los reportes", error);
        toast.error("Error al generar el reporte, intente nuevamente");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button onClick={handleGenerateReport} disabled={isLoading}>
      {isLoading ? "Generando Reporte" : "Generar Reporte"}
    </Button>
  );
};

