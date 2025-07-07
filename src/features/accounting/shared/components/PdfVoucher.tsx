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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Voucher, VoucherType } from "../types/sharedTypes";
import { format } from "date-fns";
import { es, is, tr } from "date-fns/locale";
import { numberWithDecimals } from "../utils/validate";
import useNumberToLiteral from "../hooks/useNumberToLiteral";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { COMPANY_MAIN_CITY, COMPANY_NIT, REPORTS_LOGO_URL,COMPANY_ADDRESS, COMPANY_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

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
  triggerTitle,
  isButton,
}: {
  id: number;
  type: VoucherType;
  triggerTitle?: string;
  isButton?: boolean;
}) {
  const token = localStorage.getItem("token");

  const now = new Date();
  const gestion = now.getFullYear();
  const mesLiteral = now.toLocaleString("es-BO", { month: "long" });
  const fecha = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const hora = now.toLocaleTimeString("es-BO");

  const { data, isLoading } = useQuery({
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

  const items = data?.items ?? [];

  const totalDebitBs =
    items?.reduce((sum: number, item) => sum + item.debitBs!, 0) ?? 0;
  const totalDebitSus =
    items?.reduce((sum: number, item) => sum + item.debitSus, 0) ?? 0;
  const totalAssetBs =
    items?.reduce((sum: number, item) => sum + item.assetBs!, 0) ?? 0;
  const totalAssetSus =
    items?.reduce((sum: number, item) => sum + item.assetSus, 0) ?? 0;

  const {
    data: totalLiteral,
    isLoading: isLoadingLiteral,
    isError: isErrorLiteral,
  } = useNumberToLiteral(totalDebitBs);

  if (isErrorLiteral) return <div>Error al obtener el literal</div>;

  if (isLoading || isLoadingLiteral) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog>
      {/* <DialogTrigger asChild><Button size="icon" variant="outline"><ReceiptText className="size-4"/></Button></DialogTrigger> */}
      <DialogTrigger asChild={isButton}>
        {isButton ? (
          <Button>{triggerTitle ?? "Ver comprobante"}</Button>
        ) : (
          triggerTitle ?? "Ver comprobante"
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[600px] w-full flex items-center justify-center">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Comprobante</DialogTitle>
            <DialogDescription>
              Muestra el comprobante de la transacción
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <PDFViewer showToolbar={true} className="h-full w-full">
          <Document>
            <Page wrap size="LETTER" style={tw("p-4 flex w-full")}>
              <View fixed style={{fontSize: '8px', color: 'gray',width: '100%',textAlign: 'right',paddingRight: 10,paddingBottom:4}}>
                <Text render={({ pageNumber, totalPages }) => `Página: ${pageNumber} / ${totalPages}`}/>
              </View>
              {/* Fila logo */}
              <View style={tw("w-full flex flex-row justify-between mb-4 text-sm")}>
                <View style={tw("flex-1")}>
                  <Image
                    source={REPORTS_LOGO_URL}
                    style={{ height: 40, width: 120 }}
                  />
                  <Text style={tw("font-semibold text-gray-600 mt-2")}>{COMPANY_NAME} </Text>
                  <Text style={tw("text-gray-500 mb-1")}>NIT {COMPANY_NIT}</Text>
                  <Text style={tw("text-gray-500 w-[170px]")}>{COMPANY_ADDRESS} </Text>
                </View>

                {/* Fila Titulo */}
                {/* 0 -> traspaso 1-> egreso -> ingreso */}
                <View style={tw(" flex-1 w-full flex items-center self-end")}>
                  <Text style={tw("font-bold")}>
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

                <View style={tw("flex-1 flex flex-col items-end pt-4 text-xs")}>
                  <View>
                    <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-500 pb-1")}>Gestion </Text>  <Text style={tw("text-gray-500")}> {gestion} </Text>  </View>
                    <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-500 pb-1")}>Mes </Text>  <Text style={tw("text-gray-500")}> {mesLiteral} </Text>  </View>
                    <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-500 pb-1")}>Fecha: </Text>  <Text style={tw("text-gray-500")}> {fecha} </Text>  </View>
                    <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-500 pb-1")}>Hora: </Text>  <Text style={tw("text-gray-500")}> {hora} </Text>  </View>
                  </View>
                </View>

              </View>

              {/* Fila fecha */}
              <View style={tw("flex flex-row justify-between items-end text-sm text-gray-700")}>
                <Text>
                  {COMPANY_MAIN_CITY},{" "}
                  {format(
                    data?.voucherDate ?? new Date(),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: es }
                  )}
                </Text>
                <View style={tw("flex flex-col items-end")}>
                  <Text>T/C: {data?.exchangeRate ?? "rate"}</Text>
                  <Text>{data?.checkNum === "0" ? "Pago en: Efectivo" : (`Cheque N°: ${data?.checkNum}`)}</Text>
                </View>
              </View>
              <View style={tw("text-sm")}>  
                {/* Header Tabla */}
                <View style={tw("w-full flex flex-row border font-semibold")}>
                  <Text style={tw("w-[15%] text-center border-r py-3")}>
                    CÓDIGO
                  </Text>
                  <Text style={tw("flex-1 text-center border-r py-3")}>
                    CUENTAS
                  </Text>
                  <Text style={tw("w-[15%] text-center border-r py-3")}>
                    HOJA RUTA
                  </Text>
                  <Text style={tw("w-[15%] text-center border-r py-3")}>
                    DEBE Bs.
                  </Text>
                  <Text style={tw("w-[15%] text-center py-3")}>
                    HABER Bs.
                  </Text>
                  {/* <Text style={tw("w-[10%] text-center border-r py-4")}>
                    DEBE $us.
                  </Text>
                  <Text style={tw("w-[10%] text-center border-r py-4")}>
                    HABER $us.
                  </Text> */}
                </View>
                {/* Body tabla */}
                {/* AGREGAR GLOSAS Y TOTAL LITERAL? */}
                {data?.items?.map((item, index) => (
                  <View 
                    wrap={false} 
                    key={item.id} 
                    style={tw(`w-full h-8 flex flex-row items-center border-l border-r border-gray-700 ${index===23 || index===54 || index===85 ? "border-b" : index===24 || index===55 || index===86 ? "border-t" : ""} `)}>
                    <View style={tw("w-[15%] h-full flex items-start justify-center px-2 border-r border-gray-700")}>
                      <Text style={tw("text-gray-800")}>{item?.code ?? "code"}</Text>
                    </View>
                    <View style={tw("flex-1 h-full flex items-start justify-center px-2 border-r border-gray-700")}>
                      <Text style={tw("text-gray-800")}>{item?.description ?? "desc"}</Text>
                    </View>
                    <View style={tw("w-[15%] h-full flex items-end justify-center px-2 border-r border-gray-700")}>
                      <Text style={tw("text-gray-800")}>{item.hojaDeRuta ?? " "}</Text>
                    </View>
                    <View style={tw("w-[15%] h-full flex items-end justify-center px-2 border-r border-gray7600")}>
                      <Text style={tw("text-gray-800")}>{numberWithDecimals(item.debitBs ?? 0)}</Text>
                    </View>
                    <View style={tw("w-[15%] h-full flex items-end justify-center px-2 border-gray-700")}>
                      <Text style={tw("text-gray-800")}>{numberWithDecimals(item.assetBs ?? 0)}</Text>
                    </View>
                    {/* <Text style={tw("w-[10%] border-r text-right")}>
                      {numberWithDecimals(item.debitSus)}
                    </Text>
                    <Text style={tw("w-[10%] border-r text-right")}>
                      {numberWithDecimals(item.assetSus)}
                    </Text> */}
                  </View>
                ))}
              </View>
              {/* Espacio restante abajo de la tabla, abajo de los items */}
              <View wrap={false} style={tw("w-full flex flex-row border flex-1 border-y-0")}>
                <Text style={tw("w-[15%] border-r")}></Text>
                <Text style={tw("border-r flex-1")}></Text>
                <Text style={tw("w-[15%] border-r text-right")}></Text>
                <Text style={tw("w-[15%] border-r text-right")}></Text>
                <Text style={tw("w-[15%] text-right")}></Text>
                {/* <Text style={tw("w-[10%] border-r text-right")}></Text> */}
              </View>
              {/* Footer tabla */}
              <View wrap={false} style={tw("w-full flex flex-row border border-gray-600 text-sm")}>
                <Text style={tw("w-[20%] p-2")}></Text>
                <Text style={tw("flex-1 text-right p-2 border-r font-semibold")}>TOTALES:</Text>
                <Text style={tw("w-[15%] p-2 border-r text-right")}>
                  {numberWithDecimals(totalDebitBs)}
                </Text>
                <Text style={tw("w-[15%] p-2 text-right")}>
                  {numberWithDecimals(totalAssetBs)}
                </Text>
                {/* <Text style={tw("w-[10%]")}>
                  {numberWithDecimals(totalDebitSus)}
                </Text>
                <Text style={tw("w-[10%]")}>
                  {numberWithDecimals(totalAssetSus)}
                </Text> */}
              </View>
              <View style={tw("text-sm")}>
                {/* DESCRIPCIÓN */}
                <View wrap={false} style={tw("w-full mt-1")}>
                  <Text style={tw("w-[20%] font-semibold")}>DESCRIPCIÓN:</Text>
                  <Text>{data?.gloss ?? "DESCRIPCIÓN"}</Text>
                </View>
                {/* LITERAL */}
                <View wrap={false} style={tw("w-full flex flex-row gap-1 border-b mb-1 pb-1")}>
                  <Text style={tw("font-semibold")}>SON: </Text>
                  <Text>{totalLiteral}</Text>
              </View>
              </View>
              <View wrap={false} style={tw("w-full flex flex-row gap-8 text-sm")}>
                <View style={tw("h-32 flex-1 flex")}>
                  <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                    <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>Elaborado:</Text>
                  </View>
                </View>
                <View style={tw("h-32 flex-1 flex")}>
                  <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                    <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>Revisado:</Text>
                  </View>
                </View>
                <View style={tw("h-32 flex-1 flex")}>
                  <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
                    {/* Aqui podria venir un text mas si se necesita */}
                    <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>Aprobado:</Text>
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
