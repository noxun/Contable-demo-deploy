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
