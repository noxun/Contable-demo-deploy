"use client";
import { Button } from "@/components/ui/button";
import { ButtonFacturaPdf } from "@/modules/folders/components/ButtonFacturaPdf";
import { ButtonPlanillaPdf } from "@/modules/folders/components/ButtonPlanillaPdf";
import { TableConceptExpense } from "@/modules/folders/components/TableConceptExpense";
import {
  IResponseConceptFolder,
  IResponseDispatchDocument,
  IResponseFolder,
} from "@/modules/folders/interface/folders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import useToken from "@/modules/shared/hooks/useToken";
import { ButtonSendEmail } from "@/modules/folders/components/ButtonSendEmail";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface Props {
  params: { numRef: string };
}
export default function FolderPage({ params }: Props) {
  const { token, isTokenReady } = useToken();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ConceptExpense", params.numRef],
    queryFn: async (): Promise<{ data: IResponseConceptFolder[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ConceptExpense/carpeta/${params.numRef}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 30 * 10,
    enabled: isTokenReady,
  });

  const {
    data: dataFolder,
    isLoading: isLoadingFolder,
    error: errorFolder,
  } = useQuery({
    queryKey: ["ProdecureDetail", params.numRef],
    queryFn: async (): Promise<{ data: IResponseFolder }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_TRAZO_URL}/Procedure/numRef/${params.numRef}/Detail`,
        { headers: { "Content-Type": "application/json" } }
      ),
    staleTime: 1000 * 30 * 10,
    enabled: isTokenReady,
  });

  const {
    data: dispatchDocument,
    isLoading: isLoadingDispatchDocument,
    error: errorDispatchDocument,
  } = useQuery({
    queryKey: ["DispatchDocument", params.numRef],
    queryFn: async (): Promise<{ data: IResponseDispatchDocument }> =>
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/DispatchDocument`,
        { carpeta: params.numRef },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    staleTime: 1000 * 30 * 10,
    enabled: isTokenReady,
  });

  useEffect(() => {
    if (dispatchDocument?.data?.url1) {
      QRCode.toDataURL(dispatchDocument.data.url1)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch(() => {
          setQrCodeUrl(null);
        });
    }
  }, [dispatchDocument?.data?.url1]);

  if (isLoading || isLoadingFolder || isLoadingDispatchDocument)
    return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  if (errorFolder) return "An error has occurred: " + errorFolder.message;
  if (errorDispatchDocument)
    return "An error has occurred: " + errorDispatchDocument.message;

  return (
    <section className="px-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">
          Lista de pagos <span className="text-blue-500">{params.numRef}</span>
        </h2>
        <div className="flex gap-2">
          {dispatchDocument ? (
            <>
              {dispatchDocument.data.url1 ? <ButtonSendEmail /> : null}
              <ButtonPlanillaPdf
                data={data?.data ?? []}
                dataFolder={dataFolder?.data}
                dispatchDocument={dispatchDocument?.data}
              />
              <ButtonFacturaPdf
                data={data?.data ?? []}
                dataFolder={dataFolder?.data}
                dispatchDocument={dispatchDocument?.data}
                src={qrCodeUrl}
              />
            </>
          ) : null}
          <Link href={`/dashboard/folders/${params.numRef}/register-payment`}>
            <Button>
              Registrar Pagos{" "}
              <SquareArrowOutUpRight className="ml-2" size={15} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mb-2">
        <h4>Carpeta: {dataFolder?.data.numRef}</h4>
        <h4>DIM: {dataFolder?.data.dim}</h4>
        <h4>Cliente: {dataFolder?.data.clienteNombre}</h4>
        <h4>Mercadería: {dataFolder?.data.mercaderia}</h4>
      </div>
      <TableConceptExpense numRef={params.numRef} data={data?.data ?? []} />
    </section>
  );
}
