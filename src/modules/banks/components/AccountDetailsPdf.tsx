/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

type AccountPDFData = {
  id: number;
  num: number;
  exchangeRate: number;
  voucherDate: string;
  coin: string;
  checkNum: any;
  canceledTo: any;
  gloss: string;
  bankId: number;
  items: Array<{
    id: number;
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
    CodeAccount: number;
    DescriptionAccount: string;
    typeOfExpense: any;
  }>;
};

type AccountDetailsPdfProps = {
  data: AccountPDFData;
};

const tw = createTw({});

export default function AccountDetailsPdf({ data }: AccountDetailsPdfProps) {

  // const totalDebitBs = data.items?.reduce(
  //   (sum: number, item) => sum + item.debitBs,
  //   0
  // );
  // const totalDebitSus = data.items?.reduce(
  //   (sum: number, item) => sum + item.debitSus,
  //   0
  // );
  // const totalAssetBs = data.items?.reduce(
  //   (sum: number, item) => sum + item.assetBs,
  //   0
  // );
  // const totalAssetSus = data.items?.reduce(
  //   (sum: number, item) => sum + item.assetSus,
  //   0
  // );

  return (
    <Document>
      <Page size="LETTER" style={tw("p-4 flex w-full text-sm")}>
        {/* Fila logo */}
        <View style={tw("w-[207px]")}>
          <View style={tw("flex items-center")}>
            <Image source="/images/tradecruz_logo.png" style={{height:57,width:207}} />
            <Text>NIT 3754820020</Text>
          </View>
        </View>
        {/* Fila Titulo */}
        <View style={tw("w-full flex items-center")}>
          <Text>COMPROBANTE DE {"INGRESO"}</Text>
          <Text>N° 000120-2023-01</Text>
          <Text>Expresado en bolivianos</Text>
        </View>
        {/* Fila fecha */}
        <View style={tw("flex flex-row justify-between")}>
          <Text>Santa Cruz, {"Fecha Actual"}</Text>
          <Text>T/C: 6.96</Text>
        </View>
        {/* Header Tabla */}
        <View style={tw("w-full flex flex-row border")}>
          <Text style={tw("w-[20%] text-center border-r py-4")}>CODIGO</Text>
          <Text style={tw("flex-1 text-center border-r py-4")}>CUENTAS</Text>
          <Text style={tw("w-[10%] text-center border-r py-4")}>DEBE</Text>
          <Text style={tw("w-[10%] text-center border-r py-4")}>HABER</Text>
        </View>
        {/* Body tabla */}
        <View style={tw("w-full flex flex-row border flex-1")}>
          <Text style={tw("w-[20%] border-r")}>11020101</Text>
          <Text style={tw("border-r flex-1")}>CLIENTE POR COBRAR</Text>
          <Text style={tw("w-[10%] border-r text-right")}>1,326.00</Text>
          <Text style={tw("w-[10%] border-r text-right")}>-</Text>
        </View>
        {/* Footer tabla */}
        <View style={tw("w-full flex flex-row")}>
          <View style={tw("flex flex-row")}>
            <Text>DESCRIPCION:</Text>
            <Text>TOTAL Bs.</Text>
            <Text>1,3675.78</Text>
            <Text>1,3675.78</Text>
          </View>
          <Text></Text>
          <Text>AUDIFONOS SRL</Text>
        </View>
        <View>
          <View></View>
          <View></View>
          <View></View>
        </View>
      </Page>
    </Document>
  );
}
