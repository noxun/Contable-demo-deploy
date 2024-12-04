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
import { Voucher, VoucherType, VoucherItem } from "../types/sharedTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

  

  


  console.log("mi fila data ",data)
  console.log("mi fila ",items)
  console.log("mi type ",type)
  // console.log("mi respuesta ",getNumberLiteral.data)

  return (
    <PdfVoucherRender data={data} items={items} type={type} />
  );
}



const PdfVoucherRender = ({data, items, type}: any) => {

  const token = localStorage.getItem("token");

  const totalDebitBs = items?.reduce(
    (sum: number, item: VoucherItem) => sum + (item.debitBs ?? 0),
    0
  ) ?? 0;
  const totalDebitSus = items?.reduce(
    (sum: number, item: VoucherItem) => sum + item.debitSus,
    0
  ) ?? 0;
  const totalAssetBs = items?.reduce(
    (sum: number, item: VoucherItem) => sum + (item.assetBs ?? 0),
    0
  ) ?? 0;
  const totalAssetSus = items?.reduce(
    (sum: number, item: VoucherItem) => sum + item.assetSus,
    0
  );

  const getNumberLiteral = useQuery({
    queryKey: ["NumberToLiteral", totalDebitBs],
    queryFn: async function (): Promise<string> {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/NumberToLiteral/${totalDebitBs}`,
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

  console.log("mi  numero num ", totalDebitBs)
  console.log("mi  numero ", getNumberLiteral.data)

  return (
    <Dialog>
      <DialogTrigger>Ver Reporte</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[600px] w-full flex items-center justify-center">
        <PDFViewer showToolbar={true} className="h-full w-full">
          <Document>
            <Page size="A4" style={tw("p-4 flex flex-col h-full text-base")}>
              {/* <Page wrap={true} size="A4" style={tw("p-4 flex gap-8")}> */}
              <View
                style={tw(
                  "m-0 p-4 grid grid-rows-[auto_auto_auto_1fr_auto] h-full"
                )}
              >
                <View style={tw("absolute top-[65px]")}>
                    <Image
                      src="/images/logo-jetstar.png"
                      style={tw("p-1 w-[100px]")}
                    />
                  </View>
                <View style={tw("")}>
                    <View style={tw("flex flex-row justify-between")}>
                        <Text>EMPRESA JETSTAR CARGO LOGISTICS S.R.L.</Text>
                        <Text>Página:1</Text>
                    </View>
                    <Text>LA PAZ - BOLIVIA</Text>
                </View>

                <View style={tw("mt-10")}>
                  <Text style={{...tw("text-center text-xl font-bold"), fontFamily: 'Helvetica-Bold'}}>COMPROBANTE DE {type==="0"? "TRASPASO": type==="1"?"EGRESO":"INGRESO"}</Text>
                </View>

                <View style={tw("mt-5 flex flex-row")}>
                  <View style={tw("w-[70%]")}>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[90px]"), fontFamily: 'Helvetica-Bold'}}>Nro. Doc.:</Text>
                      <Text>{data?.num}</Text>
                    </View>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[90px]"), fontFamily: 'Helvetica-Bold'}}>Razon Social:</Text>
                      <Text>{data?.checkNum}</Text>
                    </View>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[90px]"), fontFamily: 'Helvetica-Bold'}}>Glosa:</Text>
                      <Text>{data?.gloss}</Text>
                    </View>
                  </View>
                  <View style={tw("w-[30%]")}>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[70px]"), fontFamily: 'Helvetica-Bold'}}>Fecha:</Text>
                      <Text>{format(data?.voucherDate!,"dd/MM/yyyy")}</Text>
                      </View>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[70px]"), fontFamily: 'Helvetica-Bold'}}>T.C.:</Text>
                      <Text>{data?.exchangeRate}</Text>
                    </View>
                    <View style={tw("flex flex-row")}>
                      <Text style={{...tw("w-[70px]"), fontFamily: 'Helvetica-Bold'}}>Cheque N°:</Text>
                      <Text>{data?.checkNum}</Text>
                    </View>
                  </View>
                </View>

                <View style={tw("mt-4")}>
                  <View
                    style={tw("flex flex-col border border-gray-500")}
                  >
                    <View
                      style={{...tw("flex flex-row border-b text-xs border-gray-500 bg-gray-200"), fontFamily: 'Helvetica-Bold'}}
                    >
                      <Text
                        style={tw(
                          "w-[15%] p-1 border-r border-gray-500 text-center"
                        )}
                      >
                        CUENTA
                      </Text>
                      <Text
                        style={tw(
                          "w-[35%] p-1 border-r border-gray-500"
                        )}
                      >
                        NOMBRE DE CUENTA
                      </Text>
                      <Text
                        style={tw(
                          "w-[12%] p-1 border-r border-gray-500 text-center"
                        )}
                      >
                        DEBE Bs.
                      </Text>
                      <Text
                        style={tw(
                          "w-[13%] p-1 border-r border-gray-500 text-center"
                        )}
                      >
                        HABER Bs.
                      </Text>
                      <Text
                        style={tw(
                          "w-[12%] p-1 border-r border-gray-500 text-center"
                        )}
                      >
                        DEBE $us
                      </Text>
                      <Text
                        style={tw(
                          "w-[13%] p-1 border-r border-gray-500 text-center"
                        )}
                      >
                        HABER $us
                      </Text>
                      {/* <Text style={tw("w-2/12 p-2 text-center")}>
                        ID CUENTA
                      </Text> */}
                    </View>
                    <View style={tw("flex flex-col")}>
                      {items?.map((item: VoucherItem) => (
                        <View
                          key={item.id}
                          style={tw("flex flex-row text-xs  border-gray-500")}
                        >
                          <Text
                            style={tw(
                              "w-[15%] p-1 border-r border-gray-500 text-center"
                            )}
                          >
                            {item.code}
                          </Text>
                          <Text
                            style={tw(
                              "w-[35%] p-1 border-r border-gray-500 text-center"
                            )}
                          >
                            {item.description}
                          </Text>
                          <Text
                            style={tw(
                              "w-[12%] p-1 border-r border-gray-500 text-right"
                            )}
                          >
                            {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.debitBs ?? 0)}
                          </Text>
                          <Text
                            style={tw(
                              "w-[13%] p-1 border-r border-gray-500 text-right"
                            )}
                          >
                            {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.assetBs ?? 0)}
                          </Text>
                          <Text
                            style={tw(
                              "w-[12%] p-1 border-r border-gray-500 text-right"
                            )}
                          >
                            {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.debitSus)}
                          </Text>
                          <Text
                            style={tw(
                              "w-[13%] p-1 border-r border-gray-500 text-right"
                            )}
                          >
                            {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.assetSus)}
                          </Text>
                          {/* <Text style={tw("w-2/12 p-2 text-center")}>
                            {item.accountId}
                          </Text> */}
                        </View>
                      ))}
                    </View>
                    <View
                      style={tw(
                        "flex flex-row border-t text-sm border-gray-500 bg-gray-200"
                      )}
                    >
                      <Text
                        style={tw(
                          "w-[50%] p-1 border-r border-gray-500 text-right"
                        )}
                      >
                        Total:
                      </Text>
                      {/* <Text style={tw("w-1/12 p-1 border-r border-gray-500")}></Text> */}
                      <Text
                        style={tw(
                          "w-[12%] p-1 border-r border-gray-500 text-right"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalDebitBs?.toFixed(2))}
                      </Text>
                      <Text
                        style={tw(
                          "w-[13%] p-1 border-r border-gray-500 text-right"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalAssetBs?.toFixed(2))}
                      </Text>
                      <Text
                        style={tw(
                          "w-[12%] p-1 border-r border-gray-500 text-right"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalDebitSus?.toFixed(2))}
                      </Text>
                      <Text
                        style={tw(
                          "w-[13%] p-1 border-r border-gray-500 text-right"
                        )}
                      >
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalAssetSus?.toFixed(2))}
                      </Text>
                      {/* <Text style={tw("w-2/12 p-2")}></Text> */}
                    </View>
                  </View>
                </View>
                <View style={tw("border-l border-r border-b")}>
                  <View style={tw("w-full text-sm p-2 border-b")}>
                    <Text>Son: {getNumberLiteral.data}</Text>
                  </View>
                  <View style={tw("flex flex-row ")}>
                    <View
                      style={tw(
                        "text-center border-r border-gray-500  h-32 w-[25%] flex flex-col justify-end px-4 pb-2"
                      )}
                    >
                      <Text></Text>
                    </View>
                    <View
                      style={tw(
                        "text-center border-r border-gray-500  h-32 w-[25%] flex flex-col justify-end px-4 pb-2"
                      )}
                    >
                      <Text>CONTADOR</Text>
                    </View>
                    <View
                      style={tw(
                        "text-center border-r border-gray-500  h-32 w-[25%] flex flex-col justify-end px-4 pb-2"
                      )}
                    >
                      <Text>GERENTE</Text>
                    </View>
                    <View
                      style={tw(
                        "border-gray-500  h-32 w-[25%] flex flex-col justify-end px-2 pb-2"
                      )}
                    >
                      {
                        type==="1"
                        ? (<>
                            <Text>Firma:........................</Text>
                            <Text>Nombre:.....................</Text>
                            <Text>C.I.:.............................</Text>
                        </>)
                        : ""
                      }
                      
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </DialogContent>
    </Dialog>
  )
}
