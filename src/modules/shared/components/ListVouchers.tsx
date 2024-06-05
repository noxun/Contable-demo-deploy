"use client";

import { useQuery } from "@tanstack/react-query";
import { Voucher, VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import axios from "axios";
import VoucherTable from "./VoucherTable";
import useToken from "../hooks/useToken";

type ListVouchersProps = {
  voucherType: VoucherType;
  voucherTypeRoute: VoucherTypeRoute;
};

export default function ListVouchers({
  voucherType,
  voucherTypeRoute,
}: ListVouchersProps) {

  const {token, isTokenReady} = useToken();

  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ["Vouchers", voucherType],
    queryFn: async (): Promise<{ data: Voucher[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/All?type=${voucherType}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 30 * 10,
  });

  if (isLoading || isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <VoucherTable
      voucherType={voucherType}
      voucherTypeRoute={voucherTypeRoute}
      data={data?.data ?? []}
    />
  );
}
