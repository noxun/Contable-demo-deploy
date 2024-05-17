"use client"
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
    },
  },
});

export default function PdfPage({ params }: { params: { id: string }}) {

  const token = localStorage.getItem("token");
  const {id} = params;

  const getSingleIncomeQuery = useQuery({
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
  })

  if (getSingleIncomeQuery.isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  const { items } = getSingleIncomeQuery.data;

  const totalDebitBs = items.reduce((sum, item) => sum + item.debitBs, 0);
  const totalDebitSus = items.reduce((sum, item) => sum + item.debitSus, 0);
  const totalAssetBs = items.reduce((sum, item) => sum + item.assetBs, 0);
  const totalAssetSus = items.reduce((sum, item) => sum + item.assetSus, 0);

  return (
    <PDFViewer showToolbar={true} className="h-full">
      <Document>
        <Page wrap={true} size="A4" style={tw("p-4 flex gap-8")}>
          <View style={tw("flex justify-center items-start")}>
            <View style={tw("flex flex-col items-center justify-center")}>
              <Text>NOXUN</Text>
              <Text>Gestion {new Date().getFullYear()}</Text>
            </View>
          </View>
          <View style={tw("flex flex-col items-center justify-center")}>
              <Text>COMPROBANTE DE EGRESO N (Numero Aca)</Text>
              <Text>(Expresado en Bs)</Text>
          </View>
          <View>
            <Text>Fecha: {getSingleIncomeQuery?.data?.canceledTo}</Text>
            <Text>Section #1 {getSingleIncomeQuery?.data?.gloss}</Text>
            <Text>Section #2</Text>
          </View>
          <View style={tw("mt-4")}>
            <Text style={tw("font-bold mb-2")}>Items:</Text>
            <View style={tw("flex flex-col border border-gray-500")}>
              <View style={tw("flex flex-row border-b border-gray-500 bg-gray-200")}>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>ID</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Debit Bs</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Debit Sus</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Asset Bs</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Asset Sus</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Gloss</Text>
                <Text style={tw("flex-1 p-2")}>Account ID</Text>
              </View>
              {items.map((item) => (
                <View key={item.id} style={tw("flex flex-row border-b border-gray-500")}>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.id}</Text>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.debitBs}</Text>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.debitSus.toFixed(2)}</Text>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.assetBs}</Text>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.assetSus.toFixed(2)}</Text>
                  <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{item.gloss}</Text>
                  <Text style={tw("flex-1 p-2")}>{item.accountId}</Text>
                </View>
              ))}
              <View style={tw("flex flex-row bg-gray-200")}>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>Total</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{totalDebitBs}</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{totalDebitSus.toFixed(2)}</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{totalAssetBs}</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}>{totalAssetSus.toFixed(2)}</Text>
                <Text style={tw("flex-1 p-2 border-r border-gray-500")}></Text>
                <Text style={tw("flex-1 p-2")}></Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
