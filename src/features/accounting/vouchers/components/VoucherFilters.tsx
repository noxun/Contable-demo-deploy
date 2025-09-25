import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVoucherType } from "@/lib/utils";

interface VoucherFiltersProps {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  glossQuery: string;
  onGlossSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initDate: string;
  endDate: string;
  onDateRangeChange: (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => void;
}

export default function VoucherFilters({
  selectedOption,
  setSelectedOption,
  glossQuery,
  onGlossSearch,
  initDate,
  endDate,
  onDateRangeChange,
}: VoucherFiltersProps) {
  const voucherOptions = ["0", "1", "2"];

  return (
    <>
      <div className="flex justify-end mb-2">
        <div>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Seleccione el tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              {voucherOptions.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option}
                >
                  {getVoucherType(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="flex-1 flex flex-col gap-2">
          Rango de Fechas
          <DateRangePicker
            showCompare={false}
            locale="es"
            onUpdate={onDateRangeChange}
            initialDateFrom={initDate}
            initialDateTo={endDate}
          />
        </Label>
        <Label className="flex-1 flex flex-col gap-2">          
          Buscar
          <Input 
            placeholder="Buscar por glosa" 
            type="search" 
            value={glossQuery} 
            onChange={onGlossSearch} 
          />
        </Label>
      </div>
    </>
  );
}