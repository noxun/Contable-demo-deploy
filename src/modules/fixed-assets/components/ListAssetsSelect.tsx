import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllAssets } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: string;
  onChange: (value: string) => void;
}


export const ListAssetsSelect = ({ value, onChange }: Props) => {

  //falta definir el tipo de los activos
  //falta tipar la lista de activos y cambiar la url de getAllAssets
  const { data: listAssets, isLoading, isError } = useQuery({
    queryKey: ['Accounts'],
    queryFn: getAllAssets,
  })

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <FormControl>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={
              isLoading
                ? "Cargando..."
                : "Seleccione un activo"
            }
          />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {
          isLoading && (
            <SelectItem disabled value="">Cargando...</SelectItem>
          )
        }
        {
          isError && (
            <SelectItem disabled value="">
              Error al cargar los datos
            </SelectItem>
          )
        }
        {
          listAssets && (
            listAssets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>{asset.description}</SelectItem>
            ))
          )
        }
      </SelectContent>
    </Select>
  )
}