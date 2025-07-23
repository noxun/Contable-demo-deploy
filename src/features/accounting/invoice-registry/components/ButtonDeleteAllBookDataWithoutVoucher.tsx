import { Button } from "@/components/ui/button";
import { useDeleteAllBookDataWithoutGeneratedSeat } from "../hooks/useDeleteAllBookDataWithoutGeneratedSeat";

type GenerateSingleSeatProps = {
  type: "sale" | "buy";
};

export function ButtonDeleteAllBookDataWithoutVoucher({
  type,
}: GenerateSingleSeatProps) {
  const deleteAllBookDataWithoutGeneratedSeatMutation =
    useDeleteAllBookDataWithoutGeneratedSeat();

  function handleClick() {
    deleteAllBookDataWithoutGeneratedSeatMutation.mutate(type);
  }

  return (
    <Button
      onClick={handleClick}
      title="Este botón eliminará todos los datos de la lista que no tengan un asiento generado"
    >
      Borrar todos los datos
    </Button>
  );
}
