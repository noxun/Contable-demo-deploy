"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { TableIncome } from "@/modules/income/components/TableIncome";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IIncomeResponse } from "@/modules/income/interface/income";

const IncomePage = () => {
  const token = localStorage.getItem("token");
  const { data, isLoading, error } = useQuery({
    queryKey: ["VoucherIncome"],
    queryFn: async (): Promise<{ data: IIncomeResponse[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/All?type=2`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Ingresos</h2>
        <Link href="/dashboard/income/new">
          <Button>Nuevo ingreso</Button>
        </Link>
      </div>
      <TableIncome data={data?.data!} />
    </section>
  );
};

export default IncomePage;
