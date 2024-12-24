import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { IUserResponse, userId } from "@user/types/users.d"
import { deleteUserAPI } from "@user/lib/user"

interface Props {
  userToDelete: IUserResponse,
  token: string
  onCloseDialog: () => void
}

export const DeleteUser = ({ userToDelete, onCloseDialog, token }: Props) => {

  const { mutate: deleteUser, isError } = useDeleteUser()


  function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (userId: userId) => deleteUserAPI(userId, token),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["User"] })
        toast.success("Usuario eliminado correctamente")
      },
      onError: (error: Error) => {
        console.error("Error al eliminar usuario:", error.message)
        toast.error("Hubo un error al eliminar el usuario")
      },
    })

  }

  const handleDeleteUser = ({ id }: userId) => deleteUser({ id })

  isError && (<span>Ocurrio un error al eliminar el usuario...</span>)

  return (
    <>
      <AlertDialog open={!!userToDelete} onOpenChange={onCloseDialog}>
        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              Estás seguro de eliminar al usuario {userToDelete.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Esta acción no puede revertirse. Esto borrará permanentemente al usuario con id: {userToDelete.id}
            </AlertDialogDescription>
            <AlertDialogFooter className="flex gap-1 items-center justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={onCloseDialog}>
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="default" onClick={() => handleDeleteUser({ id: userToDelete.id })}>
                  Aceptar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}