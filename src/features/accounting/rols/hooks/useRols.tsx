// src/features/roles/hooks/useRoles.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesService } from "../services/rolsService";
import { CreateRole, Role, UpdateRole } from "../schemas/rolSchema";

export const useGetRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: rolesService.fetchRoles,
  });
};


export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRole) => rolesService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}


export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolesService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}


export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRole }) => rolesService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
