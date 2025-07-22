"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Menu } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { SubRole } from "../schemas/rolSchema"
import { FormRoleDialog } from "./FormRoleDialog"
import { DeleteRole } from "./DeleteRole-dialog"

interface SubRoleItemProps {
  subRole: SubRole
}

export function SubRoleItem({ subRole }: SubRoleItemProps) {

  // Utilidad para exportar íconos dinámicamente desde Lucide según su nombre
  const getIcon = (iconName: string | null) => {
    if (!iconName) return Menu

    // Remueve espacios para optener icono de Lucide
    const cleanIconName = iconName.replace(/\s+/g, "") as keyof typeof LucideIcons
    const IconComponent = LucideIcons[cleanIconName] as any
    return IconComponent || Menu
  }

  const IconComponent = getIcon(subRole.icon)

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
      <div className="flex items-center gap-3">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{subRole.title}</h4>
            {subRole.isMenu && (
              <Badge variant="outline" className="text-xs ml-2 border border-green-500 text-green-700 bg-transparent hover:bg-green-50">
                Menu
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Ruta: {subRole.name}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FormRoleDialog mode="edit" values={subRole}/>
        <DeleteRole idRol={subRole.id} name={subRole.title}/>
      </div>
    </div>
  )
}