"use client";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
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
  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Account/All`),
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
}: PropsWithChildren & { message: string }) {
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
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AccountCreateButton({ children }: PropsWithChildren) {
  const accountCreateForm = useForm();

  function onSubmit(values) {
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                name="movimientos"
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
                name="presupuestable"
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
                name="costos"
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
