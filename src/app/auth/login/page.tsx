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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginResponse } from "@/lib/types";
import useUserStore from "@/lib/userStore";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(4, {
    message: "Debe tener mínimo 4 caracteres",
  }),
  password: z.string(),
});

type Login = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const setLoginData = useUserStore((state)=> state.setLoginData);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("loginResponse", JSON.stringify(data));
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setLoginData(data);
        toast.success("Inicio de Sesion Exitoso");
        if(!data.ufvRegister){
          toast.warning("Registro de UFVs requerido");
        }
        router.push("/dashboard/income");
      }
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al iniciar sesion");
      toast.error(error.response?.data as string);
    },
  });

  async function login(data: Login) {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/login`,
      data
    );
    return response.data;
  }

  function onSubmit(values: Login) {
    loginMutation.mutate(values);
  }

  const loginForm = useForm<Login>({
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
          <h1 className="mb-4 font-semibold text-2xl text-blue-500">INICIAR SESIÓN</h1>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
              <FormField
                control={loginForm.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field}></Input>
                    </FormControl>
                    <FormDescription>
                      Su correo electronico o nombre de usuario
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field}></Input>
                    </FormControl>
                    <FormDescription>Su contraseña</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-5 flex flex-col items-center space-y-4">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 font-bold py-5 px-8 rounded shadow"
                >
                  Ingresar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
