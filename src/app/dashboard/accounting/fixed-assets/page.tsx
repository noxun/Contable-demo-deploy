"use client"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteFixedAsset, getAllFixedAssets, getAllFixedAssetsExcelByDate } from "@/lib/data"
import { ConfirmDeleteDialog } from "@/modules/fixed-assets/components/ConfirmDeleteDialog"
import { DialogAssetDetail } from "@/modules/fixed-assets/components/DialogAssetDetail"
import DialogNewFixedAssetItem from "@/modules/fixed-assets/components/DialogNewFixedAssetItem"
import { DataTablePayrollsSalaries } from "@/modules/salaries-payrolls/components/TablePayrolls"
import { formatNumber } from "@/modules/shared/utils/validate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { FilePenLineIcon, SheetIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

function FixedAssetPage() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM'));
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: listAssets } = useQuery({
    queryKey: ['fixedAssets', selectedDate],
    queryFn: () => {
      return getAllFixedAssets({ dateTime: selectedDate });
    },
    enabled: !!selectedDate
  })

  const { refetch: refetchExcel } = useQuery({
    queryKey: [selectedDate],
    queryFn: () => {
      return getAllFixedAssetsExcelByDate({ date: selectedDate });
    },
    enabled: false
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

  const onHandleGenerateExcel = async () => {
    try {
      toast.info("Generando archivo Excel...");
      const { data: linkExcel } = await refetchExcel();
      const urlDownload = linkExcel instanceof Blob ? URL.createObjectURL(linkExcel) : linkExcel;

      const link = document.createElement("a");
      link.href = urlDownload;
      link.download = "activosFijos.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      if (linkExcel instanceof Blob) {
        URL.revokeObjectURL(urlDownload);
      }

      toast.success("Archivo Excel generado correctamente.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      toast.error("Ocurrió un error al generar el excel. Por favor, inténtalo de nuevo.");
    }
  };


  const columnsFixedAssets = [
    {
      header: "Tipo Activo",
      accessorKey: "typeActive",
      isSticky: true,
      cell: ({ row }: any) => <p className="whitespace-nowrap">{row.original.typeActive}</p>,
    },
    {
      header: "Detalle",
      accessorKey: "detail",
      cell: ({ row }: any) => <p className="min-w-60 max-w-96">{row.original.detail}</p>,
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
    <main className="max-w-xl">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activos Fijos</h1>
        <Button asChild>
          <Link href="/dashboard/fixed-assets/new">Nuevo activo fijo</Link>
        </Button>
      </div>
      <div className="flex items-end gap-4 mt-3 mb-5">
        {/* <Button className="fixed top-20 z-50" >Esto sera fixed</Button> */}
        <Label className="flex flex-col gap-3 w-fit" >
          Seleccione la fecha de inicio
          <Input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

        </Label>
        <Button
          disabled={listAssets?.getFixed?.length === 0}
          onClick={onHandleGenerateExcel}
          className="flex items-center gap-2"
        >
          <SheetIcon />
          Descargar excel
        </Button>
        <DialogNewFixedAssetItem />
      </div>

      {
        listAssets?.getFixed && (
          <>
            <div className="overflow-x-auto max-w-full w-[90vw] md:w-[70vw]">
              <DataTablePayrollsSalaries
                filter={{ type: "text", placeholder: "Buscar activo fijo...", columnName: "typeActive" }}
                columns={columnsFixedAssets}
                data={listAssets?.getFixed}
              />
              {/* <DataTable columns={columnsFixedAssets} data={listAssets?.getFixed} /> */}
            </div>
            {listAssets?.getFixed?.length > 0 && (
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
            )}
          </>
        )
      }
    </main>
  )
}

export default FixedAssetPage