import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { IUserResponse } from "../interface/users";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchAllRoles, fetchUserRoles } from '@/lib/data';
import useUserStore from '@/lib/userStore';
import useToken from '@/modules/shared/hooks/useToken';

interface FormValues {
  name: string;
  username: string;
  email: string;
  fatherLastName: string;
  motherLastName: string;
  ci: string;
  status: string;
  roles: number[];
}

interface Role {
  id: number;
  name: string;
  main: boolean;
  nameRef: number;
  rolsList?: Role[];
}

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUserResponse;
}

const EditUser = ({ isOpen, onClose, user }: EditUserProps) => {
  const { token } = useToken();
  const { control, register, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      fatherLastName: user.fatherLastName,
      motherLastName: user.motherLastName,
      ci: user.ci,
      status: user.status,
      roles: [],
    },
  });

  const [expandedRoles, setExpandedRoles] = useState<number[]>([]);

  const getLoginData = useUserStore(state => state.getLoginData);
  const loginData = getLoginData();
  const userId = loginData?.user.id;

  const { data: userRoles, isPending: isPendingUserRoles } = useQuery({
    queryKey: ["userRoles", userId],
    queryFn: () => fetchUserRoles(userId!),
    enabled: !!userId,
  });

  const { data: allRoles } = useQuery({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
  });

  const selectedRoles = watch('roles');

  useEffect(() => {
    if (userRoles) {
      const userRoleIds = userRoles.map(role => role.id);
      setValue('roles', userRoleIds);
      setExpandedRoles(userRoles.filter(role => role.main).map(role => role.id));
    }
  }, [userRoles, setValue]);

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formattedRols = data.roles.map(roleId => ({ rolId: roleId }));
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, 
        { id: user.id, ...data, rols: formattedRols },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Usuario Editado");
      queryClient.invalidateQueries({ queryKey: ["User"] });
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
      onClose();
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateUserMutation.mutate(values);
  };

  const handleRoleChange = (checked: boolean, role: Role) => {
    const currentRoles = watch('roles');
    let updatedRoles: number[];

    if (checked) {
      updatedRoles = [...currentRoles, role.id];
      if (role.main) {
        setExpandedRoles(prev => [...prev, role.id]);
      }
    } else {
      updatedRoles = currentRoles.filter(id => id !== role.id);
      if (role.main) {
        setExpandedRoles(prev => prev.filter(id => id !== role.id));
        // Remove all subroles when main role is unchecked
        role.rolsList?.forEach(subRole => {
          updatedRoles = updatedRoles.filter(id => id !== subRole.id);
        });
      }
    }

    setValue('roles', updatedRoles);
  };

  const renderRoleCheckbox = (role: Role) => (
    <div key={role.id} className={role.main ? "mb-2" : "ml-4 mb-1"}>
      <div className="flex items-center">
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <Checkbox
              id={`role-${role.id}`}
              checked={field.value.includes(role.id)}
              onCheckedChange={(checked) => handleRoleChange(checked as boolean, role)}
            />
          )}
        />
        <Label htmlFor={`role-${role.id}`} className="ml-2">
          {role.name}
        </Label>
      </div>
      {role.main && expandedRoles.includes(role.id) && role.rolsList && (
        <div className="ml-4 mt-1">
          {role.rolsList.map(renderRoleCheckbox)}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Existing form fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuario
              </Label>
              <Input
                id="username"
                {...register("username")}
                className="col-span-3"
              />
            </div>
            {/* ... (other form fields) */}

            {/* Roles section */}
            <div className="col-span-4">
              <Label>Roles</Label>
              <div className="mt-2 space-y-2">
                {allRoles?.map(renderRoleCheckbox)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;