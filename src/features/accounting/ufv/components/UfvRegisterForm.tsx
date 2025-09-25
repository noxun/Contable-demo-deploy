import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Ufv } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { UfvRegister, ufvRegisterFormSchema } from "../schemas/ufvSchema";
import { useRegisterUfv } from "../hooks/useRegisterUfv";

type Props = {
  ufv: Ufv;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UfvRegisterForm({ ufv, setIsOpen }: Props) {
  const ufvRegisterForm = useForm<UfvRegister>({
    resolver: zodResolver(ufvRegisterFormSchema),
    defaultValues: {
      ufvValue: parseFloat(ufv?.ufv?.replace(/,/g, ".") ?? 2.5),
      dollarValue: parseFloat(ufv?.tc?.replace(/,/g, ".") ?? 6.97),
    },
  });
  //FIXME:
  //FORMATEAR LOS VALORES DE ESTE ENDPOINT EN EL BACKEND, PARA QUE SE ALINIEN
  //CON LOS VALORES DECIMALES EN JAVASCRIPT

  const registerUfvMutation = useRegisterUfv();

  function onSubmit(values: UfvRegister) {
    registerUfvMutation.mutate(values);
    if (registerUfvMutation.isSuccess) {
      setIsOpen(false);
    }
  }

  return (
    <Form {...ufvRegisterForm}>
      <form
        onSubmit={ufvRegisterForm.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={ufvRegisterForm.control}
          name="ufvValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UFV</FormLabel>
              <FormControl>
                <Input placeholder="ufv" {...field} />
              </FormControl>
              <FormDescription>El valor de las UFV</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={ufvRegisterForm.control}
          name="dollarValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>T/C</FormLabel>
              <FormControl>
                <Input placeholder="tc" {...field} />
              </FormControl>
              <FormDescription>
                Tasa de Cambio de dolares a Bolivianos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={registerUfvMutation.isPending} type="submit">
          {registerUfvMutation.isPending
            ? "Guardando..."
            : "Completar Registro"}
        </Button>
      </form>
    </Form>
  );
}
