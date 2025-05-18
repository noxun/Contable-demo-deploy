"use server";
import axios, { isAxiosError } from "axios";
// import { IFactura } from "../interfaces/factura";
// import { IBillingRespose } from "@/modules/auth/interfaces/login-response";
import { cookies } from "next/headers";
import { IBillingRespose } from "../interface/invoice";

export const billingApiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FACT_URL,
});

async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await billingApiAuth.get("/invoices/siat/v2/actividades", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Token verification completed", response.data);
    return true;
  } catch (error) {
    console.error("Token verification failed", error);
    return false;
  }
}

async function postAuthBilling(): Promise<string> {
  try {
    const { data } = await billingApiAuth.post<IBillingRespose>(
      "/v1.0.0/users/get-token",
      {
        username: process.env.NEXT_PUBLIC_FACT_USR,
        password: process.env.NEXT_PUBLIC_FACT_PASS,
      }
    );
    console.log("Authentication completed", data.data);
    return data.data.token;
  } catch (error) {
    console.error("Authentication failed", error);
    throw new Error("Authentication failed");
  }
}

export async function getValidToken(): Promise<string> {
  const cookiesStore = cookies();
  let token = cookiesStore.get("token")?.value || "";

  // Verificar el token inicial
  let tokenValid = await verifyToken(token);
  console.log("🚀 ~ getValidToken ~ tokenValid:", tokenValid);

  if (!tokenValid) {
    // Autenticar si el token no es válido
    token = await postAuthBilling();
    console.log("🚀 ~ getValidToken ~ token:", token);

    // Guardar el nuevo token en las cookies
    cookiesStore.set("token", token);

    // Verificar el nuevo token
    tokenValid = await verifyToken(token);

    if (!tokenValid) {
      throw new Error(
        "Authentication failed: invalid token after re-authentication"
      );
    }
  }

  return token;
}

async function getBilling(token: string, url: string) {
  try {
    const { data } = await billingApiAuth.get(`${url}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data;
  } catch (error) {
    throw new Error("Main service call failed");
  }
}

async function postBilling(token: string, url: string, body: any) {
  try {
    const { data, status } = await billingApiAuth.post(`${url}`, body, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Main service called", data, status);
    return data.data;
  } catch (error) {
    console.log("🚀 ~ postBilling ~ error:", error);
    if (isAxiosError(error)) {
      return {
        hasError: true,
        message: error.response?.data,
      };
    }
  }
}

export async function handleListInvoices(
  url: string,
  page: string | undefined
) {
  try {
    const token = await getValidToken();
    const result = await getBilling(token, url);
    return {
      hasError: false,
      data: result,
      message: "",
      next: `${page ? Number(page) + 1 : 2}`,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    if (isAxiosError(error)) {
      return {
        hasError: true,
        data: error.response?.data,
        message: error.response?.data,
      };
    }
  }
}

export async function handleCreateInvoices(url: string, body: any) {
  try {
    const token = await getValidToken();
    const result = await postBilling(token, url, body);
    if (result && !result.hasError) {
      return {
        hasError: false,
        data: result,
        message: "Se genero con éxito",
      };
    } else {
      return {
        hasError: true,
        data: result.message,
        message: "Ocurrió un error.",
      };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    if (isAxiosError(error)) {
      return {
        hasError: true,
        data: error.response?.data,
        message: error.response?.data,
      };
    }
  }
}

export async function handleGetBilling(url: string) {
  try {
    const token = await getValidToken();
    const result = await getBilling(token, url);
    return {
      hasError: false,
      data: result,
      message: "",
    };
  } catch (error) {
    console.error("An error occurred:", error);
    if (isAxiosError(error)) {
      return {
        hasError: true,
        data: error.response?.data,
        message: error.response?.data,
      };
    }
  }
}

export async function handlePostBilling(url: string, body: any) {
  try {
    const token = await getValidToken();
    // const result = await postBilling(token, url, body);
    // if (result && !result.hasError) {
    //   return {
    //     hasError: false,
    //     data: result,
    //     message: "Se genero con éxito",
    //   };
    // } else {
    //   return {
    //     hasError: true,
    //     data: result.message,
    //     message: "Ocurrió un error.",
    //   };
    // }
    return {
      hasError: false,
      data: token,
      message: "Se genero con éxito",
    };
  } catch (error) {
    console.error("An error occurred:", error);
    if (isAxiosError(error)) {
      return {
        hasError: true,
        data: error.response?.data,
        message: error.response?.data,
      };
    }
  }
}
