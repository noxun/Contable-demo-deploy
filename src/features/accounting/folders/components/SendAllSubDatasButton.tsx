"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { postAllSubDatas } from "@/lib/data";
import { ProcedureDataset } from "@/lib/trazoTypes";
import { SendAllSubDatas } from "@/lib/types";
import useUserStore from "@/lib/userStore";
import FormNewVoucherWithTypeSelect from "@/features/accounting/shared/components/FormNewVoucherWithTypeSelect";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type SendAllSubDatasButtonProps = {
  procedureDataset: ProcedureDataset;
  totalProformaBs: string;
  internCode: string;
};

export default function SendAllSubDatasButton({
  procedureDataset,
  totalProformaBs,
  internCode,
}: SendAllSubDatasButtonProps) {
  const user = useUserStore((state) => state.loginData?.user);

  const sendAllSubDatasMutation = useMutation({
    mutationFn: postAllSubDatas,
    onSuccess: () => {
      toast.success("Datos enviados correctamente");
      //invalidate query here
    },
    onError: (e: AxiosError) => {
      console.error(e);
      toast.error("Error al enviar los datos");
    },
  });

  const handleClick = () => {
    const itemsToSend = [
      ...(procedureDataset["a-TributosYOtrosConceptosAduanerosSubDatas"] ?? []),
      ...(procedureDataset["b-OtrosGastosDeImportacion/ExportacionSubDatas"] ??
        []),
      ...(procedureDataset["c-GastosDeOperacionesSubDatas"] ?? []),
      ...(procedureDataset["d-HonorariosProfesionalesSubDatas"] ?? []),
    ].map((item) => ({
      description: item.description,
      description2: item.description2,
      description3: item.description3,
      //recibo
    }));

    const dataToSend: SendAllSubDatas = {
      sucursal: procedureDataset.sucursal,
      internCode: internCode,
      centroCostos: procedureDataset.centroCostos,
      companyRazonSocial: procedureDataset.company.razonSocial,
      total: totalProformaBs ?? "0",
      userId: user?.id ?? 0,
      items: itemsToSend,
    };

    sendAllSubDatasMutation.mutate(dataToSend);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleClick}>Enviar todos los datos</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80%] h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Voucher</DialogTitle>
          <DialogDescription>
            Formulario para registrar un nuevo voucher
          </DialogDescription>
        </DialogHeader>
        {sendAllSubDatasMutation.isPending || !sendAllSubDatasMutation.data ? (
          <div>Cargando...</div>
        ) : (
          <FormNewVoucherWithTypeSelect voucher={sendAllSubDatasMutation.data} />
        )}
      </DialogContent>
    </Dialog>
  );
}
