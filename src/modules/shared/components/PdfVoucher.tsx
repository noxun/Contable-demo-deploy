/* eslint-disable jsx-a11y/alt-text */
"use client";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createTw } from "react-pdf-tailwind";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Voucher, VoucherType } from "../types/sharedTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import { numberWithDecimals } from "../utils/validate";

const tw = createTw({
  theme: {
    extend: {},
  },
});
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});
export default function PdfVoucher({
  id,
  type,
}: {
  id: number;
  type: VoucherType;
}) {
  const token = localStorage.getItem("token");

  const {data, isLoading} = useQuery({
    queryKey: ["Vouchers", id, type],
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
      console.log(response.data);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { items } = data!;

  const totalDebitBs = items?.reduce(
    (sum: number, item) => sum + item.debitBs!,
    0
  ) ?? 0;
  const totalDebitSus = items?.reduce(
    (sum: number, item) => sum + item.debitSus,
    0
  ) ?? 0;
  const totalAssetBs = items?.reduce(
    (sum: number, item) => sum + item.assetBs!,
    0
  ) ?? 0;
  const totalAssetSus = items?.reduce(
    (sum: number, item) => sum + item.assetSus,
    0
  ) ?? 0;

  return (
    <Dialog>
      {/* <DialogTrigger asChild><Button size="icon" variant="outline"><ReceiptText className="size-4"/></Button></DialogTrigger> */}
      <DialogTrigger> Ver Comprobante</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[600px] w-full flex items-center justify-center">
        <PDFViewer showToolbar={true} className="h-full w-full">
          <Document>
            <Page size="LETTER" style={tw("p-4 flex w-full text-sm")}>
              {/* Fila logo */}
              <View style={tw("w-[207px]")}>
                <View style={tw("flex items-center")}>
                  <Image
                    source="/images/tradecruz_logo.png"
                    style={{ height: 57, width: 207 }}
                  />
                  <Text>NIT 3754820020</Text>
                </View>
              </View>
              {/* Fila Titulo */}
              {/* 0 -> traspaso 1-> egreso -> ingreso */}
              <View style={tw("w-full flex items-center")}>
                <Text>
                  COMPROBANTE DE{" "}
                  {data?.type === 0
                    ? "TRASPASO"
                    : data?.type === 1
                    ? "EGRESO"
                    : "INGRESO"}
                </Text>
                <Text>N° {data?.num ?? "num"}</Text>
                <Text>Expresado en bolivianos</Text>
              </View>
              {/* Fila fecha */}
              <View style={tw("flex flex-row justify-between")}>
                <Text>
                  Santa Cruz,{" "}
                  {format(data?.voucherDate ?? new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </Text>
                <Text>T/C: {data?.exchangeRate ?? "rate"}</Text>
              </View>
              {/* Header Tabla */}
              <View style={tw("w-full flex flex-row border")}>
                <Text style={tw("w-[20%] text-center border-r py-4")}>
                  CÓDIGO
                </Text>
                <Text style={tw("flex-1 text-center border-r py-4")}>
                  CUENTAS
                </Text>
                <Text style={tw("w-[10%] text-center border-r py-4")}>
                  DEBE Bs.
                </Text>
                <Text style={tw("w-[10%] text-center border-r py-4")}>
                  HABER Bs.
                </Text>
                <Text style={tw("w-[10%] text-center border-r py-4")}>
                  DEBE $us.
                </Text>
                <Text style={tw("w-[10%] text-center border-r py-4")}>
                  HABER $us.
                </Text>
              </View>
              {/* Body tabla */}
              {/* AGREGAR GLOSAS Y TOTAL LITERAL? */}
              {data?.items?.map((item) => (
                <View key={item.id} style={tw("w-full flex flex-row border")}>
                  <Text style={tw("w-[20%] border-r")}>{item?.code ?? "code"}</Text>
                  <Text style={tw("border-r flex-1")}>{item?.description ?? "desc"}</Text>
                  <Text style={tw("w-[10%] border-r text-right")}>
                    {numberWithDecimals(item.debitBs ?? 0)}
                  </Text>
                  <Text style={tw("w-[10%] border-r text-right")}>
                    {numberWithDecimals(item.assetBs ?? 0)}
                  </Text>
                  <Text style={tw("w-[10%] border-r text-right")}>
                    {numberWithDecimals(item.debitSus)}
                  </Text>
                  <Text style={tw("w-[10%] border-r text-right")}>
                    {numberWithDecimals(item.assetSus)}
                  </Text>
                </View>
              ))}
              {/* Espacio restante abajo de la tabla, abajo de los items */}
              <View style={tw("w-full flex flex-row border flex-1")}>
                <Text style={tw("w-[20%] border-r")}></Text>
                <Text style={tw("border-r flex-1")}></Text>
                <Text style={tw("w-[10%] border-r text-right")}></Text>
                <Text style={tw("w-[10%] border-r text-right")}></Text>
                <Text style={tw("w-[10%] border-r text-right")}></Text>
                <Text style={tw("w-[10%] border-r text-right")}></Text>
              </View>
              {/* Footer tabla */}
              <View style={tw("w-full flex flex-row")}>
                <Text style={tw("w-[20%]")}>DESCRIPCIÓN:</Text>
                <Text style={tw("flex-1 text-right")}>TOTALES</Text>
                <Text style={tw("w-[10%]")}>{numberWithDecimals(totalDebitBs)}</Text>
                <Text style={tw("w-[10%]")}>{numberWithDecimals(totalAssetBs)}</Text>
                <Text style={tw("w-[10%]")}>{numberWithDecimals(totalDebitSus)}</Text>
                <Text style={tw("w-[10%]")}>{numberWithDecimals(totalAssetSus)}</Text>
              </View>
              {/* DESCRIPCIÓN */}
              <View style={tw("w-full flex border-b")}>
                <Text>{data?.gloss ?? "DESCRIPCIÓN"}</Text>
              </View>
              <View style={tw("w-full flex flex-row gap-8")}>
                <View style={tw("h-20 flex-1 flex")}>
                  <Text>Elaborado:</Text>
                  <View style={tw("border h-full rounded-lg")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                  </View>
                </View>
                <View style={tw("h-20 flex-1 flex")}>
                  <Text>Revisado:</Text>
                  <View style={tw("border h-full rounded-lg")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                  </View>
                </View>
                <View style={tw("h-20 flex-1 flex")}>
                  <Text>Aprobado:</Text>
                  <View style={tw("border h-full rounded-lg")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
}
