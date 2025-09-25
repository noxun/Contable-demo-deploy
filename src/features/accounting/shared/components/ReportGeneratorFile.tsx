import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DiaryBookTemplate } from "./templatePDF/DiaryBook";
import { es } from "date-fns/locale";
import { BalanceGeneralTemplate } from "./templatePDF/BalanceGeneral";
import { EstadoResultadosTemplate } from "./templatePDF/EstadoResultados";

interface GeneratedFile {
  type: string;
  date: string;
  link: JSX.Element;
}

interface ReportGeneratorProps {
  dateRange: DateRange;
  inSus: boolean;
  sucursalId?: string
  reportNamePath: string;
  paramType?: string;
  setGeneratedFiles: React.Dispatch<React.SetStateAction<GeneratedFile[]>>;
  setShowDialog: (show: boolean) => void;
  setFile: (file: JSX.Element | null) => void;
}

/**
 * Componente para generar un reporte en formato PDF.
 * Permite seleccionar un rango de fechas, especificar si el reporte está en dólares (Sus),
 * y generar un reporte en formato PDF basado en los parámetros proporcionados.
 * 
* @props
 * - `dateRange`: Rango de fechas para el reporte. 
 * - `inSus`: Indica si el reporte debe ser generado en dólares (true) o en otra moneda (false).
 * - `sucursalId`: Identificador de la sucursal para la cual se genera el reporte (opcional).
 * - `reportNamePath`: El nombre del reporte a generar, que corresponde al path de la API.
 * - `paramType`: Tipo de parámetro adicional que se puede agregar a la ruta del reporte (opcional).
 * - `setGeneratedFiles`: Función para actualizar el estado con los archivos generados.
 * - `setShowDialog`: Función para mostrar u ocultar el diálogo que contiene el reporte.
 * - `setFile`: Función para actualizar el archivo generado y mostrarlo en el diálogo.
 *
 * 
 * @returns {JSX.Element} - Un botón que, al ser presionado, genera el reporte en PDF.
 * 
 * @example
 * <ReportGeneratorFile
 *   dateRange={dateRange} //rango de fechas
 *   inSus={inSus} //en dólares?
 *   reportNamePath={reportNamePath} //nombre del reporte
 *   paramType={paramType} //tipo de parámetro adicional (opcional)
 *   setGeneratedFiles={setGeneratedFiles} //actualiza los archivos generados
 *   setShowDialog={setShowDialog} //mostrar u ocultar diálogo
 *   setFile={setFile} //establece el archivo generado
 * />
 */
export const ReportGeneratorFile: React.FC<ReportGeneratorProps> = ({
  dateRange,
  inSus,
  sucursalId,
  reportNamePath,
  paramType,
  setGeneratedFiles,
  setShowDialog,
  setFile,
}) => {
  const FORMAT_DATE = "yyyy/MM/dd";
  const [isLoading, setIsLoading] = useState(false);
  const paramSearchType = `/${paramType}`;
  const URL_REQUEST = `${process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/Report/${reportNamePath}${paramType ? paramSearchType : ""}`;

  const handleGenerateReport = async () => {
    const { from, to } = dateRange;

    if (from && to) {
      setIsLoading(true);
      toast("Generando reporte...");
      try {
        const response = await axios.get(URL_REQUEST, {
          params: {
            InitDate: format(from, FORMAT_DATE),
            EndDate: format(to, FORMAT_DATE),
            inSus,
            sucursalId,
            type: paramType,
          },
          responseType: "json",
        });

        if (response.data) {
          const currentDate = new Date().toLocaleString();

          const FORMAT_DATE_TEXT = "dd 'de' MMMM 'del' yyyy";
          const dateText = {
            from: format(from, FORMAT_DATE_TEXT, { locale: es }),
            to: format(to, FORMAT_DATE_TEXT, { locale: es }),
          };

          let MyDocument: JSX.Element | null = null;

          const search = paramType ? paramType : reportNamePath;

          switch (search) {
            case "diarybook":
              MyDocument = (
                <DiaryBookTemplate
                  dateRange={dateText}
                  isSus={inSus}
                  records={response.data}
                />
              );
              break;
            default:
              toast.error("Reporte no encontrado");
              break;
          }

          if (MyDocument) {
            setFile(MyDocument);
            setShowDialog(true);
            toast.success("Reporte generado exitosamente");
          }
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
      {isLoading ? "Generando PDF..." : "Generar PDF"}
    </Button>
  );
};
