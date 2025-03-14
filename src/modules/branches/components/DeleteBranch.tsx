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
import {Button} from "@/components/ui/button"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"

import { Branch } from "@/lib/types";
import { branchId } from "@branch/types/branch.d";
import { deleteBranchAPI } from "@branch/lib/branch";



interface Props {
    branchToDelete: Branch,
    token: string
    onCloseDialog: () => void
}

export const DeleteBranch = ({branchToDelete, onCloseDialog, token}: Props) => { 
    const {mutate: deleteBranch, isError} = useDeleteBranch()

    function useDeleteBranch() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (branchId: branchId) => deleteBranchAPI(branchId, token),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["allBranches"]})
                toast.success("Sucursal eliminado correctamente")
            },
            onError: (error: Error) => {
                toast.error("Hubo un error al eliminar la sucursal")
            },
        })
    }

    const handleDeleteBranch = ({id}: branchId) => deleteBranch({id})

    if (isError) {
        return (<span>Ocurrio un error al eliminar la sucursal...</span>)
    }

    return (
        <>
            <AlertDialog open={!!branchToDelete} onOpenChange={onCloseDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-semibold">
                            Estás seguro de eliminar al usuario {branchToDelete.nameSucutsal}?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            Esta acción no puede revertirse. Esto borrará permanentemente al usuario con
                            id: {branchToDelete.id}
                        </AlertDialogDescription>
                        <AlertDialogFooter className="flex gap-1 items-center justify-end">
                            <AlertDialogCancel asChild>
                                <Button variant="outline" onClick={onCloseDialog}>
                                    Cancelar
                                </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button variant="default" onClick={() => handleDeleteBranch({id: branchToDelete.id})}>
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