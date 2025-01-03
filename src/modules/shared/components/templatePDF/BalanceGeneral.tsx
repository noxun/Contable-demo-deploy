/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatNumber } from "../../utils/validate";

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
  },
  pageNumber: {
    position: "absolute",
    top: 30,
    right: 30,
    fontSize: 10,
  },
  header: {
    display: "flex",
    gap: 2,
    textAlign: "center"
  },
  table: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    width: "100%",
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 10,
    padding: 4,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  trEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col65: { width: "65%" },
  col70: { width: "70%" },
  col80: { width: "80%" },
  imageOutOfBounds: {
    position: 'absolute',
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: 'cover',
  },
});

interface Records {
  totalAsset: number;
  totalLiability: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  asset: Item[];
  liability: Item[];
  equity: Item[];
}

interface Item {
  account: string;
  description: string;
  amount: number;
  amountSus: number;
}

interface DateRange {
  from: string;
  to: string;
}

interface Props {
  inSus?: boolean;
  records: Records;
  dateRange: DateRange;
}


export const BalanceGeneralTemplate = ({ records, inSus = false, dateRange }: Props) => {
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const messageDate =
    dateRange.from === dateRange.to
      ? dateRange.from
      : `${dateRange.from} al ${dateRange.to}`;

  const totalActivo = inSus ? 'amountSus' : 'amount';
  let sumTotalActivo = 0;
  let sumTotalPasivo = 0;
  let sumTotalPatrimonio = 0;

  return (
    <Document >
      <Page size={"LETTER"} orientation="landscape" style={styles.page}>
        <View>
          <Image
            style={styles.imageOutOfBounds}
            src="/images/tradecruz_logo.png"
          />
        </View>

        <View style={[styles.header, { paddingBottom: 10 }]}>
          <Text style={[styles.thCell, { fontSize: 20, }]}>Balance General</Text>
          <Text style={[styles.thCell]}>{messageDate}</Text>
          <Text style={[styles.thCell]}>(Expresado en {moneyType})</Text>
        </View>

        <View style={styles.table}>
          <View style={[{ width: "100%" }]} >
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Activo</Text>
              <Text style={[styles.thCell, styles.col20]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                records.asset.map((entry, index) => {
                  sumTotalActivo += Number(entry[totalActivo]);
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.description}</Text>
                      <Text style={[styles.tdCell, styles.col20]}>{formatNumber(entry[totalActivo])}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View style={[{ width: "100%", paddingBottom: 20 }]}>
            <View>
              <View style={[styles.trCell]}>
                <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
                <Text style={[styles.thCell, styles.col60]}>Pasivo</Text>
                <Text style={[styles.thCell, styles.col20]}>Monto</Text>
              </View>
              <View style={{ textAlign: "left" }}>
                {
                  records.liability.map((entry, index) => {
                    sumTotalPasivo += Number(entry[totalActivo]);
                    return (
                      <View style={styles.trCell} key={index}>
                        <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                        <Text style={[styles.tdCell, styles.col60]}>{entry.description}</Text>
                        <Text style={[styles.tdCell, styles.col20]}>{formatNumber(entry[totalActivo])}</Text>
                      </View>
                    )
                  })
                }
                <View style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
                  <Text style={[styles.tdCell, styles.col20,]} />
                  <Text style={[styles.tdCell, styles.col60]}>Total Pasivo</Text>
                  <Text style={[styles.tdCell, styles.col20]}>{formatNumber(sumTotalPasivo)}</Text>
                </View>
              </View>

            </View>

            <View style={{ paddingTop: 20 }}>
              <View style={[styles.trCell]}>
                <Text style={[styles.thCell, styles.col20]}></Text>
                <Text style={[styles.thCell, styles.col80]}>Patrimonio Neto</Text>
              </View>
              <View style={{ textAlign: "left" }}>
                {
                  records.equity.map((entry, index) => {
                    sumTotalPatrimonio += Number(entry[totalActivo]);
                    return (
                      <View style={styles.trCell} key={index}>
                        <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                        <Text style={[styles.tdCell, styles.col60]}>{entry.description}</Text>
                        <Text style={[styles.tdCell, styles.col20]}>{formatNumber(entry[totalActivo])}</Text>
                      </View>
                    )
                  })
                }
                <View style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
                  <Text style={[styles.tdCell, styles.col20,]} />
                  <Text style={[styles.tdCell, styles.col60]}>Total Patrimonio Neto</Text>
                  <Text style={[styles.tdCell, styles.col20]}>{formatNumber(sumTotalPatrimonio)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.trCell, styles.table]}>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Activo</Text>
            <Text style={[styles.thCell, styles.col20]}>{formatNumber(sumTotalActivo)}</Text>
          </View>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Pasivo y Patrimonio Neto</Text>
            <Text style={[styles.thCell, styles.col20]}>
              {formatNumber((Number(sumTotalPatrimonio) + Number(sumTotalPatrimonio)))}
            </Text>
          </View>
        </View>

        <View style={[styles.trCell]}>
          <View style={[styles.thCell, styles.col50, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>___________________________</Text>
            <Text style={{ textAlign: "center" }}>CONTADOR</Text>
          </View>
          <View style={[styles.thCell, styles.col50, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>___________________________</Text>
            <Text style={{ textAlign: "center" }}>GERENTE</Text>
          </View>
        </View>

      </Page >
    </Document >
  )
}