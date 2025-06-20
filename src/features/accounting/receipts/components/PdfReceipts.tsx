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
  const year = date.getFullYear();


  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[600px] w-full flex items-center justify-center">
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
            <Page size="LETTER" style={tw("p-4 flex w-full text-sm text-blue-950 font-bold")}>
                <View>
                    <View style={tw("flex flex-row justify-between items-center")}>
                        <Text style={tw("text-red-600 text-xl font-normal leading-none")}>N° {receipt.num} </Text>
                        <Text style={tw("text-[35px] h-auto leading-none")}>RECIBO</Text>
                        <View style={tw("")}>
                            <View style={tw("flex flex-row items-center justify-end gap-2")}>
                                <Text style={tw("text-xl leading-none")}>Bs.</Text> 
                                <View style={tw("bg-gray-200 border-2 border-blue-950 rounded-lg mt-1 min-w-[130px]  h-10 justify-center px-4")}>
                                    <Text style={tw("text-xl leading-none")}>
                                        {receipt.amountBs}
                                    </Text>
                                </View>
                            </View>
                            <View style={tw("flex flex-row items-center justify-end gap-2")}>
                                <Text style={tw("text-xl leading-none")}>$us.</Text> 
                                <View style={tw("bg-gray-200 border-2 border-blue-950 rounded-lg mt-1 min-w-[130px]  h-10 justify-center px-4")}>
                                    <Text style={tw("text-xl leading-none")}>
                                        {receipt.amountSus}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={tw("mt-8")}>
                        <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text>Recibi del Señor(a): </Text> 
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2")}>
                                {receipt.receiverName}
                            </Text>
                        </View>
                        <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text>La suma de: </Text> 
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2 ")}>
                                {textoLiteral || 'Cargando...'}
                            </Text>
                        </View>
                        {/* <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2")}> </Text>
                            <Text style={tw("mr-6")}>Bolivianos/Dolares</Text>
                        </View> */}
                        <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text>Por concepto de: </Text> 
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2")}> 
                                {receipt.concept} 
                            </Text>
                        </View>
                        {/* <View style={tw("flex flex-row gap-5 my-2.5")}>
                            <Text style={tw("border-b-2 border-dashed border-gray-300 w-full font-normal text-gray-800 px-2")}>.</Text>
                        </View> */}
                        <View style={tw("flex flex-row justify-end my-2.5")}>
                            <View style={tw("flex flex-row gap-3 w-[80%]")}>
                                <Text style={tw("border-b-2 border-dashed border-gray-300 w-full text-center font-normal")}> 
                                  {day} 
                                </Text>
                                <Text>de</Text>
                                <Text style={tw("border-b-2 border-dashed border-gray-300 w-full text-center font-normal")}> 
                                  {month} 
                                </Text>  
                                <Text>de</Text>
                                <Text style={tw("border-b-2 border-dashed border-gray-300 w-full text-center font-normal")}> 
                                  {year} 
                                </Text>
                            </View>
                        </View>
                        <View style={tw("flex flex-row justify-around mt-14")}>
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