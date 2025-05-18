import axios from "axios";
import { branchId } from "@/features/accounting/branches/types/branch";

export async function deleteBranchAPI(branchId: branchId, token: string) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Sucursal/`,
      {
        params: {
          sucursalId: branchId.id,
        },
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