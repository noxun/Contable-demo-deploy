"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Link from "next/link";

interface LoginFormInputs {
  usernameOrEmail: string;
  password: string;
}

function Login() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const loginSchema = z.object({
    usernameOrEmail: z.string().min(4, {
      message: "Debe tener mínimo 4 caracteres",
    }),
    password: z.string(),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/login`,
        {
          usernameOrEmail: values.usernameOrEmail,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        router.push("/dashboard/accounts");
      } else {
        setErrorMessage("Error durante el inicio de sesión");
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

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col rounded-xl border border-blue-500 bg-slate-700 p-3">
        <div className="mx-10 mt-10 flex h-full flex-col items-center justify-center p-2 ">
          <h1 className="mb-4 font-semibold text-blue-500">INICIAR SESIÓN</h1>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
              <FormField
                control={loginForm.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-5 flex flex-col items-center space-y-4">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-700 font-bold py-5 px-8 rounded shadow" >
                  Ingresar
                </Button>
                {/* <Link href="/auth/register" passHref>
                  <button
                    type="button"
                    className="bg-green-800 hover:bg-green-900 text-black font-bold py-2 px-4 rounded shadow"
                  >
                    Registrar
                  </button>
                </Link> */}
              </div>
            </form>
          </Form>
        </div>
      </div>

      <AlertDialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-black border border-blue-500 p-4 shadow-lg rounded-lg">
          <AlertDialog.Title className="text-2xl font-bold text-blue-600">
            Error
          </AlertDialog.Title>
          <AlertDialog.Description className="text-lg font-bold text-blue-500">{errorMessage}</AlertDialog.Description>
          <div className="flex justify-end mt-4">
            <AlertDialog.Action asChild>
              <Button onClick={closeDialog}>Cerrar</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default Login;
{
  /* <Input
            autoFocus
            // endContent={
            //   <IoMdMail className="pointer-events-none flex-shrink-0 text-2xl text-blue-500" />
            // }
            label="Email"
            aria-autocomplete="none"
            autoComplete="off"
            placeholder="Enter your email"
            variant="bordered"
            className="my-2"
          />
          <Input
            // endContent={
            //   <RiLockPasswordFill className="pointer-events-none flex-shrink-0 text-2xl text-blue-500" />
            // }
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            className="my-2"
          />
          <div className="my-2 flex w-full justify-end">
            <Button
              color="primary"
              onClick={() => router.push("/dashboard/income")}
              variant="solid"
            >
              Ingresar
            </Button>
          </div>
          <div className="flex w-full flex-col px-1 py-2">
            <Checkbox
              classNames={{
                label: "text-small",
              }}
            >
              Recordarme
            </Checkbox>
            <div className="mt-4 text-end">
              <Link color="primary" href="#" size="sm" className="text-end">
                Olvidaste tu Contraseña?
              </Link>
            </div>
          </div> */
}
