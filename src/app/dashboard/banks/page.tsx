"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TableBank } from "@/modules/banks/components/TableBank";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBanks } from "@/lib/data";
import { FormConvertBank } from "@/modules/banks/components/FormConvertToBank";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function BanksPage() {
  const { data, isPending } = useQuery({
    queryKey: ["Bank"],
    queryFn: fetchAllBanks,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col items-center">
        <h1 className="font-bold text-3xl mb-5">BANCOS</h1>
        <div className="flex w-full items-center gap-4 justify-end">
          <Link href="/files/example_extract_bank.xlsx" download prefetch={false}>
            <Button>Descargar Plantilla Extracto</Button>
          </Link>
          {/* <Link href="/dashboard/banks/new">
            <Button>Nuevo Banco</Button>
          </Link> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Banco a cuenta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="pb-4">Convertir un cuenta a banco</DialogTitle>
                <DialogDescription>
                  <FormConvertBank />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="m-0 p-0" />
            </DialogContent>
          </Dialog>
        </div>
      </div >
      {
        isPending ? <div>Cargando...</div> : <TableBank data={data ?? []} />
      }
    </div >
  );
}

