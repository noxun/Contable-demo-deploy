import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { IBank } from "../interface/banks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface FormValues {
    descripcion: string;
    name: string;
    nroCuentaBancaria: string;
    sigla: string;
}

interface EditBankProps {
  isOpen: boolean;
  onClose: () => void;
  bank: IBank;
}

const EditBank = ({ isOpen, onClose, bank }: EditBankProps) => {
  const token = localStorage.getItem("token");
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
        descripcion:  bank.descripcion,
        name: bank.name,
        nroCuentaBancaria: bank.nroCuentaBancaria,
        sigla: bank.sigla,
    },
  });

  const queryClient = useQueryClient();
  const updateBankMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log(bank.id)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bank/`, 
        { id: bank.id ,...data},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Banco Editado");
      queryClient.invalidateQueries({ queryKey: ["Bank"] });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log(values);
    updateBankMutation.mutate(values);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Banco</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                {...register("name",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sigla" className="text-right">
                Sigla
              </Label>
              <Input
                id="sigla"
                {...register("sigla",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nroCuentaBancaria" className="text-right">
                Nro. de Cuenta Bancaria
              </Label>
              <Input
                id="nroCuentaBancaria"
                {...register("nroCuentaBancaria",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Input
                id="descripcion"
                {...register("descripcion",)}
                className="col-span-3"
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBank;
