"use client";

import { DataTable } from "@/components/ui/data-table";
import { Voucher, VoucherType, VoucherTypeRoute } from "../types/sharedTypes";
import { columns } from "./voucher-columns";

type VoucherTableProps = {
  data: Voucher[];
  voucherType: VoucherType;
  voucherTypeRoute: VoucherTypeRoute;
};

export default function VoucherTable({
  data,
  voucherType,
  voucherTypeRoute,
}: VoucherTableProps) {
  return (
    <DataTable columns={columns(voucherType, voucherTypeRoute)} data={data} />
  );
}
