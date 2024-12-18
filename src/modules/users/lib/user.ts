import axios from "axios"
import { Role, userId } from "@user/types/users.d"

export async function deleteUserAPI(userId: userId, token: string) {
  const { id } = userId
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?userid=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error("Error al eliminar el usuario")
  }
}

export const updateUserAPI = async (userId: number, data: any, token: string) => {
  const formattedRols = data.roles.map((roleId: number) => ({ rolId: roleId }))
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/`,
      { id: userId, ...data, rols: formattedRols },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    return response.data
  } catch (e) {
    throw new Error("Error al editar el usuario")
  }
}


export const fetchAllRoles = async (): Promise<Role[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roles`);
  return response.data;
};

export const fetchUserRoles = async (userId: number): Promise<Role[]> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/getrol/${userId}`);
  return response.data;
};
