/* eslint-disable jsx-a11y/alt-text */

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatNumber } from "../../utils/validate";
import { REPORTS_LOGO_URL } from "@/lib/constants";

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
  hojaDeRuta: string;
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
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 3,
  },
  tdCell: {
    fontSize: 9,
    paddingHorizontal: 5,
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
  col40: { width: "40%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col70: { width: "70%" },
  imageOutOfBounds: {
    position: 'absolute',
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: 'cover',
  },
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
        <View>
          <Image
            style={styles.imageOutOfBounds}
            source={REPORTS_LOGO_URL}
          />
        </View>
        <View style={{ display: "flex", textAlign: "center", gap: 2, paddingBottom: 5, paddingTop: 20 }}>
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>
            Libro Diario
          </Text>
          <Text style={[styles.thCell, { fontFamily: "Helvetica-Bold" }]}>(Expresado en {moneyType})</Text>
        </View>
        <View style={[styles.trCell, { paddingBottom: 5, borderTopWidth: 1 }]}>
          <View style={styles.col20}>
            <Text style={[styles.thCell]}>Fecha</Text>
          </View>
          <View style={[styles.col60, { textAlign: "center" }]}>
            <Text style={styles.thCell}>{messageDate}</Text>
          </View>
          <View style={[styles.col20, { paddingTop: 1, paddingBottom: 1 }]}></View>
        </View>

        <View
          style={[
            styles.trCell,
            { borderBottomWidth: 1, borderTopWidth: 1, fontFamily: "Helvetica-Bold" },
          ]}
        >
          <Text style={[styles.thCell, styles.col15]}>Codigo</Text>
          <Text style={[styles.thCell, styles.col40]}>Detalle</Text>
          <Text style={[styles.thCell, styles.col15]}>Hoja de Ruta</Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center" }]}>Debe</Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center" }]}>Haber</Text>
        </View>

        {(Array.isArray(records.report) ? records.report : []).map((asiento) => (
          <View style={styles.table} key={asiento.id}>
            <View style={styles.trCell}>
              <Text style={[styles.tdCell, styles.col15, { borderRightWidth: 1, height: '100%' }]}>
                {format(asiento.voucherDate, "dd/MM/yyyy")}
              </Text>
              <Text style={[styles.tdCell, styles.col40, { borderRightWidth: 1, textAlign: "center", height: '100%'}]}>
                {asiento.typeDes}
              </Text>
              <Text style={[styles.col15, { borderRightWidth: 1 }]}>{" "}</Text>
              <Text style={[styles.col15, { borderRightWidth: 1 }]}> </Text>
              <Text style={styles.col15}></Text>
            </View>

            {(Array.isArray(asiento.voucherItems) ? asiento.voucherItems : []).map((record) => (
              <View style={styles.entry} key={record.id}>
                <View style={styles.col15}>
                  <Text style={[styles.tdCell, { borderRightWidth: 1 },]}>
                    {record.code}
                  </Text>
                </View>
                <View style={styles.col40}>
                  <Text style={[styles.tdCell, { borderRightWidth: 1, paddingLeft: `${record[assetType] > 0 ? "20" : styles.tdCell.paddingHorizontal}`, },]}>
                    {record.description}
                  </Text>
                </View>
                <View style={styles.col15}>
                  <Text style={[styles.tdCell, { borderRightWidth: 1 },]}>
                    {record.hojaDeRuta ?? ' '}
                  </Text>
                </View>
                <View style={styles.col15}>
                  <Text style={[styles.tdCell, { borderRightWidth: 1, textAlign: "right" }]}>
                    {formatNumber(record[debitType])}
                  </Text>
                </View>
                <View style={styles.col15}>
                  <Text style={[styles.tdCell, { textAlign: "right" }]}>
                    {formatNumber(record[assetType])}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.trEntry}>
              <View style={[styles.col15, { paddingBottom: 15, borderRightWidth: 1, height: '100%' }]}>
                <Text style={[styles.tdCell]}>
                  {" "}
                </Text>
              </View>
              <View style={[styles.col40, { paddingBottom: 15, borderRightWidth: 1 }]} >
                <Text style={[styles.tdCell, { fontSize: 9, fontFamily: "Helvetica-BoldOblique" }]}>
                  {`${asiento.gloss} `}
                </Text>
              </View>
              <View style={[styles.col15, { paddingBottom: 15, borderRightWidth: 1 }]}>
                <Text style={[styles.tdCell]}>
                  {" "}
                </Text>
              </View>
              <View style={[styles.col15, { paddingBottom: 15, borderRightWidth: 1 }]}>
                <View style={{ alignSelf: 'flex-end', borderBottomWidth: 2 }}>
                  <Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" },]}>
                    {formatNumber(asiento.plusData.debe)}
                  </Text>
                </View>
              </View>
              <View style={[styles.col15, { paddingBottom: 15 }]}>
                <View style={{ alignSelf: 'flex-end', borderBottomWidth: 2 }}>
                  <Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" },]}>
                    {formatNumber(asiento.plusData.haber)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
        }
        <View style={[styles.trCell, { borderTopWidth: 1, borderBottomWidth: 1 }]}>
          <Text style={[styles.tdCell, styles.col70, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
          <Text style={[styles.tdCell, styles.col15, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{formatNumber(records.total.debe)}</Text>
          <Text style={[styles.tdCell, styles.col15, { textAlign: "right", fontFamily: "Helvetica-Bold" }]}>{formatNumber(records.total.haber)}</Text>
        </View>
      </Page >
    </Document >
  );
};
