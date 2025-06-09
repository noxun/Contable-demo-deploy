/* eslint-disable jsx-a11y/alt-text */
import { COMPANY_MAIN_CITY, COMPANY_NIT, REPORTS_LOGO_URL } from "@/lib/constants";
import { numberWithDecimals } from "@/features/accounting/shared/utils/validate";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
  type: number;
  items: Array<{
    id: number;
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
    code: number;
    description: string;
    typeOfExpense: any;
    createdAt: string;
    voucherId: number;
    type: number;
  }>;
};

type AccountDetailsPdfProps = {
  data: AccountPDFData;
};

const tw = createTw({});

export default function AccountDetailsPdf({ data }: AccountDetailsPdfProps) {
  const totalDebitBs =
    data.items?.reduce((sum: number, item) => sum + item.debitBs, 0) ?? 0;
  // const totalDebitSus = data.items?.reduce(
  //   (sum: number, item) => sum + item.debitSus,
  //   0
  // );
  const totalAssetBs =
    data.items?.reduce((sum: number, item) => sum + item.assetBs, 0) ?? 0;
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
            <Image
              source={REPORTS_LOGO_URL}
              style={{ height: 57, width: 207 }}
            />
            <Text>NIT {COMPANY_NIT}</Text>
          </View>
        </View>
        {/* Fila Titulo */}
        {/* 0 -> traspaso 1-> egreso -> ingreso */}
        <View style={tw("w-full flex items-center")}>
          <Text>
            COMPROBANTE DE{" "}
            {data.type === 0
              ? "TRASPASO"
              : data.type === 1
              ? "EGRESO"
              : "INGRESO"}
          </Text>
          <Text>N° {data.num ?? "num"}</Text>
          <Text>Expresado en bolivianos</Text>
        </View>
        {/* Fila fecha */}
        <View style={tw("flex flex-row justify-between")}>
          <Text>
            {COMPANY_MAIN_CITY},{" "}
            {format(data.voucherDate ?? new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
          </Text>
          <Text>T/C: {data.exchangeRate}</Text>
        </View>
        {/* Header Tabla */}
        <View style={tw("w-full flex flex-row border")}>
          <Text style={tw("w-[20%] text-center border-r py-4")}>CODIGO</Text>
          <Text style={tw("flex-1 text-center border-r py-4")}>CUENTAS</Text>
          <Text style={tw("w-[10%] text-center border-r py-4")}>DEBE</Text>
          <Text style={tw("w-[10%] text-center border-r py-4")}>HABER</Text>
        </View>
        {/* Body tabla */}
        {(Array.isArray(data.items) ? data.items : []).map((item) => (
          <View key={item.id} style={tw("w-full flex flex-row border")}>
            <Text style={tw("w-[20%] border-r")}>{item.code}</Text>
            <Text style={tw("border-r flex-1")}>{item.description}</Text>
            <Text style={tw("w-[10%] border-r text-right")}>
              {numberWithDecimals(item.debitBs) ?? "-"}
            </Text>
            <Text style={tw("w-[10%] border-r text-right")}>
              {numberWithDecimals(item.assetBs) ?? "-"}
            </Text>
          </View>
        ))}
        {/* Espacio restante abajo de la tabla, abajo de los items */}
        <View style={tw("w-full flex flex-row border flex-1")}>
          <Text style={tw("w-[20%] border-r")}></Text>
          <Text style={tw("border-r flex-1")}></Text>
          <Text style={tw("w-[10%] border-r text-right")}></Text>
          <Text style={tw("w-[10%] border-r text-right")}></Text>
        </View>
        {/* Footer tabla */}
        <View style={tw("w-full flex flex-row")}>
          <Text style={tw("w-[20%]")}>DESCRIPCION:</Text>
          <Text style={tw("flex-1 text-right")}>TOTAL Bs.</Text>
          <Text style={tw("w-[10%]")}>{numberWithDecimals(totalDebitBs)}</Text>
          <Text style={tw("w-[10%]")}>{numberWithDecimals(totalAssetBs)}</Text>
        </View>
        {/* DESCRIPCION */}
        <View style={tw("w-full flex flex-row border-b")}>
          <Text>{data.gloss ?? "Descripción"}</Text>
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
  );
}
