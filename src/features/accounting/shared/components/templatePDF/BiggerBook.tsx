/* eslint-disable jsx-a11y/alt-text */
"use client";
import { AccountData } from "@/features/accounting/bigger-book/types/index";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatNumber } from "../../utils/validate";
import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_NIT, REPORTS_LOGO_URL } from "@/lib/constants";
import { createTw } from "react-pdf-tailwind";

type BiggerBookTemplateProps = {
  dateRange?: DateRange;
  inSus: boolean;
  records: AccountData[];
};

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
    fontFamily: "Helvetica",
  },
  titlePage: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 5,
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 9,
    padding: 5,
  },
  col10: {
    width: "10%",
  },
  col11: {
    width: "11%",
  },
  col13: {
    width: "13%",
  },
  col15: {
    width: "15%",
  },
  col20: {
    width: "20%",
  },
  col25: {
    width: "25%",
  },
  col30: {
    width: "30%",
  },
  col55: {
    width: "55%",
  },
  col65: {
    width: "65%",
  },
  col70: {
    width: "70%",
  },
  col85: {
    width: "85%",
  },
  col61: {
    width: "61%",
  },
  imageOutOfBounds: {
    position: "absolute",
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: "cover",
  },
  zebra: {
    backgroundColor: '#f8f8f8',
  },
});

const tw = createTw({})

