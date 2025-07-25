import { api } from "@/lib/api";
import { Role, CreateRole, UpdateRole } from "../schemas/rolSchema";

export const rolesService = {
  async fetchRoles() {
    const response = await api.get("/api/Rol");
    return response.data as Role[];
  },

  async fetchRoleById(id: number) {
    const response = await api.get(`/api/Rol/${id}`);
    return response.data as Role;
  },

  async createRole(data: CreateRole) {
    const response = await api.post("/api/Rol", data);
    return response.data;
  },

  async updateRole(id: number, data: UpdateRole) {
    const response = await api.patch(`/api/Rol/id?id=${id}`, data);
    return response.data;
  },

  async deleteRole(id: number) {
    const response = await api.delete(`/api/Rol/id?id=${id}`);
    return response.data;
  },
};