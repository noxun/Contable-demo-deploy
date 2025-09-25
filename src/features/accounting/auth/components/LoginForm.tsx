"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginResponse } from "@/lib/types";
import useUserStore from "@/lib/userStore";
import { login } from "@/lib/auth";
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
import { Button } from "@/components/ui/button";
import PasswordInput from "./PasswordInput";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(4, {
    message: "Debe tener mínimo 4 caracteres",
  }),
  password: z.string(),
});

export type Login = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const setLoginData = useUserStore((state) => state.setLoginData);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("loginResponse", JSON.stringify(data));
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setLoginData(data);
        toast.success("Inicio de Sesión Exitoso");
        if (!data.ufvRegister) {
          toast.warning("Registro de UFVs requerido");
        }
        router.push("/dashboard/accounting");
      }
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error(
        (error?.response?.data as string) ?? "Hubo un error al iniciar sesión"
      );
    },
  });

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
    <Form {...loginForm}>
      <form
        className="flex flex-col gap-2"
        onSubmit={loginForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={loginForm.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#052f47] text-base">Email</FormLabel>
              <FormControl>
                <Input placeholder="Email o Usuario" {...field} className="text-black bg-white/30 backdrop-blur-md mt-2 mb-4 rounded-xl focus:outline-none focus-visible:ring-0"></Input>
              </FormControl>
              <FormDescription className="text-cyan-950">
                Su correo electrónico o nombre de usuario
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
              <FormLabel className="text-[#052f47] text-base">Contraseña</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormDescription className="text-cyan-950">Su contraseña</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loginMutation.isPending} type="submit"  className="bg-tradecruz hover:bg-tradecruz-hover text-tradecruz-foreground font-semibold py-2 rounded-md w-full shadow-sm transition-colors">
          Ingresar
        </Button>
      </form>
    </Form>
  );
}
