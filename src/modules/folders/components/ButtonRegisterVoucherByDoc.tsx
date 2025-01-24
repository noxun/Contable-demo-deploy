"use client";

import { Button } from "@/components/ui/button";
import { registerVoucherByDocuments } from "@/lib/data";
import { SubData } from "@/lib/trazoTypes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function ButtonRegisterVoucherByDoc({
  items,
  sucursal,
  centroCostos,
  internCode,
  companyRazonSocial,
  type,
}: {
  items: SubData[];
  sucursal: string;
  centroCostos: string;
  internCode: string;
  companyRazonSocial: string;
  type: "c" | "d";
}) {
  const registerVoucherByDocumentMutation = useMutation({
    mutationFn: registerVoucherByDocuments,
    onSuccess: () => {
      toast.success("Asiento registrado correctamente");
    },
    onError: (error: AxiosError) => {
      console.log("Error al registrar asiento", error);
      toast.error("Error al registrar asiento");
    },
  });

  const handleClick = () => {
    const itemsToRegister = items.filter(
      (subData) => !subData.recibo && subData.description2
    );
    // solo subdatas con recibo true
    const finalData = {
      sucursal,
      centroCostos,
      internCode,
      companyRazonSocial,
      items: itemsToRegister,
    };

    registerVoucherByDocumentMutation.mutate({ data: finalData, type });
  };

  return <Button onClick={handleClick}>Registrar Asiento</Button>;
}
