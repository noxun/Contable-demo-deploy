import { Login } from "@/modules/auth/components/LoginForm";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function login(data: Login) {
  const response = await axios.post(
    `${API_URL}/Auth/login`,
    data
  );
  return response.data;
}