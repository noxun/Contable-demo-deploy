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
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Account } from "../types/account";
import { Pencil } from "lucide-react";

export default function AccountEditButton({ account }: { account: Account }) {
  const accountEditFormSchema = z.object({
    id: z.number(),
    code: z.string(),
    description: z.string().min(5),
    coin: z.string(),
    active: z.boolean().default(true),
    isBudgetable: z.boolean().default(false),
    isMotion: z.boolean().default(false),
    isCost: z.boolean().default(false),
  });

  const [open, setOpen] = useState(false);

  type AccountEditForm = z.infer<typeof accountEditFormSchema>;

  const accountEditForm = useForm<AccountEditForm>({
    resolver: zodResolver(accountEditFormSchema),
    defaultValues: {
      id: account.id,
      code: account.code,
      description: account.description,
      coin: account.coin,
      active: account.active,
      isBudgetable: account.isBudgetable,
      isMotion: account.isMotion,
      isCost: account.isCost,
    },
  });

  useEffect(() => {
    if (open) {
      accountEditForm.reset({
        id: account.id,
        code: account.code,
        description: account.description,
        coin: account.coin,
        active: account.active,
        isBudgetable: account.isBudgetable,
        isMotion: account.isMotion,
        isCost: account.isCost,
      });
    }
  }, [open, account, accountEditForm]);

  //console.log(accountCreateForm.formState.errors);
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const editAccountMutation = useMutation({
    mutationFn: async (data: AccountEditForm) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account?accountId=${data.id}`,
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
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Account edited successfully");
      queryClient.invalidateQueries({ queryKey: ["accountsAll"] });
    },
  });

  function onSubmit(values: AccountEditForm) {
    console.log(values);
    editAccountMutation.mutate(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Editar Registro" variant="outline" size="icon">
          <Pencil className="size-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Cuenta</DialogTitle>
          <DialogDescription>
            Haz cambios a la cuenta aqui. Dale click a guardar cuando estes
            listo.
          </DialogDescription>
        </DialogHeader>
        {/* Aqui vendria el componente form */}
        <div>
          <Form {...accountEditForm}>
            <form onSubmit={accountEditForm.handleSubmit(onSubmit)}>
              <FormField
                control={accountEditForm.control}
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
                control={accountEditForm.control}
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
                  control={accountEditForm.control}
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
                  control={accountEditForm.control}
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
                  control={accountEditForm.control}
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
      </DialogContent>
    </Dialog>
  );
}
