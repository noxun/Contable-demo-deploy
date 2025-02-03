"use client";

import { Button } from "@/components/ui/button";
import { registerVoucherByDocuments } from "@/lib/data";
import { SubData } from "@/lib/trazoTypes";
import { RegisterVoucherByDocumentResponse } from "@/lib/types";
import useUserStore from "@/lib/userStore";
import DialogFormNewVoucher from "@/modules/banks/components/DialogFormNewVoucher";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import DialogFormNewVoucherByDoc from "./DialogFormNewVoucherByDoc";

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
  const [returnedData, setReturnedData] =
    useState<null | RegisterVoucherByDocumentResponse>(null);

  const loginData = useUserStore((state) => state.loginData);
  const userId = loginData?.user.id;

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

  const handleClick = async () => {
    const itemsToRegister = items.filter(
      (subData) => !subData.recibo && subData.description2
    );
    // solo subdatas con recibo false
    const finalData = {
      sucursal,
      centroCostos,
      internCode,
      companyRazonSocial,
      userId,
      items: itemsToRegister,
    };

    const returnedData = await registerVoucherByDocumentMutation.mutateAsync({
      data: finalData,
      type,
    });

    setReturnedData(returnedData);

  };

  return (<>
    <Button onClick={handleClick}>Registrar asiento</Button>
    {
      returnedData && (
        <DialogFormNewVoucherByDoc
          isOpen={true}
          voucher={returnedData}
        />
      )
    }
  </>);
}
