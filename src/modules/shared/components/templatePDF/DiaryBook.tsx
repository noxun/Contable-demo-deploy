import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatNumber } from "../../utils/validate";

export interface ReportDiaryBook {
  report: DiaryBook[];
  total: {
    debe: number;
    haber: number;
  };
}

export interface DiaryBook {
  id: number;
  type: number;
  typeDes: string;
  voucher: null;
  gloss: string;
  exchangeRate: number;
  coin: string;
  voucherDate: Date;
  date: Date;
  voucherItems: VoucherItem[];
  plusData: PlusData;
}

export interface PlusData {
  debe: number;
  haber: number;
}

export interface VoucherItem {
  id: number;
  debitBs: number;
  debitSus: number;
  assetBs: number;
  assetSus: number;
  gloss: string;
  accountId: number;
  code: string;
  description: string;
  typeOfExpense: null;
  createdAt: Date;
  voucherId: number;
  type: number;
}

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
  table: {
    width: "100%",
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  thCell: {
    fontSize: 13,
    fontWeight: "bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 10,
    padding: 5,
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
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col70: { width: "70%" },
});

interface DateRange {
  from: string;
  to: string;
}

export const DiaryBookTemplate = ({
  records,
  isSus,
  dateRange,
}: {
  records: ReportDiaryBook;
  isSus: Boolean;
  dateRange: DateRange;
}) => {
  const debitType = isSus ? "debitSus" : "debitBs";
  const assetType = isSus ? "assetSus" : "assetBs";
  const moneyType = isSus ? "Dolares" : "Bolivianos";
  const messageDate =
    dateRange.from === dateRange.to
      ? dateRange.from
      : `${dateRange.from} al ${dateRange.to}`;

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={{ display: "flex", textAlign: "center", gap: 2, paddingBottom: 5 }}>
          <Text style={{ fontSize: 20 }}>
            Libro Diario
          </Text>
          <Text style={styles.thCell}>Expresado en {moneyType}</Text>
        </View>
        <View style={[styles.trCell, { paddingBottom: 5, borderTopWidth: 1 }]}>
          <View style={styles.col20}>
            <Text style={[styles.thCell]}>Fecha</Text>
          </View>
          <View style={[styles.col60, { textAlign: "center" }]}>
            <Text style={styles.thCell}>{messageDate}</Text>
          </View>
          <View style={styles.col20}>
            <Text style={[styles.thCell, { textAlign: "right" }]}>Logo</Text>
          </View>
        </View>

        <View
          style={[
            styles.trCell,
            { borderBottomWidth: 1, borderTopWidth: 1, fontFamily: "Helvetica-Bold" },
          ]}
        >
          <Text style={[styles.thCell, styles.col20]}>Codigo</Text>
          <Text style={[styles.thCell, styles.col50]}>Detalle</Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center" }]}>
            Debe
          </Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center" }]}>
            Haber
          </Text>
        </View>

        {records.report.map((asiento, asientoIdx) => (
          <View style={styles.table} key={asientoIdx}>
            <View style={styles.trCell}>
              <Text style={[styles.tdCell, styles.col20, { borderRightWidth: 1 }]}>
                {format(asiento.voucherDate, "dd/MM/yyyy")}
              </Text>
              <Text style={[styles.tdCell, styles.col50, { borderRightWidth: 1, textAlign: "center", },]}>
                -------- Comprobante {asiento.typeDes} --------
              </Text>
              <Text style={[styles.col15, { borderRightWidth: 1 }]}> </Text>
              <Text style={styles.col15}></Text>
            </View>

            {asiento.voucherItems.map((record, idx) => (
              <View style={styles.entry} key={idx}>
                <Text style={[styles.tdCell, styles.col20, { borderRightWidth: 1 },]}>
                  {record.code}
                </Text>
                <Text style={[styles.tdCell, styles.col50, { borderRightWidth: 1, paddingLeft: `${record[assetType] > 0 ? "20" : styles.tdCell.padding}`, },]}>
                  {record.description}
                </Text>
                <Text style={[styles.tdCell, styles.col15, { borderRightWidth: 1 }]}>
                  {formatNumber(record[debitType])}
                </Text>
                <Text style={[styles.tdCell, styles.col15]}>
                  {formatNumber(record[assetType])}
                </Text>
              </View>
            ))}
            <View style={styles.trEntry}>
              <Text style={[styles.tdCell, styles.col20, { paddingBottom: 15, borderRightWidth: 1 },]}>
                {" "}
              </Text>
              <Text style={[styles.tdCell, styles.col50, { paddingBottom: 15, borderRightWidth: 1 },]}>
                {`${asiento.gloss} `}
              </Text>
              <Text style={[styles.tdCell, styles.col15, { paddingBottom: 15, fontFamily: "Helvetica-Bold", borderRightWidth: 1, fontWeight: "bold", },]}>
                {formatNumber(asiento.plusData.debe)}
              </Text>
              <Text style={[styles.tdCell, styles.col15, { paddingBottom: 15, fontFamily: "Helvetica-Bold", fontWeight: "bold", },]}>
                {formatNumber(asiento.plusData.haber)}
              </Text>
            </View>
          </View>
        ))}
        <View style={[styles.trCell, { borderTopWidth: 1, borderBottomWidth: 1 }]}>
          <Text style={[styles.tdCell, styles.col70]}>Total</Text>
          <Text style={[styles.tdCell, styles.col15]}>{formatNumber(records.total.debe)}</Text>
          <Text style={[styles.tdCell, styles.col15]}>{formatNumber(records.total.haber)}</Text>
        </View>
      </Page>
    </Document>
  );
};
