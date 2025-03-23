/* eslint-disable jsx-a11y/alt-text */
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { FinancialRatiosData } from "@/modules/results/types/types";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
  },
  pageNumber: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 10,
  },
  header: {
    display: "flex",
    marginTop: 60,
    gap: 2,
    textAlign: "center"
  },
  table: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    width: "100%"
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 10,
    padding: 3,
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
  col10: { width: "10%" },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col30: { width: "30%" },
  col40: { width: "40%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col65: { width: "65%" },
  col70: { width: "70%" },
  col80: { width: "80%" },
  col100: { width: "100%" },
  imageOutOfBounds: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: "1.5cm",
    objectFit: 'cover',
  },
});

interface Props {
  records: FinancialRatiosData
  dateRange: DateRange
}

export const FinancialRatiosTemplate = ({ records, dateRange }: Props) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const messageDate = dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);


  return (
    <Document>
      <Page style={styles.page} size={"LETTER"} orientation="landscape">
        <View>
          <Image
            style={styles.imageOutOfBounds}
            src={REPORTS_LOGO_URL}
          />
        </View>

        <View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => (
              `Página ${pageNumber}`
            )}
          />
        </View>

        <View style={[styles.header, { paddingBottom: 7 }]}>
          <Text style={[styles.thCell, { fontSize: 14, }]}>Ratios Financieros</Text>
          <Text style={[styles.tdCell]}>{messageDate}</Text>
        </View>

        {/* Tabla */}
        <View style={[styles.col100, { borderWidth: 1, borderRadius: 7, overflow: 'hidden' }]}>

          <View style={[styles.trCell, { backgroundColor: "#E0E0E0", borderTopLeftRadius: 7, borderTopRightRadius: 7 }]}>
            <View style={[styles.thCell, styles.col20, { alignItems: 'center' }]}><Text>Categoría</Text></View>
            <View style={[styles.thCell, styles.col20, { alignItems: 'center' }]}><Text>Ratio</Text></View>
            <View style={[styles.thCell, styles.col10, { alignItems: 'center' }]}><Text>Valor</Text></View>
            <View style={[styles.thCell, styles.col50, { alignItems: 'center' }]}><Text>Interpretación</Text></View>
          </View>

          {/* Ratios de liquidez */}
          <View style={{ borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {
              records.liquidityRatios.items.map((item, index) => (
                <View key={index} style={[{ display: 'flex', gap: 0, flexDirection: 'row' }]}>
                  <View style={styles.col20}>
                    <Text style={[styles.thCell]}>
                      {
                        index === 0
                          ? records.liquidityRatios.title
                          : " "
                      }
                    </Text>
                  </View>
                  <View style={[styles.col20, { borderRightWidth: 1, borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>{item.name}</Text>
                  </View>
                  <View style={styles.col10}>
                    <Text style={[styles.tdCell, { textAlign: "right" }]}>{item.value}</Text>
                  </View>
                  <View style={[styles.col50, { borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>
                      {item.interpretation}
                    </Text>
                  </View>
                </View>
              ))
            }
          </View>

          {/* Ratios de endeudamiento */}
          <View style={{ borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {
              records.debtRatios.items.map((item, index) => (
                <View key={index} style={[{ display: 'flex', gap: 0, flexDirection: 'row' }]}>
                  <View style={styles.col20}>
                    <Text style={[styles.thCell]}>
                      {
                        index === 0
                          ? records.debtRatios.title
                          : " "
                      }
                    </Text>
                  </View>
                  <View style={[styles.col20, { borderRightWidth: 1, borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>{item.name}</Text>
                  </View>
                  <View style={styles.col10}>
                    <Text style={[styles.tdCell, { textAlign: "right" }]}>{item.value}</Text>
                  </View>
                  <View style={[styles.col50, { borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>
                      {item.interpretation}
                    </Text>
                  </View>
                </View>
              ))
            }
          </View>

          {/* Ratios de rentabilidad */}
          <View style={{ borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {
              records.profitabilityRatios.items.map((item, index) => (
                <View key={index} style={[{ display: 'flex', gap: 0, flexDirection: 'row' }]}>
                  <View style={styles.col20}>
                    <Text style={[styles.thCell]}>
                      {
                        index === 0
                          ? records.profitabilityRatios.title
                          : " "
                      }
                    </Text>
                  </View>
                  <View style={[styles.col20, { borderRightWidth: 1, borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>{item.name}</Text>
                  </View>
                  <View style={styles.col10}>
                    <Text style={[styles.tdCell, { textAlign: "right" }]}>{item.value}</Text>
                  </View>
                  <View style={[styles.col50, { borderLeftWidth: 1 }]}>
                    <Text style={[styles.tdCell]}>{item.interpretation}</Text>
                  </View>
                </View>
              ))
            }
          </View>
        </View>

        <View style={[styles.trCell]}>
          {
            ['CONTADOR', 'GERENTE'].map((name, index) => (
              <View key={index} style={[styles.thCell, styles.col50, { paddingTop: '2cm', alignItems: "center" }]}>
                <Text style={{ paddingBottom: 3 }}>___________________________</Text>
                <Text style={{ textAlign: "center" }}>{name}</Text>
              </View>
            ))
          }


        </View>

      </Page>
    </Document>
  )
}