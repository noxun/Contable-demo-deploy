"use client"

import FormEditIncome from "@/modules/income/components/FormEditIncome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function EditIncomePage({ params }: { params: { id: string }}) {

  const token = localStorage.getItem("token");
  const id = params.id;

  const editIncomeQuery = useQuery({
    queryKey: ["VoucherIncome", id],
    queryFn: async function (): Promise<{ data: any }> {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher?id=${id}&type=2`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    staleTime: 1000*60*10,

  });

  if(editIncomeQuery.isLoading){
    return (<div>Loading</div>);
  }

  console.log(editIncomeQuery.data)

  return (
    <div className="px-6">
      <h2 className="text-lg font-bold">Formulario para editar ingreso {params.id}</h2>
      <FormEditIncome type="2" income={editIncomeQuery?.data} />
    </div>
  );
}
