"use client"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { deleteFixedAsset, getAllFixedAssets } from "@/lib/data"
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog"
import { DatePicker } from "@/modules/fixed-assets/components/DatePicker"
import { DialogAssetDetail } from "@/modules/fixed-assets/components/DialogAssetDetail"
import { FixedAsset } from "@/modules/fixed-assets/types/types"
import { formatNumber } from "@/modules/shared/utils/validate"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { FilePenLineIcon, Table, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

function FixedAssetPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: listAssets } = useQuery({
    queryKey: ['fixedAssets', selectedDate],
    queryFn: () => {
      const dateSelected = selectedDate || new Date();
      return getAllFixedAssets({ dateTime: format(dateSelected, 'yyyy-MM-dd') });
    },
    enabled: !!selectedDate
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFixedAsset,
    onSuccess: () => {
      toast.success('Activo fijo eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['fixedAssets'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar un activo fijo')
      console.error('Ocurrio un error al eliminar un activo fijo: ', error)
    },
    onMutate: () => {
      toast("Eliminando activo fijo...")
    }
  });

  const columnsFixedAssets = [
    {
      header: "Tipo Activo",
      accessorKey: "typeActive",
      cell: ({ row }: any) => row.original.typeActive,
    },
    {
      header: "Detalle",
      accessorKey: "detail",
      cell: ({ row }: any) => row.original.detail,
    },
    {
      header: "% Depreciacion",
      accessorKey: "depreciationPorcentage",
      cell: ({ row }: any) => `${row.original.depreciationPorcentage}%`,
    },
    {
      header: "Valor Neto Inicial",
      accessorKey: "initialNetWorth",
      cell: ({ row }: any) => formatNumber(row.original.initialNetWorth),
    },
    {
      header: "Depreciacion acumulada anterior",
      accessorKey: "previousDA",
      cell: ({ row }: any) => formatNumber(row.original.previousDA),
    },
    {
      header: "Depreciacion de activos",
      accessorKey: "assetDepreciation",
      cell: ({ row }: any) => formatNumber(row.original.assetDepreciation),
    },
    {
      header: "Valor neto del activo fijo",
      accessorKey: "fixedAseetsNetValue",
      cell: ({ row }: any) => formatNumber(row.original.fixedAseetsNetValue),
    },
    {
      header: "% Depreciación actual",
      accessorKey: "currentDepreciationP",
      cell: ({ row }: any) => `${row.original.currentDepreciationP}%`,
    },
    {
      header: "Acciones",
      accessorKey: "",
      cell: ({ row }: any) => {
        const assetId = row.original.id
        return (
          <div className="flex items-center justify-center gap-1">
            <DialogAssetDetail fixedAsset={row.original} />
            <Button
              variant="outline"
              className="size-10 p-2 text-blue-500 rounded-full"
              aria-label="Actualizar"
              title="Actualizar"
              onClick={() => {
                router.push(`/dashboard/fixed-assets/new?IdAsset=${assetId}`);
              }}
            >
              <FilePenLineIcon />
            </Button>
            <ConfirmDeleteDialog
              id={row.original.id}
              message="Esta acción eliminará permanentemente el activo fijo seleccionado.
            Asegúrate de que esta es tu intención, ya que no podrás deshacerla"
              onDelete={deleteMutation.mutate} />
          </div>
        )
      },
    },
  ];

  return (
    <main>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activos Fijos</h1>
        <Button asChild>
          <Link href="/dashboard/fixed-assets/new">Nuevo activo fijo</Link>
        </Button>
      </div>
      <Label className="flex flex-col gap-3 pt-3 pb-5" >
        Seleccione la fecha de inicio
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </Label>

      {
        listAssets?.getFixed && (
          <>
            <DataTable columns={columnsFixedAssets} data={listAssets?.getFixed} />
            <div className="flex justify-end gap-6 py-4 px-6 bg-gray-50 rounded-lg">
              {
                [
                  { label: "Depreciacion actual", value: listAssets.totalDActual },
                  { label: "Incremento de actualización", value: listAssets.totalIncreiceUpdate },
                  { label: "Incremento de actualización dep acumulada", value: listAssets.totalIncreiceUpdateDP },
                ].map((item) => (
                  <div key={item.label} className="text-right">
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-lg font-bold">{formatNumber(item.value)}</p>
                  </div>
                ))
              }
            </div>
          </>
        )
      }
    </main>
  )
}

export default FixedAssetPage