"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useUserStore from "@/lib/userStore";
import useUfv from "@/features/accounting/shared/hooks/useUfv";
import UfvRegisterForm from "./UfvRegisterForm";

export default function UfvRegistrationDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const loginData = useUserStore((state) => state.loginData);
  // const loginData = useStore(useUserStore, (state) => state.loginData);
  const {
    data: ufv,
    isLoading,
    isPending,
    isError,
  } = useUfv(!loginData?.ufvRegister);

  if (!loginData || loginData.ufvRegister) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registro de UFV y T/C</AlertDialogTitle>
          <AlertDialogDescription>
            Registre los valores de UFV y la tasa de cambio que sera usada por
            el dia de hoy
          </AlertDialogDescription>
        </AlertDialogHeader>
        {isLoading || isPending ? (
          <div>Obteniendo Datos del BCB</div>
        ) : (
          <UfvRegisterForm ufv={ufv!} setIsOpen={setIsOpen} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
