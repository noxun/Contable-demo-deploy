"use client";

import { fetchModelSeatsItems } from "@/lib/data";
import FormEditModelSeat from "@/features/accounting/model-seats/components/FormEditModelSeat";
import { useQuery } from "@tanstack/react-query";

export default function EditModelSeatPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const {
    data: modelSeat,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ModelSeat", id],
    queryFn: () => fetchModelSeatsItems(id),
  });

  if (isLoading || modelSeat === undefined) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Hubo un error al obtener el asiento modelo...</div>;
  }

  return <FormEditModelSeat modelSeat={modelSeat} />;
}
