import axios from "axios";
import { branchId } from "@branch/types/branch.d";

export async function deleteBranchAPI(branchId: branchId, token: string) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Sucursal/${branchId.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar la sucursal");
  }
}