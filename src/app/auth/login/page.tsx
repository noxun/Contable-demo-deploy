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
//import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Login() {
  const router = useRouter();
  const loginSchema = z.object({
    usernameOrEmail: z.string().min(4, {
      message: "Debe tener mínimo 4 caracteres",
    }),
    password: z.string(),
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    router.push("/dashboard/accounts");
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col rounded-xl border border-blue-500 bg-slate-800 p-3">
        <div className="mx-10 mt-10 flex h-full flex-col items-center justify-center p-2 ">
          <h1 className="mb-4 font-semibold text-blue-500">LOGIN</h1>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
              <FormField
                control={loginForm.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email </FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field}></Input>
                    </FormControl>
                    <FormDescription>Ingrese su usuario</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Contraseña </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field}></Input>
                    </FormControl>
                    <FormDescription>Ingrese su contraseña</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Ingresar</Button>
            </form>
          </Form>
        </div>
      </div>
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
