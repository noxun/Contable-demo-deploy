import { Button } from "@/components/ui/button";
import { useGenerateSingleSeat } from "../hooks/useGenerateSingleSeat";

type GenerateSingleSeatProps = {
  type: "sale" | "buy";
  bookId: number;
};

export function ButtonGenerateSingleSeat({
  type,
  bookId,
}: GenerateSingleSeatProps) {
  const generateSingleSeatMutation = useGenerateSingleSeat();

  function handleClick() {
    generateSingleSeatMutation.mutate({ type, bookId });
  }

  return <Button onClick={handleClick}>Generar asiento</Button>;
}
