import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AccountCreateButton({
  fatherId,
}: {
  fatherId: number;
}) {
  const accountCreateFormSchema = z.object({
    companyId: z.number().default(1), //default de momento para probar
    fatherId: z.number(),
    description: z.string().min(5),
    coin: z.string(),
    active: z.boolean().default(true),
    isBudgetable: z.boolean().default(false),
    isMotion: z.boolean().default(false),
    isCost: z.boolean().default(false),
    isOperation: z.boolean().default(false),
    isInitialBalance: z.boolean().default(false),
    isInvestment: z.boolean().default(false),
    isFinancing: z.boolean().default(false),
  });

  const [open, setOpen] = useState(false);

  type AccountCreateForm = z.infer<typeof accountCreateFormSchema>;

  const accountCreateForm = useForm<AccountCreateForm>({
    resolver: zodResolver(accountCreateFormSchema),
    defaultValues: {
      description: "",
      coin: "",
      active: true,
      fatherId: fatherId,
    },
  });

  //console.log(accountCreateForm.formState.errors);

  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const createAccountMutation = useMutation({
    mutationFn: async (data: AccountCreateForm) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Account created succesfully");
      queryClient.invalidateQueries({ queryKey: ["accountsAll"] });
    },
  });

  function onSubmit(values: AccountCreateForm) {
    console.log(values);
    createAccountMutation.mutate(values);
  }

  //REACT HOOK FORM CACHEA LOS VALORES POR DEFAULT
  useEffect(() => {
    if (open) {
      accountCreateForm.reset({
        description: "",
        coin: "",
        active: true,
        fatherId: fatherId,
      });
    }
  }, [open, fatherId, accountCreateForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Nuevo Registro" variant="outline" size="icon">
          <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Cuenta</DialogTitle>
          <DialogDescription>Crea una nueva cuenta</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...accountCreateForm}>
            <form onSubmit={accountCreateForm.handleSubmit(onSubmit)}>
              <FormField
                control={accountCreateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Input placeholder="descripcion" {...field} />
                    </FormControl>
                    <FormDescription>
                      La descripcion de la cuenta
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountCreateForm.control}
                name="coin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex items-center gap-5"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center  gap-1">
                          <FormControl className="">
                            <RadioGroupItem value="bolivianos" />
                          </FormControl>
                          <FormLabel className="h-5">Bolivianos</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-row items-center gap-1">
                          <FormControl className="">
                            <RadioGroupItem value="dolares" />
                          </FormControl>
                          <FormLabel className="h-5">Dolares</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Selecciona el tipo de moneda
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label className="font-bold text-lg">Propiedades</Label>
              <div className="grid grid-cols-4 gap-5 mb-5">
                <FormField
                  control={accountCreateForm.control}
                  name="isMotion"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl className="">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Movimientos</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isBudgetable"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Presupuestable</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isCost"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Costos</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isOperation"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Operaciones</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isInvestment"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Inversion</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isFinancing"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Financiamiento</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isInitialBalance"
                  render={({ field }) => (
                    <FormItem className="flex gap-1 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="h-5">Flujo de Efectivo</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
