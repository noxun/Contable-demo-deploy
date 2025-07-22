"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useDeleteRole } from "../hooks/useRols"
import { toast } from "sonner"

interface Props {
  idRol: number
  name?: string
}

export function DeleteRole({ idRol, name }: Props) {

    const { mutate, isPending } = useDeleteRole();

    const handleDelete = (id: number) => {
        console.log("Eliminado rol: ", id)
        mutate(id, {
            onSuccess: () => toast.success("Rol eliminado correctamente"),
            onError: () => toast.error("Error al eliminar el rol"),
        });
    };

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
        <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
        aria-label="Eliminar rol"
        >
        <Trash2 className="h-[18px] w-[18px]" />
        </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="max-w-lg rounded-xl shadow-xl border border-muted">
        <AlertDialogHeader className="space-y-2">
        <AlertDialogTitle className="text-lg font-semibold text-red-700">
            ¿Eliminar el rol <span className="text-red-900 font-bold"> {name}</span>?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Esta acción <strong>no se puede deshacer</strong>. El rol será eliminado
            permanentemente de nuestros servidores.
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 pt-4">
        <AlertDialogCancel className="px-4 py-2 rounded-lg border border-muted hover:bg-muted">
            Cancelar
        </AlertDialogCancel>
        <AlertDialogAction
            onClick={() => handleDelete(idRol)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
            Eliminar rol
        </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

  )
}
