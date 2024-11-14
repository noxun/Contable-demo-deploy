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
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllRoles, registerUser } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleMenu } from "@/lib/types";
import { toast } from "sonner";

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

export type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {

  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
  });
  const [expandedRoles, setExpandedRoles] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const router = useRouter();

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Hubo un error al registar el usuario");
    },
    onSuccess: () => {
      toast.success("Usuario registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["User"] });
      router.push("/dashboard/users");
    },
  });

  async function onSubmit(values: RegisterForm) {
    console.log(values);
    registerUserMutation.mutate(values);
  }


  const registerForm = useForm<RegisterForm>({
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
    </div>
  );
}
