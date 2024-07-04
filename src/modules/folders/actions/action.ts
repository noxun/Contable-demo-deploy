import axios from "axios";
import { IDispatchDocument } from "../interface/invoice";

const savedToken = localStorage.getItem("token");
export const dispatchDocumentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/dispatchDocument",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${savedToken}`,
  },
});
export async function invoiceDispatchDocument(
  numRef: string,
  invoice_number: number,
  url1: string | null = null,
  url2: string | null = null
) {
  try {
    const { data, status } = await dispatchDocumentApi.post<IDispatchDocument>(
      "/document",
      {
        carpeta: numRef,
        num: invoice_number,
        url1: url1,
        url2: url2,
      }
    );

    return { data, status };
  } catch (error) {
    console.log(error);
  }
}
