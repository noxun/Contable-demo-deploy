import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllAssets } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ListAssetsSelect = ({ value, onChange }: Props) => {

  const { data: listAssets, isLoading, isError } = useQuery({
    queryKey: ['AllAssets'],
    queryFn: getAllAssets,
  })

  return (
    <>
      <Select onValueChange={onChange} value={`${value}`} >
        <FormControl>
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={isLoading ? "Cargando..." : "Seleccione un activo"}
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="w-[240px]" >
          {isLoading && <SelectItem disabled value="null">Cargando...</SelectItem>}
          {isError && <SelectItem disabled value="null">Error al cargar los datos</SelectItem>}
          {
            listAssets && !isLoading && (
              listAssets.map((asset) => (
                <SelectItem key={asset.id} value={`${asset.id}`}>{asset.typeActive}</SelectItem>
              ))
            )
          }
        </SelectContent>
      </Select >
    </>
  )
}
