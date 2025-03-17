/* eslint-disable jsx-a11y/alt-text */
"use client";
import { AccountData } from "@/app/dashboard/accounting/results/bigger-book/page";
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
import { REPORTS_LOGO_URL } from "@/lib/constants";

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
});

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
            <View>
              <Image
                style={styles.imageOutOfBounds}
                src={REPORTS_LOGO_URL}
              />
            </View>
            <Text
              style={[
                styles.titlePage,
                { fontFamily: "Helvetica-Bold", paddingTop: 20 },
              ]}
            >
              Libro Mayor
            </Text>
            <View style={[{ paddingBottom: 5 }]}>
              <Text
                style={[
                  styles.thCell,
                  { textAlign: "center", fontFamily: "Helvetica-Bold" },
                ]}
              >
                (Expresado en {moneyType})
              </Text>
              <Text style={[styles.thCell, { textAlign: "center" }]}>
                {dateText}
              </Text>
            </View>
            <View style={[{ paddingBottom: 10 }]}>
              <Text style={[styles.thCell]}>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>
                  Nro de Cuenta:
                </Text>{" "}
                {record.accountCode}
              </Text>
              <View style={styles.trCell}>
                <Text style={[styles.thCell]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    Nombre de Cuenta:
                  </Text>{" "}
                  {record.accountDescription}
                </Text>
                <Text style={[styles.thCell]}>
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
                  <View style={styles.trCell} key={item.accountId}>
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
                    { fontFamily: "Helvetica-Bold", textAlign: "right" },
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

            <View
              style={[
                styles.trCell,
                {
                  borderBottomWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                },
              ]}
            >
              <View style={styles.col25}></View>
              <View
                style={[
                  styles.thCell,
                  styles.col25,
                  {
                    paddingTop: "2cm",
                    alignItems: "center",
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text style={{ textAlign: "center" }}>CONTADOR</Text>
              </View>
              <View
                style={[
                  styles.thCell,
                  styles.col25,
                  {
                    paddingTop: "2cm",
                    alignItems: "center",
                    borderRightWidth: 1,
                  },
                ]}
              >
                <Text style={{ textAlign: "center" }}>GERENTE</Text>
              </View>
              <View style={styles.col25}></View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
