"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { ItemPayment, Payroll, SchemaPayrollType } from '../types/types.d'
import { SchemaPayroll } from "../schemas/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostPayroll, UpdatePayrollById } from "@/lib/data";
import { toast } from "sonner";
import { format } from "date-fns";

interface Props {
  onClose: () => void;
  payroll?: Payroll;
  itemPayment?: ItemPayment
}
export const FormPayrolls = ({ onClose, payroll, itemPayment }: Props) => {

  const queryClient = useQueryClient();

  const defaultValuesPayroll = {
    DateNow: new Date().toISOString(),
    Nombres: payroll?.nombres ?? "",
    Area: payroll?.area ?? "",
    Sexo: payroll?.sexo.toUpperCase() ?? "",
    Cargo: payroll?.cargo ?? "",
    EntryDate: payroll?.entryDate ? format(payroll?.entryDate, 'yyyy-MM-dd') : "",
    SalaryTaxReturn: payroll?.salaryTaxReturn.toString() ?? "",
    InternalPayrollSalary: payroll?.internalPayrollSalary.toString() ?? "",
  }

  const formPayroll = useForm<SchemaPayrollType>({
    resolver: zodResolver(SchemaPayroll),
    defaultValues: defaultValuesPayroll
  });

  const createMutation = useMutation({
    mutationFn: PostPayroll,
    onSuccess: () => {
      toast.success("Planilla creada correctamente!");
      onClose();
      formPayroll.reset();
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
    },
    onMutate: () => {
      toast("registrando planilla...");
    },
    onError: (e) => {
      toast.error("Error al crear planilla");
      console.error(e)
    }
  })

  const updateMutation = useMutation({
    mutationFn: UpdatePayrollById,
    onSuccess: () => {
      toast.success("Planilla actualizada correctamente!");
      onClose();
      formPayroll.reset();
      queryClient.invalidateQueries({ queryKey: ['AllPayrolls'] })
      queryClient.invalidateQueries({ queryKey: ['PayrollEdit'] })
    },
    onMutate: () => {
      toast("actualizando planilla...");
    },
    onError: (e) => {
      toast.error("Error al actualizar planilla");
      console.error(e)
    }
  })

  const onSubmit = (data: SchemaPayrollType) => {

    if (payroll && itemPayment) return updateMutation.mutate({
      id: payroll.id.toString(),
      idItem: itemPayment.idItems.toString(),
      payroll: {
        ...data,
        ...itemPayment
      }
    })
    return createMutation.mutate({ payroll: data });
  };

  return (
    <Form {...formPayroll}>
      <form className="px-2 pt-2 flex flex-col gap-4" onSubmit={formPayroll.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center gap-4">
          <FormField
            name="EntryDate"
            control={formPayroll.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de ingreso</FormLabel>
                <FormControl>
                  <Input
                    disabled={payroll ? true : false}
                    type="date" {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="Sexo"
            control={formPayroll.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genero</FormLabel>
                <Select
                  disabled={payroll ? true : false}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={"Seleccione un genero"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-[240px]" >
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="Nombres"
          control={formPayroll.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres y apellidos: </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Ingrese los nombres y apellidos"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="Area"
            control={formPayroll.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el area laboral"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            name="Cargo"
            control={formPayroll.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingrese el cargo laboral"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 grid-cols-1  gap-4">
          <FormField
            control={formPayroll.control}
            name="SalaryTaxReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salario Planilla Fiscal: </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full"
                    placeholder="Ingrese el salario a planilla fiscal"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={formPayroll.control}
            name="InternalPayrollSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salario planilla interna: </FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    {...field}
                    type="text"
                    placeholder="Ingrese el salario a planilla interna"
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
          <SaveIcon />{payroll ? 'Actualizar' : 'Registrar'}
        </Button>
      </form>
    </Form>
  )
}