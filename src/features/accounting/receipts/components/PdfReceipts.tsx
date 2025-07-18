"use client";

import { Page, Text, View, Document, PDFViewer } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { numberToLiteral } from "@/lib/data";
import { ReactNode, useEffect, useState } from "react";
import { Receipt } from "../schemas/receiptSchema";

const tw = createTw({});

interface PdfReceiptProps {
  receipt: Receipt;
  trigger: ReactNode;
}

export default function PdfReceipt({receipt, trigger  }:PdfReceiptProps) {
  const [textoLiteral, setTextoLiteral] = useState<string>('');

  // Convertir numero a Texto Literal
  useEffect(() => {
    if (receipt?.amountBs) {
      const calcularTexto = async () => {
        const texto = await numberToLiteral(receipt.amountBs, false);
        setTextoLiteral(texto);
      };
      calcularTexto();
    }
  }, [receipt?.amountBs]);
  
  if (!receipt) {
    return <div>Error: Recibo no encontrado</div>;
  }
  //Convertir Fechas
  const date = new Date(receipt.createdAt);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("es-BO", { month: "long" }).format(date);
  const monthNum = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();


  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[730px] w-full flex items-center justify-center">
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>Recibo</DialogTitle>
            <DialogDescription>
              Muestra el comprobante de recibo
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>

        <PDFViewer showToolbar={true} className="h-full w-full">
          <Document>
            <Page size={{ width: 8.5 * 72, height: 6.5 * 72 }} style={tw("p-4 flex w-full text-sm text-blue-950 font-bold")}>
                <View>
                    <View style={tw("flex flex-row justify-between items-center")}>
                        <View>
                          <View style={tw("border border-blue-950 rounded-lg mt-2 flex flex-row overflow-hidden")}>
                              <View style={tw("")}>
                                <Text style={tw("bg-blue-950 text-sm text-gray-100 py-1.5 px-4")}>DIA</Text>
                                <Text style={tw(" py-1.5 text-base text-center w-[50px] border-r")}> {day} </Text>
                              </View>
                              <View style={tw("")}>
                                <Text style={tw("bg-blue-950 text-sm text-gray-100 py-1.5 px-4 text-center")}>MES</Text>
                                <Text style={tw(" py-1.5 text-base text-center w-[50px] border-r")}> {monthNum} </Text>
                              </View>
                              <View style={tw("")}>
                                <Text style={tw("bg-blue-950 text-sm text-gray-100 py-1.5 px-4")}>AÑO</Text>
                                <Text style={tw(" py-1.5 text-base text-center w-[50px]")}> {year} </Text>
                              </View>
                          </View>
                          <View style={tw("border border-blue-950 rounded-lg mt-2  flex flex-row overflow-hidden")}>
                            {/* <Text style={tw("text-xl font-normal leading-none font-bold py-2 px-4 bg-blue-950 text-white rounded-lg")}>N°</Text> */}
                            <Text style={tw("text-xl font-normal leading-none font-bold p-2")}>N° {receipt.num} </Text>
                          </View>
                        </View>
                        <Text style={tw("text-[35px] h-auto leading-none self-end")}>RECIBO</Text>
                        <View style={tw("")}>
                            <View style={tw("flex flex-row items-center justify-end gap-2")}>
                                <Text style={tw("text-xl leading-none bg-blue-950 text-gray-100 p-2.5 rounded-lg")}>Bs.</Text> 
                                <View style={tw("border-2 border-blue-950 rounded-lg min-w-[100px]  h-10 justify-center px-4")}>
                                    <Text style={tw("text-xl leading-none")}>
                                        {receipt.amountBs}
                                    </Text>
                                </View>
                            </View>
                            <View style={tw("flex flex-row items-center justify-end gap-2 mt-1")}>
                                <Text style={tw("text-xl leading-none bg-blue-950 text-gray-100 p-2.5 rounded-lg")}>$us.</Text> 
                                <View style={tw("border-2 border-blue-950 rounded-lg min-w-[100px]  h-10 justify-center px-4")}>
                                    <Text style={tw("text-xl leading-none")}>
                                        {receipt.amountSus}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* <View style={tw("border-t mt-8 border-blue-950")}></View> */}
                    <View style={{...tw("mt-8 text-lg"),lineHeight: 0,}}>
                        <View style={tw("flex flex-row gap-2")}>
                          <View style={tw("flex-1 flex flex-col justify-between gap-5 my-3 border border-gray-300 p-4 rounded-xl")}>
                              <Text>Recibi del Señor(a): </Text> 
                              <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800")}>
                                  {receipt.receiverName}
                              </Text>
                          </View>
                          <View style={tw(" flex-1 flex gap-5 my-3 border border-gray-300 p-4 rounded-xl")}>
                              <Text>La suma de: </Text> 
                              <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 text-sm")}>
                                  {textoLiteral || 'Cargando...'}
                              </Text>
                          </View>
                        </View>
                        {/* <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2")}> </Text>
                            <Text style={tw("mr-6")}>Bolivianos/Dolares</Text>
                        </View> */}
                        <View style={tw("border border-gray-300 p-4 rounded-xl")}>
                          <View style={tw("flex gap-5")}>
                              <Text>Por concepto de: </Text> 
                              <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800")}> 
                                  {receipt.concept} 
                              </Text>
                          </View>
                        </View>
                        <View style={tw("flex flex-row justify-around mt-28")}>
                            <View style={tw("w-[35%]")}>
                                <Text style={tw("border-b-2 border-dashed border-gray-300 w-full mb-1")}></Text>
                                <Text style={tw("text-center")}>PAGADOR</Text>
                            </View>
                            <View style={tw("w-[35%]")}>
                                <Text style={tw("border-b-2 border-dashed border-gray-300 w-full mb-1")}></Text>
                                <Text style={tw("text-center")}>RECIBI CONFORME</Text>
                            </View>
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