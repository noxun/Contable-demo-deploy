import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import {  useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AccountCreateButton({ children, fatherId }: PropsWithChildren & {fatherId: number}) {
  const accountCreateFormSchema = z.object({
    companyId: z.number().default(1),//default de momento para probar
    fatherId: z.number(),
    description: z.string().min(5),
    coin: z.string(),
    active: z.boolean().default(true),
    isBudgetable: z.boolean().default(false),
    isMotion: z.boolean().default(false),
    isCost: z.boolean().default(false),
  });

  const [open, setOpen] = useState(false);

  type AccountCreateForm = z.infer<typeof accountCreateFormSchema>;

  const accountCreateForm = useForm<AccountCreateForm>({
    resolver: zodResolver(accountCreateFormSchema),
    defaultValues: {
      description: "",
      coin: "",
      active: true,
      fatherId: fatherId
    }
  });

  //console.log(accountCreateForm.formState.errors);


  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const createAccountMutation = useMutation({
    mutationFn: async (data: AccountCreateForm) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account`, data ,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (error) => {toast.error(error.message)},
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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Cuenta</DialogTitle>
          <DialogDescription>
            Crea una nueva cuenta
          </DialogDescription>
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
                        className="flex"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="bolivianos" />
                          </FormControl>
                          <FormLabel>Bolivianos</FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="dolares" />
                          </FormControl>
                          <FormLabel>Dolares</FormLabel>
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
              <div className="flex">
                <FormField
                  control={accountCreateForm.control}
                  name="isMotion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movimientos</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isBudgetable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuestable</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountCreateForm.control}
                  name="isCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costos</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}