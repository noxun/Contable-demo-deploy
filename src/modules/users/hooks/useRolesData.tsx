import { useQuery } from "@tanstack/react-query";
import { fetchAllRoles, fetchUserRoles } from "@user/lib/user";
import { Role, UseRolesDataReturn } from "@user/types/users";

export const useRolesData = (userId: number): UseRolesDataReturn => {
  const { data: userRoles } = useQuery<Role[]>({
    queryKey: ["userRoles", userId],
    queryFn: () => fetchUserRoles(userId),
    enabled: !!userId,
  });

  const { data: allRoles } = useQuery<Role[]>({
    queryKey: ["allRoles"],
    queryFn: fetchAllRoles,
  });

  console.log('hola el userId del usuario es: ', userId)

  return { userRoles, allRoles };
};