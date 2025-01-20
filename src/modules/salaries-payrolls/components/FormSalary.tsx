import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { SchemaSalaryType } from "../types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { SchemaSalary } from "../schemas/shema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostSalary } from "@/lib/data"
import { toast } from "sonner"

interface Props {
  idPayroll: string
  onClose: () => void
}

export const FormSalary = ({ idPayroll, onClose }: Props) => {
  const queryClient = useQueryClient()
  const formSalary = useForm<SchemaSalaryType>({
    resolver: zodResolver(SchemaSalary),
    defaultValues: {
      salariesAndwagesId: idPayroll,
      productionBonus: '0',
      extraTimeMinutes: '0',
      valueForOvertime: '0',
      loan: '0',
      exelTrainingCorse: '0',
      anbFineSettlement: '0',
      onAccount: '0',
      dsctoShirtDelays: '0',
    }
  })

  const createMutation = useMutation({
    mutationFn: PostSalary,
    onSuccess: () => {
      toast.success("Registro creado correctamente!");
      onClose();
      formSalary.reset();
      queryClient.invalidateQueries({ queryKey: ['AllSalaries'] })
    },
    onMutate: () => {
      toast("creando registro...");
    },
    onError: (e) => {
      toast.error("Error al crear el registro");
      console.error(e)
    }
  })

  const onSubmit = (data: SchemaSalaryType) => {
    createMutation.mutate({ Item: data })
  }

  return (
    <Form {...formSalary}>
      <form className="px-2 pt-2 flex flex-col gap-4" onSubmit={formSalary.handleSubmit(onSubmit)}>

        <div>
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
        <div>
          <FormField
            name="valueForOvertime"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor por horas extras: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el valor por horas extras"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
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
        </div>
        <div>
          <FormField
            name="exelTrainingCorse"
            control={formSalary.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso de capacitacion en excel: </FormLabel>
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
        <div>
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
          <SaveIcon />Registrar
        </Button>
      </form>
    </Form>
  )
}