import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { IUserResponse } from "../interface/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import useToken from "@/modules/shared/hooks/useToken";

interface FormValues {
  name: string;
  username: string;
  email: string;
  fatherLastName: string;
  motherLastName: string;
  ci: string;
  status: string;
}

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUserResponse;
}

const EditUser = ({ isOpen, onClose, user }: EditUserProps) => {
  const {token} = useToken();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      fatherLastName: user.fatherLastName,
      motherLastName: user.motherLastName,
      ci: user.ci,
      status: user.status,
    },
  });

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log(user.id)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`, 
        { id: user.id ,...data},
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
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    console.log(values);
    updateUserMutation.mutate(values);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Usuario
              </Label>
              <Input
                id="username"
                {...register("username",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                {...register("email",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                {...register("name",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fatherLastName" className="text-right">
                Apellido Paterno
              </Label>
              <Input
                id="fatherLastName"
                {...register("fatherLastName",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="motherLastName" className="text-right">
                Apellido Materno
              </Label>
              <Input
                id="motherLastName"
                {...register("motherLastName",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ci" className="text-right">
                CI
              </Label>
              <Input
                id="ci"
                {...register("ci",)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <Input
                id="status"
                {...register("status",)}
                className="col-span-3"
              />
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
