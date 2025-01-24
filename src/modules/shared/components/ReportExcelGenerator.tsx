import { Button } from "@/components/ui/button";
import { getApiReportExcel, getBigguerBookinExcel } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { ReportType } from "../utils/validate";

interface Props {
  dateRange: DateRange,
  inSus: boolean,
  search: string,
}
//Component for generate excel file to biggerBook
export const ReportExcelGenerate = ({ dateRange, search }: Props) => {


  const initialDate = dateRange.from && format(dateRange.from, "yyyy-MM-dd")
  const finallyDate = dateRange.to && format(dateRange.to, "yyyy-MM-dd")


  const { refetch, isLoading } = useQuery({
    queryKey: [dateRange, search],
    queryFn: () => getBigguerBookinExcel({ initDate: initialDate, endDate: finallyDate, search: search }),
    enabled: false
  })
  //eliminar posibles extensiones repetidas
  const fixFileExtension = (url: string, extension: string) => {
    const extWithDot = `.${extension}`;
    while (url.endsWith(`${extWithDot}${extWithDot}`)) {
      url = url.slice(0, -(extWithDot.length));
    }
    if (!url.endsWith(extWithDot)) {
      url += extWithDot;
    }
    return url;
  };

  const handleOnClick = async () => {
    toast.info('Generando Excel...')

    try {
      const { data: linkExcel } = await refetch()
      const fileUrl = linkExcel instanceof Blob ? URL.createObjectURL(linkExcel) : fixFileExtension(linkExcel, 'xlsx');

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "BookBiggerData.xlsx";
      toast.success('Archivo generado...')
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      toast.error('Error al descargar el archivo.');
    }
  }

  return (
    <Button className="flex" onClick={handleOnClick} >
      {isLoading ? 'Descargando Excel...' : 'Descargar Excel'}
    </Button>
  )
}