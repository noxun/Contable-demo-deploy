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
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllRoles } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleMenu } from "@/lib/types";

interface registerFormInputs {
  username: string;
  password: string;
}

function Register() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
  });
  const [expandedRoles, setExpandedRoles] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const registerSchema = z.object({
    username: z.string().min(4, {
      message: "Debe tener mínimo 4 caracteres",
    }),
    password: z.string().min(4, {
      message: "Debe tener mínimo 4 caracteres",
    }),
    email: z.string(),
    name: z.string(),
    ci: z.string(),
    fatherLastName: z.string(),
    motherLastName: z.string(),
    appCode: z.string(),
    rols: z.array(
      z.object({
        rolId: z.number(),
      })
    ),
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);

    // try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/Auth/register`,
    //     {
    //       username: values.username,
    //       password: values.password,
    //       email: values.email,
    //       name: values.name,
    //       ci: values.ci,
    //       fatherLastName: values.fatherLastName,
    //       motherLastName: values.motherLastName,
    //       appCode: values.appCode,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   console.log(response);

    //   if (response.status === 200) {
    //     setSuccessMessage("Usuario registrado exitosamente.");
    //     setSuccessDialogOpen(true);
    //     reset();
    //     queryClient.invalidateQueries({ queryKey: ["User"] });
    //   } else {
    //     setErrorMessage("Error durante la creación del usuario");
    //     setDialogOpen(true);
    //   }
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     setErrorMessage(error.response?.data || "Error desconocido");
    //   } else {
    //     setErrorMessage(String(error));
    //   }
    //   setDialogOpen(true);
    // }
  }

  const closeDialog = () => setDialogOpen(false);
  const closeSuccessDialog = () => setSuccessDialogOpen(false);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      ci: "",
      fatherLastName: "",
      motherLastName: "",
      appCode: "",
      rols: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: registerForm.control,
    name: "rols",
  });

  const handleRoleChange = (checked: boolean, role: RoleMenu) => {
    if (checked) {
      append({ rolId: role.id });
      if (role.main) {
        setExpandedRoles((prev) => [...prev, role.id]);
      }
    } else {
      const index = fields.findIndex((field) => field.rolId === role.id);
      if (index !== -1) {
        remove(index);
      }
      if (role.main) {
        setExpandedRoles((prev) => prev.filter((id) => id !== role.id));
        // Remove all subroles when main role is unchecked
        role.rolsList?.forEach((subRole) => {
          const subIndex = fields.findIndex(
            (field) => field.rolId === subRole.id
          );
          if (subIndex !== -1) {
            remove(subIndex);
          }
        });
      }
    }
  };

  const isRoleChecked = (rolId: number) =>
    fields.some((field) => field.rolId === rolId);

  const renderRoleCheckbox = (role: RoleMenu) => (
    <div key={role.id} className="mb-2">
      <Checkbox
        id={`role-${role.id}`}
        checked={isRoleChecked(role.id)}
        onCheckedChange={(checked) =>
          handleRoleChange(checked as boolean, role)
        }
      />
      <label htmlFor={`role-${role.id}`} className="ml-2">
        {role.name}
      </label>
    </div>
  );
  const { reset } = registerForm;
  return (
    <div className=" ">
      <div className=" ">
        <FormProvider {...registerForm}>
          <div className="mx-5 mt-5 flex flex-col p-2 ">
            <h1 className="mb-4 font-semibold ">REGISTRAR USUARIO</h1>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onSubmit)}>
                <div className="flex gap-2 ">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de Usuario</FormLabel>
                        <FormControl className="px-5">
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl className="px-5">
                          <Input
                            type="password"
                            placeholder=""
                            {...field}
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-normal  gap-2 ">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl className="px-5">
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="ci"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CI</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-normal  gap-5 ">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="fatherLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Paterno</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="motherLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold mb-2">Roles</h2>
                  {allRoles?.map((mainRole) => (
                    <div key={mainRole.id}>
                      {renderRoleCheckbox(mainRole)}
                      {expandedRoles.includes(mainRole.id) &&
                        mainRole.rolsList && (
                          <div className="ml-4 mt-1">
                            {mainRole.rolsList.map(renderRoleCheckbox)}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex space-y-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 font-bold py-5 px-8 rounded shadow"
                  >
                    Registrar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </FormProvider>
      </div>

      <AlertDialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 dark:bg-gray-700 dark:bg-opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 border border-blue-500 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800">
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

      <AlertDialog.Root
        open={isSuccessDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      >
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 dark:bg-gray-700 dark:bg-opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 border border-blue-500 p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800">
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
export default Register;
