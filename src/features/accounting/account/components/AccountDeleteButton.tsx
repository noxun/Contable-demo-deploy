"use client";
import { PropsWithChildren } from "react";
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
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type AccountDeleteButtonProps = {
  message: string;
  accountId: number;
};

export default function AccountDeleteButton({
  message,
  accountId,
}: AccountDeleteButtonProps) {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const deleteAccountMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account?accountId=${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast("Account deleted succesfully");
      queryClient.invalidateQueries({ queryKey: ["accountsAll"] });
    },
    onError: (error, variables, context) => {
      console.log(error, variables, context);
      toast(error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button title="Eliminar Registro" variant="outline" size="icon" >
          <Trash2 className="size-4"/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteAccountMutation.mutate(accountId);
            }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
