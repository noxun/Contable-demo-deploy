"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import useToken from "@/features/accounting/shared/hooks/useToken";

interface registerFormInputs {
  descripcion: string;
  id: number;
  name: string;
  nroCuentaBancaria: string;
  sigla: string;
}

function RegisterBank() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {token, isTokenReady} = useToken();
  const queryClient = useQueryClient();
  const router = useRouter();

  const registerBankSchema = z.object({
    descripcion: z.string().optional(),
    name: z.string().min(4, {
        message: "Debe tener mínimo 4 caracteres",
      }),
    nroCuentaBancaria: z.string().min(4, {
        message: "Debe tener mínimo 4 caracteres",
      }),
    sigla: z.string().min(4, {
        message: "Debe tener mínimo 4 caracteres",
      }),
  });

  async function onSubmit(values: z.infer<typeof registerBankSchema>) {

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Bank`,
        {
          descripcion: values.descripcion,
          name: values.name,
          nroCuentaBancaria: values.nroCuentaBancaria,
          sigla: values.sigla,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200 ||  response.status === 201) {
        setSuccessMessage("Banco creado exitosamente");
        setSuccessDialogOpen(true);
        reset(); 
        queryClient.invalidateQueries({queryKey: ["Bank"]})
      } else {
        setErrorMessage("Error durante la creación del banco");
        setDialogOpen(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data || "Error desconocido");
      } else {
        setErrorMessage(String(error));
      }
      setDialogOpen(true);
    }
  }

  const closeDialog = () => setDialogOpen(false);
  const closeSuccessDialog = () => setSuccessDialogOpen(false);

  const registerForm = useForm<z.infer<typeof registerBankSchema>>({
    resolver: zodResolver(registerBankSchema),
    defaultValues: {
      descripcion: "",
      name: "",
      nroCuentaBancaria: "",
      sigla: "",
    },
  });

  const { reset } = registerForm;
  return (
    <div className=" ">
      <div className=" ">
        <FormProvider {...registerForm}>
          <div className="mx-5 mt-5 flex flex-col p-2 ">
            <h1 className="mb-4 text-xl font-semibold ">REGISTRAR BANCO</h1>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onSubmit)}>
                <div className="flex gap-2 ">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Banco</FormLabel>
                        <FormControl className="px-5">
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="sigla"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sigla</FormLabel>
                        <FormControl className="px-5">
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-normal  gap-2 ">
                  <FormField
                    control={registerForm.control}
                    name="nroCuentaBancaria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nro de Cuenta Bancaria</FormLabel>
                        <FormControl className="px-5">
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-5 flex space-y-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 font-bold py-5 px-8 rounded shadow"
                  >
                    Guardar Banco
                  </Button>
                  {/* <Link href="/auth/login" passHref>
                  <button
                    type="button"
                    className="bg-green-800 hover:bg-green-900 text-black font-bold py-2 px-4 rounded shadow"
                  >
                    Iniciar Sesión
                  </button>
                </Link> */}
                </div>
              </form>
            </Form>
          </div>
        </FormProvider>
      </div>

      <AlertDialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-blue-500 p-4 shadow-lg rounded-lg">
          <AlertDialog.Title className="text-lg font-bold text-black dark:text-white">
            Error
          </AlertDialog.Title>
          <AlertDialog.Description className="text-black dark:text-white">
            {errorMessage}
          </AlertDialog.Description>
          <div className="flex justify-end mt-4">
            <AlertDialog.Action asChild>
              <Button onClick={closeDialog}>Cerrar</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={isSuccessDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-blue-500 p-4 shadow-lg rounded-lg">
          <AlertDialog.Title className="text-lg font-bold text-black dark:text-white">
            Éxito
          </AlertDialog.Title>
          <AlertDialog.Description className="text-black dark:text-white">
            {successMessage}
          </AlertDialog.Description>
          <div className="flex justify-end mt-4">
            <AlertDialog.Action asChild>
              <Button onClick={closeSuccessDialog}>Cerrar</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
export default RegisterBank;
