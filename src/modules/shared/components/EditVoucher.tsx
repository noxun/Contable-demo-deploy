"use client";
import { useQuery } from "@tanstack/react-query";
import { Voucher, VoucherType } from "../types/sharedTypes";
import axios from "axios";
import FormEditVoucher from "./FormEditVoucher";
import useToken from "../hooks/useToken";
import { DateRange } from "react-day-picker";

type EditVoucherProps = {
  id: string;
  type: VoucherType;
  accountDate?: string; //para invalidar la query
};

export default function EditVoucher({ id, type, accountDate }: EditVoucherProps) {
  const { token, isTokenReady } = useToken();

  const editVoucherQuery = useQuery({
    queryKey: ["Vouchers", id.toString(), type.toString()],
    queryFn: async function (): Promise<Voucher> {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher?id=${id}&type=${type}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  console.log(editVoucherQuery.data);

  if (editVoucherQuery.isLoading || editVoucherQuery.isPending)
    return <div>Loading..</div>;

  return (
    <div>
      <FormEditVoucher type={type} voucher={editVoucherQuery!.data!} accountDate={accountDate}/>
    </div>
  );
}
