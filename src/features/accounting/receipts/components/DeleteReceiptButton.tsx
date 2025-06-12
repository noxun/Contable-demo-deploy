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
import { useDeleteReceipt } from "../hooks/useReceipts"
import { toast } from "sonner"

interface DeleteReceiptButtonProps {
  receiptId: number
}

export function DeleteReceiptButton({ receiptId }: DeleteReceiptButtonProps) {
  const deleteReceiptMutation = useDeleteReceipt()

  const handleDelete = () => {
    deleteReceiptMutation.mutate(receiptId, {
      onSuccess: () => {
        toast.success("Recibo eliminado correctamente")
      },
      onError: (error) => {
        toast.error("Error al eliminar el recibo")
        console.error("Error deleting receipt:", error)
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el recibo
            de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteReceiptMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteReceiptMutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
