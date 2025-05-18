import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FixedAsset } from "../types/types"
import { format } from "date-fns"
import { EyeIcon } from "lucide-react"

interface Props {
  fixedAsset: FixedAsset
}
export const DialogAssetDetail = ({ fixedAsset }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="size-10 p-2 text-blue-500 rounded-full"
          title="Ver Detalles"
          aria-label="Ver Detalles"
        >
          <EyeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle className="pb-2">Tipo de Activo: {fixedAsset.typeActive}</DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Sección Fechas */}
              <div className="col-span-2 flex flex-wrap justify-between items-center">
                <div><strong>Fecha de alta: </strong>{format(new Date(fixedAsset.registrationDate), "dd/MM/yyyy")}</div>
                <div><strong>Inicio de uso: </strong>{format(new Date(fixedAsset.startDate), "dd/MM/yyyy")}</div>
                <div><strong>Última actualización: </strong>{format(new Date(fixedAsset.lastDate), "dd/MM/yyyy HH:mm:ss")}</div>
              </div>

              {/* Sección Detalles Generales */}
              <fieldset className="col-span-2 grid gap-x-8 md:grid-cols-2 border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Detalles Generales</legend>
                <div><strong>Proveedor:</strong> {fixedAsset.proveedor}</div>
                <div><strong>Factura:</strong> {fixedAsset.invoice}</div>
                <div><strong>Detalle:</strong> {fixedAsset.detail}</div>
                <div><strong>Referencia:</strong> {fixedAsset.reference}</div>
              </fieldset>

              {/* Sección Valoración del Activo */}
              <fieldset className="border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Valoración del Activo</legend>
                <div><strong>UFV Inicial:</strong> {fixedAsset.initialUFV}</div>
                <div><strong>UFV Final:</strong> {fixedAsset.endUFV}</div>
                <div><strong>Valor Neto Inicial:</strong> {fixedAsset.initialNetWorth} BOB</div>
                <div><strong>Valor Neto Final:</strong> {fixedAsset.endNetWorth.toFixed(2)} BOB</div>
              </fieldset>

              {/* Sección Depreciación */}
              <fieldset className="border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Depreciación del Activo</legend>
                <div><strong>Depreciación Actual:</strong> {fixedAsset.currentDepreciation.toFixed(2)} BOB</div>
                <div><strong>Depreciación de Activos (Total):</strong> {fixedAsset.assetDepreciation.toFixed(2)} BOB</div>
                <div><strong>% de Depreciación Actual:</strong> {(fixedAsset.depreciationPorcentage / 100).toFixed(2)} %</div>
                <div><strong>% de Depreciación Actual:</strong> {(fixedAsset.currentDepreciationP / 100).toFixed(2)} %</div>
              </fieldset>

              {/* Sección Datos Financieros */}
              <fieldset className="border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Datos Financieros</legend>
                <div><strong>Valor Actualizado:</strong> {fixedAsset.worthUpdated.toFixed(2)} BOB</div>
                <div><strong>Incremento de Actualización:</strong> {fixedAsset.increaseUpdated.toFixed(2)} BOB</div>
              </fieldset>

              {/* Sección Depreciación Acumulada */}
              <fieldset className="border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Depreciación Acumulada</legend>
                <div><strong>Depreciación Acumulada Anterior:</strong> {fixedAsset.previousDA.toFixed(2)} BOB</div>
                <div><strong>Depreciación Acumulada Actualizada:</strong> {fixedAsset.updatedDA.toFixed(2)} BOB</div>
                <div><strong>Incremento de Depreciación Acumulada:</strong> {fixedAsset.increaseUpdatedDA.toFixed(2)} BOB</div>
              </fieldset>

              {/* Sección Otros Datos */}
              <fieldset className="col-span-2 grid gap-x-8 md:grid-cols-2 border-2 rounded-xl p-2 border-[#a2a2a2]">
                <legend>Otros</legend>
                <div><strong>Valor de Propiedades Activas:</strong> {fixedAsset.activePropertiesValue.toFixed(2)} BOB</div>
                <div><strong>Valor Bruto:</strong> {fixedAsset.glossValue.toFixed(2)} BOB</div>
                <div><strong>Valor Neto del Activo Fijo:</strong> {fixedAsset.fixedAseetsNetValue.toFixed(2)} BOB</div>
                <div><strong>Vida Útil (Meses):</strong> {fixedAsset.lifeMonths} meses</div>
                <div><strong>Tiempo de Uso (Meses):</strong> {fixedAsset.timeMonths} meses</div>
              </fieldset>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}