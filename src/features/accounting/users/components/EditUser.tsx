import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useRolesData } from "@/features/accounting/users/hooks/useRolesData";
import { useUpdateUser } from "@/features/accounting/users/hooks/useUpdateMutation";
import { FormValues, IUserResponse, Role } from "@/features/accounting/users/types/users";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditUserProps {
  onCloseDialog: () => void;
  userToEdit: IUserResponse;
  token: string;
}

export const EditUser = ({
  onCloseDialog,
  userToEdit,
  token,
}: EditUserProps) => {
  const [expandedRoles, setExpandedRoles] = useState<number[]>([]);
  const form = useForm<FormValues>({
    defaultValues: {
      name: userToEdit.name,
      username: userToEdit.username,
      email: userToEdit.email,
      fatherLastName: userToEdit.fatherLastName,
      motherLastName: userToEdit.motherLastName,
      ci: userToEdit.ci,
      status: userToEdit.status,
      rolName: userToEdit.rolName,
      roles: [],
    },
  });
  const { control, register, handleSubmit, setValue, watch } = form;
  const { userRoles, allRoles } = useRolesData(userToEdit.id);
  const { mutate: updateUser } = useUpdateUser(
    token as string,
    userToEdit.id,
    onCloseDialog
  );

  useEffect(() => {
    if (userRoles && userRoles.length > 0) {
      const userRoleIds = userRoles.map((role) => role.id);
      setValue("roles", userRoleIds);
      setExpandedRoles(
        userRoles.filter((role) => role.main).map((role) => role.id)
      );
    }
  }, [userRoles, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateUser(values);
  };

  const handleRoleChange = (checked: boolean, role: Role) => {
    const currentRoles = watch("roles");
    let updatedRoles: number[];

    if (checked) {
      updatedRoles = [...currentRoles, role.id];
      if (role.main) {
        setExpandedRoles((prev) => [...prev, role.id]);
      }
    } else {
      updatedRoles = currentRoles.filter((id) => id !== role.id);

      if (role.main) {
        setExpandedRoles((prev) => prev.filter((id) => id !== role.id));

        if (role.rolsList) {
          role.rolsList.forEach((subRole) => {
            updatedRoles = updatedRoles.filter((id) => id !== subRole.id);
          });
        }
      }
    }
    setValue("roles", updatedRoles);
  };

  const renderRoleCheckbox = (role: Role) => (
    <div
      key={role.id}
      className={cn("flex-1", {
        "mb-2": role.main,
        "ml-4 mb-1": !role.main,
      })}
    >
      <div className="">
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <Checkbox
              id={`role-${role.id}`}
              checked={field.value.includes(role.id)}
              onCheckedChange={(checked) =>
                handleRoleChange(checked as boolean, role)
              }
            />
          )}
        />
        <Label htmlFor={`role-${role.id}`} className="ml-2">
          {role.main ? role.name : role.title}
        </Label>
      </div>
      {role.main && expandedRoles.includes(role.id) && role.rolsList && (
        <div className="ml-4 mt-1">{role.rolsList.map(renderRoleCheckbox)}</div>
      )}
    </div>
  );

  return (
    <Dialog open={!!userToEdit} onOpenChange={onCloseDialog}>
      <DialogContent className="min-w-[80%]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Label
                htmlFor="username"
                className="text-left flex flex-col gap-3"
              >
                Usuario
                <Input
                  id="username"
                  {...register("username")}
                  className="col-span-3"
                />
              </Label>
              <FormField
                control={form.control}
                name="rolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1">
                <Label className="block py-3">Roles</Label>
                <div className="flex border mb-2">
                  {allRoles?.map(renderRoleCheckbox)}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