export function BiggerBookTemplate({
  dateRange,
  inSus = false,
  records,
}: BiggerBookTemplateProps) {
  // console.log('los records son: ', records)
  const FORMAT_DATE_INITIAL = "dd/MM/yyyy";
  const debitType = inSus ? "debitSus" : "debitBs";
  const assetType = inSus ? "assetSus" : "assetBs";
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const saldoType = inSus ? "totalSaldoSus" : "totalSaldoBs";
  const saldoTextType = inSus ? "totalSaldoTextSus" : "totalSaldoText";


  const tDebitKey = inSus ? "totalDebitSus" : "totalDebit"
  const tAssetKey = inSus ? "totalAssetSus" : "totalAsset"
  const tSaldoKey = inSus ? "totalSaldoNumSus" : "totalSaldoNum"
  const tPreviousBalanceKey = inSus ? "previousBalanceSus" : "previousBalance"

  // Fechas y hora
  const now = new Date();
  const gestion = now.getFullYear();
  const mesLiteral = now.toLocaleString("es-BO", { month: "long" });
  const fecha = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const hora = now.toLocaleTimeString("es-BO");

  const dateText =
    dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);

  return (
    <Document>
      {records.map((record) => {
        return (
          <Page key={record.accountCode} size={"LETTER"} style={styles.page} wrap>

            {/* PAGINADO */}
            <View fixed render={({ pageNumber, totalPages }:any) => (
                <View style={{
                    fontSize: '8px',
                    color: '#2f2f2f',
                    width: '100%',
                    textAlign: 'right',
                    paddingBottom: 4,
                    borderBottom: pageNumber !== 1 ? '1px solid black' : undefined,
                  }}
                >
                  <Text> Página: {pageNumber} / {totalPages} </Text>
                </View>
              )}
            />

            <View style={tw("w-full flex flex-row justify-between mb-8 text-sm")}>
              <View style={tw("flex-1")}>
                <Image
                  source={REPORTS_LOGO_URL}
                  style={{ height: 40, width: 120 }}
                />
                <Text style={tw("font-semibold text-gray-700 mt-2")}>{COMPANY_NAME} </Text>
                <Text style={tw("text-gray-700 mb-1")}>NIT {COMPANY_NIT}</Text>
                <Text style={tw("text-gray-700 w-[170px] text-xs")}>{COMPANY_ADDRESS} </Text>
              </View>
              <View style={tw(" flex-1 w-full flex items-center self-end")}>
                <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", paddingBottom: 5}}>Libro Mayor</Text>
                <Text style={[{fontSize:10,paddingTop:2, fontFamily: "Helvetica", fontWeight:'normal', color:"#232323"}]}>(Expresado en {moneyType})</Text>
                <Text style={[{fontSize:9,paddingTop:1, textAlign: "center", fontWeight:"normal" }]}>{dateText}</Text>
              </View>
              <View style={tw("flex-1 flex flex-col items-end pt-4 text-xs")}>
                <View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Gestion </Text>  <Text style={tw("text-gray-800")}> {gestion} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Mes </Text>  <Text style={tw("text-gray-800")}> {mesLiteral} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Fecha: </Text>  <Text style={tw("text-gray-800")}> {fecha} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Hora: </Text>  <Text style={tw("text-gray-800")}> {hora} </Text>  </View>
                </View>
              </View>
            </View>

            <View style={[{ paddingBottom: 5 }]}>
              <Text style={[{fontSize:9, fontWeight:"normal"}]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  Nro de Cuenta:
                </Text>{" "}
                {record.accountCode}
              </Text>
              <View style={styles.trCell}>
                <Text style={[{fontSize:9, fontWeight:"normal"}]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    Nombre de Cuenta:
                  </Text>{" "}
                  {record.accountDescription}
                </Text>
                <Text style={[{fontSize:9, fontWeight:"normal"}]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    Balance Previo:
                  </Text>{" "}
                  {record[tPreviousBalanceKey]}
                </Text>
              </View>
            </View>
            <View style={{ width: "100%", borderWidth: 1 }}>
              <View style={[styles.trCell, { borderBottomWidth: 1 }]}>
                <Text
                  style={[
                    styles.col10,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  ASIENTO
                </Text>
                <Text
                  style={[
                    styles.col11,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  FECHA
                </Text>
                <Text
                  style={[
                    styles.col25,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  GLOSA
                </Text>
                <Text
                  style={[
                    styles.col15,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  HOJA DE RUTA
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "center" },
                  ]}
                >
                  DEBE
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "center" },
                  ]}
                >
                  HABER
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.thCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "center" },
                  ]}
                >
                  SALDO
                </Text>
              </View>
              {record.voucherItems.map((item, index) => {
                return (
                  <View wrap={false} style={[styles.trCell,{flexGrow:1, paddingVertical:4}, index % 2 === 0 ? {} : styles.zebra]} key={item.accountId}>
                    <Text style={[styles.col10, styles.tdCell]}>
                      {item?.typeDes ?? index}
                    </Text>
                    <Text style={[styles.col11, styles.tdCell]}>
                      {format(item.createdAt, "dd/MM/yyyy")}
                    </Text>
                    <Text style={[styles.col25, styles.tdCell]}>
                      {item.gloss}
                    </Text>
                    <Text style={[styles.col15, styles.tdCell]}>
                      {item.hojaDeRuta ?? " "}
                    </Text>
                    <Text
                      style={[
                        styles.col13,
                        styles.tdCell,
                        { textAlign: "right" },
                      ]}
                    >
                      {formatNumber(item[debitType])}
                    </Text>
                    <Text
                      style={[
                        styles.col13,
                        styles.tdCell,
                        { textAlign: "right" },
                      ]}
                    >
                      {formatNumber(item[assetType])}
                    </Text>
                    <Text
                      style={[
                        styles.col13,
                        styles.tdCell,
                        { textAlign: "right" },
                      ]}
                    >
                      {formatNumber(item[saldoType])}
                    </Text>
                  </View>
                );
              })}
              <View style={[styles.trCell, { borderTopWidth: 1 }]}>
                <Text
                  style={[
                    styles.thCell,
                    styles.col61,
                    { fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.tdCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "right"},
                  ]}
                >
                  {formatNumber(record[tDebitKey])}
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.tdCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "right" },
                  ]}
                >
                  {formatNumber(record[tAssetKey])}
                </Text>
                <Text
                  style={[
                    styles.col13,
                    styles.tdCell,
                    { fontFamily: "Helvetica-Bold", textAlign: "right" },
                  ]}
                >
                  {formatNumber(record[tSaldoKey])}
                </Text>
              </View>
              <View style={[styles.trCell, { borderTopWidth: 1 }]}>
                <Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>
                  SALDO {record[saldoTextType]}
                </Text>
              </View>
            </View>

           <View wrap={false} style={tw("w-full flex flex-row gap-8 text-sm mt-2")}>
              <View style={tw("h-36 flex-1 flex")}>
                <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
                  {/* Aqui podria venir un text mas si se necesita */}
                  <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>CONTADOR</Text>
                </View>
              </View>
              <View style={tw("h-36 flex-1 flex")}>
                <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
                  {/* Aqui podria venir un text mas si se necesita */}
                  <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>GERENTE</Text>
                </View>
              </View>
            </View>
            {/*Border bottom */}
            <View fixed render={({ pageNumber, totalPages }: any) =>
              pageNumber !== totalPages ? (
                <View style={{width: '100%',height: 1,marginTop: 'auto',borderTop: '1px solid black',}}/>
              ) : null}
            />
          </Page>
        );
      })}
    </Document>
  );
}
