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
import { postUfvValues } from "@/lib/data";
import { Ufv } from "@/lib/types";
import useUserStore from "@/lib/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ufvRegisterFormSchema = z.object({
  ufvValue: z.coerce.number(),
  dollarValue: z.coerce.number(),
});

export type UfvRegister = z.infer<typeof ufvRegisterFormSchema>;

export default function UfvRegisterForm({
  ufv,
  setIsOpen,
}: {
  ufv: Ufv;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { setUfvRegister } = useUserStore();
  //const setUfvRegister = useStore(useUserStore, (state) => state.setUfvRegister!)

  const ufvRegisterForm = useForm<UfvRegister>({
    resolver: zodResolver(ufvRegisterFormSchema),
    defaultValues: {
      ufvValue: parseFloat(ufv.ufv.replace(/,/g, ".")),
      dollarValue: parseFloat(ufv.tc.replace(/,/g, ".")),
    },
  });
  //FIXME:
  //FORMATEAR LOS VALORES DE ESTE ENDPOINT EN EL BACKEND, PARA QUE SE ALINIEN
  //CON LOS VALORES DECIMALES EN JAVASCRIPT

  const registerUfvMutation = useMutation({
    mutationFn: postUfvValues,
    onError: (error) => {
      toast.error("Hubo un error al registrar los datos");
      console.log(error);
    },
    onSuccess: () => {
      setIsOpen(false);
        setUfvRegister(true);
      toast.success("Valores Registrados correctamente!");
    },
  });

  function onSubmit(values: UfvRegister) {
    registerUfvMutation.mutate(values);
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
