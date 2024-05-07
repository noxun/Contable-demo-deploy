"use client";
import { Button } from "@/components/ui/button";
import { TableIncome } from "@/modules/income/components/TableIncome";
import { IIncomeResponse } from "@/modules/income/interface/income";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React from "react";

const DiaryPage = () => {
  const token = localStorage.getItem("token");
  const { data, isLoading, error } = useQuery({
    queryKey: ["VoucherDiary"],
    queryFn: async (): Promise<{ data: IIncomeResponse[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher/All?type=0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 0,
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <section className="px-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">Ingresos</h2>
        <Link href="/dashboard/diary/new">
          <Button>Nuevo registro</Button>
        </Link>
      </div>
      <TableIncome data={data?.data!} />
    </section>
  );
};

export default DiaryPage;
