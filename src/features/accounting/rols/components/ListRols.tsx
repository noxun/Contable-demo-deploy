import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { SubRoleItem } from "./SubRols";
import { useGetRoles } from "../hooks/useRols";
import { DeleteRole } from "./DeleteRole-dialog";
import { FormRoleDialog } from "./FormRoleDialog";

export default function ListRols(){

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
      setExpandedId(prev => (prev === id ? null : id));
  };

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  const { data: roles, isLoading, error } = useGetRoles();

  if (isLoading) return <p>Cargando roles...</p>;
  if (error) return <p>Error al cargar roles.</p>;

  return(
    <Card className="border-none">
      <CardHeader className="p-0">
        <CardTitle></CardTitle>
        <CardDescription>
          {/* {roles?.length} roles configurados con {roles?.reduce((acc, role) => acc + role.rolsList.length, 0)} subroles */}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {roles?.map((role) => (
            <div className="border rounded-lg" key={role.id}>
              <Collapsible open={expandedId === role.id} onOpenChange={() => toggle(role.id)}>
                  <div className="flex items-center justify-between hover:bg-muted/50">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-3 cursor-pointer w-full px-4 py-6 h-full">
                        {expandedId === role.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div className={`w-3 h-3 rounded-full ${colors[role.id % colors.length]}`} />
                        <div className="flex flex-col sm:flex-row">
                          <h3 className="font-semibold">{role.name}</h3>
                          <Badge variant="secondary" className="ml-2">
                            {role.rolsList.length} subroles
                          </Badge>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-2">
                      <FormRoleDialog mode="create-subrol" parentId={role.id} />
                      <FormRoleDialog mode="edit" values={role} key={role?.id} />
                      <DeleteRole idRol={role.id} name={role.name} />
                    </div>
                  </div>

                  <CollapsibleContent>
                  <div className="px-4 pb-4">
                    <div className="ml-7 space-y-2">
                      {role.rolsList.map((subRole) => (
                        <SubRoleItem
                          key={subRole.id}
                          subRole={subRole}
                        />
                      ))}
                      {role.rolsList.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="h-8 w-8 mx-auto mb-2 opacity-50 bg-muted rounded" />
                          <p>No hay subroles configurados</p>
                          <div className="mt-2">
                            <FormRoleDialog mode="create-subrol" parentId={role.id}/>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}