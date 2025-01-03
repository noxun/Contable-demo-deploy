/* eslint-disable jsx-a11y/alt-text */
"use client"
import { AccountData } from "@/app/dashboard/results/bigger-book/page";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatNumber } from "../../utils/validate";

interface BiggerBookTemplateProps {
  dateRange?: DateRange;
  inSus: boolean;
  records: AccountData[]
};

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
    fontFamily: 'Helvetica'
  },
  titlePage: {
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 5
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 11,
    fontWeight: "bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 10,
    padding: 5,
  },
  col10: {
    width: "10%"
  },
  col15: {
    width: "15%"
  },
  col20: {
    width: "20%"
  },
  col25: {
    width: "25%"
  },
  col30: {
    width: "30%"
  },
  col55: {
    width: "55%"
  },
  col65: {
    width: "65%"
  },
  col70: {
    width: "70%"
  },
  col85: {
    width: "85%"
  },
  imageOutOfBounds: {
    position: 'absolute',
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: 'cover',
  },
});

export const BiggerBookTemplate: React.FC<BiggerBookTemplateProps> = ({ dateRange, inSus = false, records }) => {
  // console.log('los records son: ', records)
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy HH:mm:ss';
  const debitType = inSus ? "debitSus" : "debitBs";
  const assetType = inSus ? "assetSus" : "assetBs";
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const saldoType = inSus ? "totalSaldoSus" : "totalSaldoBs";
  const saldoTextType = inSus ? "totalSaldoTextSus" : "totalSaldoText";

  return (
    <Document>
      {
        records.map((record, index) => {
          let saldo = 0;
          let totalDebit = 0;
          let totalAsset = 0;
          return (
            <Page key={index} size={"LETTER"} style={styles.page} wrap>
              <View>
                <Image
                  style={styles.imageOutOfBounds}
                  src="/images/tradecruz_logo.png"
                />
              </View>
              <Text style={[styles.titlePage, { fontFamily: "Helvetica-Bold", paddingTop: 20 }]}>
                Libro Mayor
              </Text>
              <View style={[{ paddingBottom: 5 }]}>
                <Text style={[styles.thCell, { textAlign: "center", fontFamily: "Helvetica-Bold" }]}>(Expresado en {moneyType})</Text>
                <Text style={[styles.thCell, { textAlign: "center" }]}>Fecha y Hora: {format(Date.now(), FORMAT_DATE_INITIAL)}</Text>
              </View>
              <View style={[{ paddingBottom: 10 }]}>
                <Text style={[styles.thCell]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Nro de Cuenta:</Text> {record.accountCode}
                </Text>
                <Text style={[styles.thCell]}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Nombre de Cuenta:</Text> {record.accountDescription}
                </Text>
              </View>
              <View style={{ width: "100%", border: 1 }}>
                <View style={[styles.trCell, { borderBottomWidth: 1 }]}>
                  <Text style={[styles.col10, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>ASIENTO</Text>
                  <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>FECHA</Text>
                  <Text style={[styles.col30, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>GLOSA</Text>
                  <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold", textAlign: "center" }]}>DEBE</Text>
                  <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold", textAlign: "center" }]}>HABER</Text>
                  <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold", textAlign: "center" }]}>SALDO</Text>
                </View>
                {
                  record.voucherItems.map((item, index) => {
                    saldo = Number(item[saldoType])
                    totalDebit += Number(item[debitType])
                    totalAsset += Number(item[assetType])

                    return (
                      <View style={styles.trCell} key={item.accountId}>
                        <Text style={[styles.col10, styles.tdCell]}>{item?.typeDes ?? index}</Text>
                        <Text style={[styles.col15, styles.tdCell]}>{format(item.createdAt, "dd/MM/yyyy")}</Text>
                        <Text style={[styles.col30, styles.tdCell]}>{item.gloss}</Text>
                        <Text style={[styles.col15, styles.tdCell, { textAlign: "right" }]}>{formatNumber(item[debitType])}</Text>
                        <Text style={[styles.col15, styles.tdCell, { textAlign: "right" }]}>{formatNumber(item[assetType])}</Text>
                        <Text style={[styles.col15, styles.tdCell, { textAlign: "right" }]}>{formatNumber((item[saldoType]))}</Text>
                      </View>
                    )
                  })
                }
                <View style={[styles.trCell, { borderTopWidth: 1 }]}>
                  <Text style={[styles.thCell, styles.col55, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
                  <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold", textAlign: "right" }]}>{formatNumber(totalDebit)}</Text>
                  <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold", textAlign: "right" }]}>{formatNumber(totalAsset)}</Text>
                  <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold", textAlign: "right" }]}>{formatNumber((saldo))}</Text>
                </View>
                <View style={[styles.trCell, { borderTopWidth: 1 }]}>
                  <Text style={[styles.tdCell, { fontFamily: 'Helvetica-Bold' }]} >SALDO {record[saldoTextType]}</Text>
                </View>
              </View>

              <View style={[styles.trCell, { borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }]}>
                <View style={styles.col25}></View>
                <View style={[styles.thCell, styles.col25, { paddingTop: '2cm', alignItems: "center", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                  <Text style={{ textAlign: "center" }}>CONTADOR</Text>
                </View>
                <View style={[styles.thCell, styles.col25, { paddingTop: '2cm', alignItems: "center", borderRightWidth: 1 }]}>
                  <Text style={{ textAlign: "center" }}>GERENTE</Text>
                </View>
                <View style={styles.col25}></View>
              </View>

            </Page>
          )
        })
      }
    </Document >
  )
}