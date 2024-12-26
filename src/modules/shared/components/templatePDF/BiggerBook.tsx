import { AccountData } from "@/app/dashboard/results/bigger-book/page";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatNumber } from "../../utils/validate";

interface BiggerBookTemplateProps {
  dateRange: DateRange;
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
    fontSize: 12,
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
  }
});

export const BiggerBookTemplate: React.FC<BiggerBookTemplateProps> = ({ dateRange, inSus = false, records }) => {
  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy HH:mm:ss';
  const debitType = inSus ? "debitSus" : "debitBs";
  const assetType = inSus ? "assetSus" : "assetBs";
  const moneyType = inSus ? "Dolares" : "Bolivianos";

  return (
    <Document>
      {
        records.map((record, index) => (
          <Page key={index} size={"LETTER"} style={styles.page} wrap>
            <Text style={styles.titlePage}>
              Libro Mayor
            </Text>
            <View style={[{ paddingBottom: 5 }]}>
              <Text style={[styles.thCell, { textAlign: "center" }]}>(Expresado en {moneyType})</Text>
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
                <Text style={[styles.col10, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Asiento</Text>
                <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Fecha</Text>
                <Text style={[styles.col30, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Glosa</Text>
                <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Debe</Text>
                <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Haber</Text>
                <Text style={[styles.col15, styles.thCell, { fontFamily: "Helvetica-Bold" }]}>Saldo</Text>
              </View>
              {
                record.voucherItems.map((item, index) => (
                  <View style={styles.trCell} key={item.accountId}>
                    <Text style={[styles.col10, styles.tdCell]}>{index}</Text>
                    <Text style={[styles.col15, styles.tdCell]}>{format(item.createdAt, "dd/MM/yyyy")}</Text>
                    <Text style={[styles.col30, styles.tdCell]}>{item.gloss}</Text>
                    <Text style={[styles.col15, styles.tdCell]}>{formatNumber(item[debitType])}</Text>
                    <Text style={[styles.col15, styles.tdCell]}>{formatNumber(item[assetType])}</Text>
                    <Text style={[styles.col15, styles.tdCell]}>{formatNumber((item[debitType] - item[assetType]))}</Text>
                  </View>
                ))
              }
              <View style={[styles.trCell, { borderTopWidth: 1 }]}>
                <Text style={[styles.thCell, styles.col55, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
                <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{formatNumber(record.totalDebit)}</Text>
                <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{formatNumber(record.totalAsset)}</Text>
                <Text style={[styles.col15, styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{formatNumber((record.totalDebit - record.totalAsset))}</Text>
              </View>
            </View>
          </Page>
        ))
      }
    </Document >
  )
}