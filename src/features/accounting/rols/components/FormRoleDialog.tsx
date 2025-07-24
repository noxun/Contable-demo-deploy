import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoleSchema, CreateRole, UpdateRole } from "../schemas/rolSchema";
import { useCreateRole } from "../hooks/useRols";
import { useUpdateRole } from "../hooks/useRols";
import { useState } from "react";
import { toast } from "sonner";
import { getIconComponent } from "../../shared/utils/getIconComponent";

interface PropsValues extends UpdateRole {
  id: number;
}

interface Props {
    mode: "create-rol" | "create-subrol" | "edit"
    parentId?:number
    values?: PropsValues
}

export function FormRoleDialog({mode, parentId, values: values}:Props) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CreateRole>({
      resolver: zodResolver(createRoleSchema),
      mode: "onChange",
      defaultValues: mode === "edit" && values
        ? { ...values }:{
        name: "",
        nameRef: (mode === "create-subrol" && parentId) ? parentId : 0,
        main: (mode === "create-subrol" && parentId) ? false : true,
        title: "",
        icon: "",
        isMenu: true,
      },
  });

  const { mutate, isPending } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const onSubmitRols = (data: CreateRole) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Rol creado exitosamente");
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Hubo un error al crear el rol");
      }
    });
  };

  const onSubmitEdit = (data: UpdateRole) => {
    if (!values) {
      toast.error("No se encontraron los datos del rol para actualizar.");
      return;
    }
    updateRole({ id: values.id, data: data }, {
      onSuccess: () => {
        toast.success("Rol actualizado correctamente");
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Error al actualizar el rol");
      },
    });
  };

  const onSubmit = (mode === "create-rol" || mode === "create-subrol") ? onSubmitRols : onSubmitEdit
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create-rol" ? (
          <Button>
            <Plus className="h-4 w-4" /> Nuevo/Seccion
          </Button>
        ) : mode === "create-subrol" ? (
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3" /> <p className="hidden sm:block">Subrol</p> 
          </Button>
        ) : (
          <Button variant="ghost"  size="icon">
            <Edit className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md px-6 py-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border ">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-gray-700 dark:text-gray-100 tracking-tight">
            {mode === "create-rol"
              ? "⬤- Crear Nuevo Rol"
              : mode === "create-subrol"
              ? "⬤- Crear Nuevo Subrol"
              : "⬤- Editar Rol"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Campo: Nombre */}
          <div className="relative">
            <label htmlFor="name" className="absolute left-3 -top-3 text-xs bg-white dark:bg-black dark:text-gray-100 text-gray-500 px-2 font-medium">
              {mode === "create-rol" ? "Nombre del Rol" : "Ruta del ROl"}
            </label>
            <Input
              id="name"
              placeholder=""
              {...register("name")}
              className="h-12 px-3 border border-zinc-300 dark:border-zinc-500 text-sm rounded-md"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Campo: Título */}
          <div className="relative">
            <label htmlFor="title" className="absolute left-3 -top-3 text-xs bg-white dark:bg-black dark:text-gray-100 text-gray-500 px-1 font-medium">
              Título del Rol
            </label>
            <Input
              id="title"
              placeholder=""
              {...register("title")}
              className="h-12 px-3 border border-zinc-300 dark:border-zinc-500 text-sm rounded-md"
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Campo: Ícono */}
          <div className="relative">
            <label htmlFor="icon" className="absolute left-3 -top-3 text-xs bg-white dark:bg-black dark:text-gray-100 px-1 text-gray-500 font-medium">
              Ícono (ej: User, Settings)
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="icon"
                {...register("icon")}
                className="h-12 px-3 border border-zinc-300 dark:border-zinc-500 text-sm rounded-md "
              />
              <span className="text-gray-500 border border-zinc-300 dark:border-zinc-500 p-3 rounded-sm">
                {getIconComponent(watch("icon") ?? "")}
              </span>
              <select
                className="w-full h-12 px-3 text-sm border border-zinc-300 dark:border-zinc-500 rounded-md bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-100"
                onChange={(e) => setValue("icon", e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Selecciona un ícono...</option>
                <option value="ListTodo">Lista</option>
                <option value="MapPinHouse">Ubicacion</option>
                <option value="Folder">Folder</option>
              </select>
            </div>
            {errors.icon && (
              <p className="text-xs text-red-500 mt-1">{errors.icon.message}</p>
            )}
          </div>

          {/* Botones */}
          <DialogFooter className="pt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="text-sm text-zinc-500 hover:text-blue-900 hover:bg-blue-50">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="text-sm rounded-xl bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 shadow-sm">
              {mode === "create-rol"
                ? "Crear Rol"
                : mode === "create-subrol"
                ? "Crear Subrol"
                : "Actualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
