import CustomSelect from "@/components/custom/select";
import useModelSeatsByType from "../../shared/hooks/useModelSeatsByType";
import { SingleValue } from "react-select";
import { ModelSeat, ModelSeatItemFromDetail } from "@/lib/types";
import { fetchModelSeatsItems } from "@/lib/data";

type Props = {
  voucherType: number;
  onSelectOption: (accounts: ModelSeatItemFromDetail[]) => void;
};

export function ModelSeatSelect({ voucherType, onSelectOption }: Props) {
  const {
    data: modelSeats,
    isError,
    isLoading,
  } = useModelSeatsByType(voucherType);

  async function handleModelSeatChange(selectedOption: SingleValue<ModelSeat>) {
    if (!selectedOption) return;

    const modelSeatDetails = await fetchModelSeatsItems(
      selectedOption.id.toString()
    );
    if (modelSeatDetails) {
      onSelectOption(modelSeatDetails.accounts);
    } else {
      console.error(
        "No se encontraron detalles para el asiento modelo seleccionado"
      );
    }
  }

  if (isError) {
    return <div>Error al cargar los asientos modelo</div>;
  }

  if (isLoading || !modelSeats) {
    return <div>Cargando asientos modelo...</div>;
  }

  return (
    <CustomSelect
      getOptionLabel={(option) => option.description}
      getOptionValue={(option) => option.id.toString()}
      options={modelSeats}
      onChange={handleModelSeatChange}
      isLoading={isLoading}
      placeholder="Asiento Modelo"
      isClearable
    />
  );
}