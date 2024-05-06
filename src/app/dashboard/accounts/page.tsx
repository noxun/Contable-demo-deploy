"use client";
import { z } from "zod";
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PropsWithChildren } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
} from "@/components/ui/command";
import { zodResolver } from "@hookform/resolvers/zod";

const accountsSchema = z.object({
  id: z.number(),
  code: z.string(),
  description: z.string(),
  coin: z.string(),
  active: z.boolean().default(true),
  isBudgetable: z.boolean(),
  isMotion: z.boolean(),
  isCost: z.boolean(),
  accountChild: z.array(
    z.object({
      id: z.number(),
      code: z.string(),
      description: z.string(),
      coin: z.string(),
      active: z.boolean().default(true),
      isBudgetable: z.boolean(),
      isMotion: z.boolean(),
      isCost: z.boolean(),
    })
  ),
});

type Account = z.infer<typeof accountsSchema>;

export default function AccountsPage() {

  const token = localStorage.getItem("token");
  // console.log(token)

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/All`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }),
    staleTime: 1000 * 60 * 10, //volver a hacer fetch luego de 10 min
  });

  if (accountsQuery.isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
    //aca se puede retornar algun skeleton
  }

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {accountsQuery.data?.data.map((item, index) => (
          <AccordionItem key={index} value={item.code}>
            <AccordionTrigger>
              <span>{item.code}</span>
              <span>{item.description}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <div className="p-10">
                  <Accordion type="single" collapsible>
                    {item.accountChild.map((childItem, childIndex) => (
                      <AccordionItem key={childIndex} value={childItem.code}>
                        <AccordionTrigger>
                          <span>{childItem.code}</span>
                          <span>{childItem.description}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-end gap-4">
                            <Button className="">Editar Registro</Button>
                            <AccountDeleteButton
                              accountId={childItem.id}
                              message="This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers."
                            >
                              Borrar Registro
                            </AccountDeleteButton>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <AccountCreateButton>Nuevo Registro</AccountCreateButton>
                  <Button className="">Editar Registro</Button>
                  <AccountDeleteButton
                    accountId={item.id}
                    message="This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers."
                  >
                    Borrar Registro
                  </AccountDeleteButton>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function AccountDeleteButton({
  children,
  message,
  accountId,
}: PropsWithChildren & { message: string ; accountId: number }) {

  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const deleteAccountMutation = useMutation({
    mutationFn: async (id:number) => {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account?accountId=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data;
    },
    onSuccess: () => {
      toast("Account deleted succesfully")
      queryClient.invalidateQueries({queryKey: ["accounts"]})
    },
    onError: (error, variables, context) => {
      console.log(error,variables,context);
      toast(error.message);
    }
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteAccountMutation.mutate(accountId)
            }}
          >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AccountCreateButton({ children }: PropsWithChildren) {
  const accountCreateFormSchema = z.object({
    description: z.string().min(5),
    coin: z.string(),
    active: z.boolean().default(true),
    isBudgetable: z.boolean(),
    isMotion: z.boolean(),
    isCost: z.boolean(),
  });

  type AccountCreateForm = z.infer<typeof accountCreateFormSchema>;

 

  const accountCreateForm = useForm<AccountCreateForm>({
    resolver: zodResolver(accountCreateFormSchema),
    defaultValues: {
      description: "",
      coin: "",
      active: true
    }
  });

  console.log(accountCreateForm.formState.errors)

  const empresas = [
    { label: "Empresa 1", value: "1" },
    { label: "Empresa 2", value: "2" },
  ];
  const gestiones = [
    { label: "2002", value: "2002" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
  ];

  function onSubmit(values) {
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* Aqui vendria el componente form */}
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
                    <FormLabel>Modeda</FormLabel>
                    <FormControl>
                      <RadioGroup
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
              <FormField
                control={accountCreateForm.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Empresa</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? empresas.find(
                                  (empresa) => empresa.value === field.value
                                )?.label
                              : "Selecciona una Empressa"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar Empresa..." />
                          <CommandEmpty>
                            No se encontro ninguna empresa
                          </CommandEmpty>
                          <CommandGroup>
                            {empresas.map((empresa) => (
                              <CommandItem
                                value={empresa.label}
                                key={empresa.value}
                                onSelect={() => {
                                  accountCreateForm.setValue(
                                    "empresa",
                                    empresa.value
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    empresa.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {empresa.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={accountCreateForm.control}
                name="gestion"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>gestion</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? gestiones.find(
                                  (gestion) => gestion.value === field.value
                                )?.label
                              : "Selecciona una Gestion"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar gestion..." />
                          <CommandEmpty>
                            No se encontro ninguna gestion
                          </CommandEmpty>
                          <CommandGroup>
                            {gestiones.map((gestion) => (
                              <CommandItem
                                value={gestion.label}
                                key={gestion.value}
                                onSelect={() => {
                                  accountCreateForm.setValue(
                                    "gestion",
                                    gestion.value
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    gestion.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {gestion.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </div>
        <div>
          <Button>Adicionar</Button>
          <Button>Borrar Todo</Button>
          <div>
            <Button>Importar Plan de Cuentas</Button>
            <Button>Imprimir</Button>
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
