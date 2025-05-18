import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  onSelect: (value: any) => void;
  queryFn: (search: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  debounceTime?: number;
  suggestionKey?: string;
  resetSearch?: boolean
}

/**
 * Componente de búsqueda con sugerencias automáticas.
 *
 * @description
 * Este componente permite realizar búsquedas con sugerencias automáticas que se actualizan mientras el usuario escribe. 
 * La búsqueda es desacoplada, es decir, las sugerencias se obtienen de manera asincrónica a través de una función que se pasa como `queryFn`.
 *
 * @props
 * - `onSelect`: Función que se ejecuta cuando el usuario selecciona una sugerencia. Recibe como argumento el valor de la sugerencia seleccionada.
 * - `queryFn`: Función que se ejecuta para obtener las sugerencias de búsqueda. Recibe como argumento el texto de búsqueda.
 * - `placeholder`: Texto que se muestra cuando el campo de búsqueda está vacío. Por defecto es "Buscar...".
 * - `buttonLabel`: Texto que se muestra en el botón cuando no hay texto de búsqueda. Por defecto es "Buscar".
 * - `debounceTime`: Tiempo en milisegundos para el debounce, que evita hacer consultas al servidor en cada pulsación de tecla. El valor por defecto es 500 ms.
 * - `suggestionKey`: Clave de la propiedad del objeto que se usará para mostrar la sugerencia en la lista. Por defecto es "description".
 * - `resetSearch`: Si es verdadero, el campo de búsqueda se limpiará cuando cambie el valor de esta propiedad.
 *
 * @example
 * <SearchComponent
 *   onSelect={(selectedItem) => console.log(selectedItem)}
 *   queryFn={async (search) => fetchSuggestions(search)}
 *   placeholder="Buscar algo..."
 *   buttonLabel="Buscar"
 *   debounceTime={500}
 *   suggestionKey="name"
 *   resetSearch={false}
 * />
 */

export const SearchComponent = ({
  onSelect,
  queryFn,
  placeholder = "Buscar...",
  buttonLabel = "Buscar",
  debounceTime = 500,
  suggestionKey = "description",
  resetSearch
}: Props) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, debounceTime);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["search-suggestions", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      return await queryFn(debouncedSearch);
    },
    enabled: !!debouncedSearch,
  });

  const [open, setOpen] = useState(false);
  const suggestionsData = suggestions || [];

  //Para limpiar el dato de busqueda desde otro componente
  useEffect(() => {
    if (resetSearch) {
      setSearch("");
    }
  }, [resetSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {search || buttonLabel}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={(value) => setSearch(value)}
            placeholder={placeholder}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Cargando...</CommandEmpty>
            ) : suggestionsData.length > 0 ? (
              <CommandGroup>
                {suggestionsData.map((suggestion: any, index: number) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setOpen(false);
                      onSelect(suggestion);
                      setSearch(suggestion[suggestionKey] || "");
                    }}
                  >
                    {suggestion[suggestionKey]}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>Sin resultados</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
