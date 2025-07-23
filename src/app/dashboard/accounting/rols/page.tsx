"use client";

import RolsPage from "@/features/accounting/rols/components/RolsPage";
import { FormRoleDialog } from "@/features/accounting/rols/components/FormRoleDialog";

export default function ReceiptsPage() {
  return (
    <div className="py-2 px-1 md:p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestión de Roles</h1>
          <p className="text-muted-foreground text-xs md:text-base">Administra roles y subroles del sistema</p>
        </div>
        <FormRoleDialog mode="create-rol"/>
      </div>
      <RolsPage/>
    </div>
  );
}
