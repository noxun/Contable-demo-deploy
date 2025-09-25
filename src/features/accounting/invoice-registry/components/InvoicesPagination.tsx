import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationInvoice } from "@/features/accounting/invoice-registry/purchases/services/purchasesService";

interface PaginationProps {
  pagination: PaginationInvoice;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function InvoicesPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const { CurrentPage, ItemsPerPage, TotalItems, TotalPages } = pagination;

  const startItem = (CurrentPage - 1) * ItemsPerPage + 1;
  const endItem = Math.min(CurrentPage * ItemsPerPage, TotalItems);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {startItem} a {endItem} de {TotalItems} resultados
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={ItemsPerPage.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(CurrentPage - 1)}
          disabled={CurrentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <span className="text-sm font-medium">
          Página {CurrentPage} de {TotalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(CurrentPage + 1)}
          disabled={CurrentPage >= TotalPages}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
