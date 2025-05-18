import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { postConvertAccountToAccountingBox, postConvertAccountToBank } from "@/lib/data"
import useMotionAccounts from "@/features/accounting/shared/hooks/useMotionAccounts"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import Select from 'react-select'
import { toast } from "sonner"

export const DialogTransformAccount = () => {
  const { data: accountsMotion } = useMotionAccounts()
  const queryClient = useQueryClient()

  const { handleSubmit, setValue } = useForm<{ accountId: string }>();

  const selectOptions = accountsMotion?.map(({ description, id }) => {
    return { label: description, value: id };
  });

  // convertir cuenta a banco
  const ToBankMutation = useMutation({
    mutationFn: postConvertAccountToBank,
    onMutate: () => {
      toast('Cargando...');
    },
    onSuccess: () => {
      toast.success("Cuenta transformada a banco exitosamente");
      queryClient.invalidateQueries({ queryKey: ["Bank"] });
    },
    onError: (error) => {
      toast.error("Error al Convertir la cuenta a banco");
      console.error('ocurrio un error: ', error)
    }
  })

  // convertir cuenta a caja
  const ToAccountingBoxToMutation = useMutation({
    mutationFn: postConvertAccountToAccountingBox,
    onMutate: () => {
      toast('Cargando...');
    },
    onSuccess: () => {
      toast.success("Cuenta transformada a caja exitosamente");
      queryClient.invalidateQueries({ queryKey: ["accountingBox"] });
    },
    onError: (error) => {
      toast.error("Error al transformar la cuenta a caja");
      console.error('ocurrio un error: ', error)
    }
  })


  const handleConvertToBank = (data: { accountId: string }) => {
    ToBankMutation.mutate(data.accountId);
  }
  const handleConvertToAccountingBox = (data: { accountId: string }) => {
    ToAccountingBoxToMutation.mutate(data.accountId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Transformar Cuenta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Transformar cuenta</DialogTitle>
          <DialogDescription>
            <form className="flex h-full gap-4 items-start justify-center mx-auto">
              <Select
                className="min-w-60 md:min-w-96 max-h-[100px]"
                placeholder="Seleccione una cuenta..."
                options={selectOptions}
                onChange={(e) => { setValue("accountId", String(e?.value)) }}
              />
            </form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex pt-2 gap-3 items-center justify-center">
            <Button onClick={handleSubmit((data) => { handleConvertToAccountingBox(data) })}>Convertir a caja</Button>
            <Button onClick={handleSubmit((data) => { handleConvertToBank(data) })}>Convertir a banco</Button>
          </div>
        </DialogFooter>
        <DialogFooter className="m-0 p-0" />
      </DialogContent>
    </Dialog>
  )
}