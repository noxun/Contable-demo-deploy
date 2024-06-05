"use server";
import axios, { isAxiosError } from "axios";
import { IAuthBillingRespose } from "../interface/invoice";
export const billingApiAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FACT_URL,
  headers: {
    Accept: "application/json",
  },
});

export async function getListInvoices(url: string, page: number) {
  try {
    const { data: dataBilling } =
      await billingApiAuth.post<IAuthBillingRespose>(
        "/v1.0.0/users/get-token",
        {
          username: process.env.NEXT_PUBLIC_FACT_USR,
          password: process.env.NEXT_PUBLIC_FACT_PASS,
        }
      );

    const { data } = await billingApiAuth.get(
      `${url}?page=${page ? page : "1"}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + dataBilling.data.token,
        },
      }
    );

    return {
      hasError: false,
      data: data.data,
      message: "",
      // next: `${cursor ? Number(cursor) + 1 : 2}`,
    };
  } catch (error) {
    1;
    if (isAxiosError(error)) {
      return {
        hasError: true,
        data: error.response?.data,
        message: error.response?.data,
      };
    }
  }
}
