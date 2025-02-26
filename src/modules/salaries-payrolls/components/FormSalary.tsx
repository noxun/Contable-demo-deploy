import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Salaries, SchemaSalaryType } from "../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { SchemaSalary } from "../schemas/shema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostSalary, UpdateSalary } from "@/lib/data"
import { toast } from "sonner"

interface Props {
  idPayroll: string
  onClose: () => void
  itemForEdit?: Salaries
}

export const FormSalary = ({ itemForEdit, idPayroll, onClose }: Props) => {
  const queryClient = useQueryClient()

  const defaultValuesItem = {
    salariesAndwagesId: idPayroll.toString() ?? '',
    productionBonus: itemForEdit?.productionBonus.toString() ?? '0',
    extraTimeMinutes: itemForEdit?.extraTimeMinutes.toString() ?? '0',
    valueForOvertime: itemForEdit?.valueForOvertime.toString() ?? '0',
    loan: itemForEdit?.loan.toString() ?? '0',
    exelTrainingCorse: itemForEdit?.exelTrainingCorse.toString() ?? '0',
    anbFineSettlement: itemForEdit?.anbFineSettlement.toString() ?? '0',
    onAccount: itemForEdit?.onAccount.toString() ?? '0',
    dsctoShirtDelays: itemForEdit?.dsctoShirtDelays.toString() ?? '0',
  }

  const formSalary = useForm<SchemaSalaryType>({
    resolver: zodResolver(SchemaSalary),
    defaultValues: defaultValuesItem
  })

  const createMutation = useMutation({
    mutationFn: PostSalary,
    onSuccess: () => {
      toast.success("Registro creado correctamente!");
      onClose();
      formSalary.reset();
      queryClient.invalidateQueries({ queryKey: ['AllSalaries'] })
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onMutate: () => {
      toast("creando registro...");
    },
    onError: (e) => {
      toast.error("Error al crear el registro");
      console.error("Error al crear el registro: ", e)
    }
  })

  const updateMutation = useMutation({
    mutationFn: UpdateSalary,
    onSuccess: () => {
      toast.success("Registro actualizado correctamente!");
      onClose();
      formSalary.reset();
      queryClient.invalidateQueries({ queryKey: ['SalaryEdit'] })
      queryClient.invalidateQueries({ queryKey: ['AllSalaries'] })
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onMutate: () => {
      toast("actualizando registro...");
    },
    onError: (e) => {
      toast.error("Error al actualizar el registro");
      console.error("Error al actualizar el registro: ", e)
    }
  })

  const onSubmit = (data: SchemaSalaryType) => {
    if (itemForEdit?.id) return updateMutation.mutate({ item: data, id: idPayroll.toString() })
    return createMutation.mutate({ Item: data })
  }

  return (
    <Form {...formSalary}>
      <form className="px-2 pt-2 flex flex-col gap-4" onSubmit={formSalary.handleSubmit(onSubmit)}>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="productionBonus"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bono de Produccion </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el bono de produccion"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            name="extraTimeMinutes"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiempo extra en minutos: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el tiempo extra en minutos"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="loan"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prestamo: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el prestamo"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            name="exelTrainingCorse"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cursos de capacitacion: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese la cantidad de cursos"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            name="anbFineSettlement"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liquidacion multa ANB: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese la liquidacion de multa anb"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="onAccount"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>A Cuenta: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese valor a cuenta"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            name="dsctoShirtDelays"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento por retrasos: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el descuento por retrasos"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <Button
          className=" mx-auto mt-4 flex items-center justify-center gap-1"
        >
          <SaveIcon />{itemForEdit ? 'Actualizar' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}