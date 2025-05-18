"use client"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format } from "date-fns"
import { formatNumber } from "../../utils/validate";

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
    fontFamily: "Helvetica"
  },
  pageNumber: {
    position: "absolute",
    top: 30,
    right: 30,
    fontSize: 10,
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
  col10: { width: "10%" },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col45: { width: "45%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col70: { width: "70%" },
});

export const Invoices = ({ voucherItems }: { voucherItems?: any[] }) => {
  const data = {
    "id": 2042,
    "num": 8,
    "exchangeRate": 6.96,
    "voucherDate": "2024-12-24T00:00:00",
    "coin": "BS",
    "checkNum": null,
    "canceledTo": null,
    "gloss": "Por la compra realizada según factura N°",
    "bankId": null,
    "type": 1,
    "items": [
      {
        "id": 2078,
        "debitBs": 3866.28,
        "debitSus": 555.5,
        "assetBs": 0,
        "assetSus": 0,
        "gloss": "Por la compra realizada según factura N°",
        "accountId": 6176,
        "code": "5010102001",
        "description": "COMPRAS",
        "typeOfExpense": null,
        "createdAt": "2024-12-24T00:00:00",
        "voucherId": 2042,
        "type": 1
      },
      {
        "id": 2079,
        "debitBs": 577.72,
        "debitSus": 83.00574712643679,
        "assetBs": 0,
        "assetSus": 0,
        "gloss": "Por la compra realizada según factura N°",
        "accountId": 5909,
        "code": "1010202001",
        "description": "CREDITO FISCAL IVA",
        "typeOfExpense": null,
        "createdAt": "2024-12-24T00:00:00",
        "voucherId": 2042,
        "type": 1
      },
      {
        "id": 2080,
        "debitBs": 0,
        "debitSus": 0,
        "assetBs": 4444,
        "assetSus": 638.5057471264367,
        "gloss": "Por la compra realizada según factura N°",
        "accountId": 5812,
        "code": "1010102001",
        "description": "BANCO BISA MN CTA 453058-001-1",
        "typeOfExpense": null,
        "createdAt": "2024-12-24T00:00:00",
        "voucherId": 2042,
        "type": 1
      }
    ]
  }

  const record = data

  return (
    <Document>
      <Page size={"LETTER"} style={styles.page}>
        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.thCell}>fecha: <Text style={{ fontFamily: "Helvetica" }}>{format(data.voucherDate, 'dd/MM/yyyy')}</Text></Text>
          <Text style={styles.thCell}>Descripcion: <Text style={{ fontFamily: "Helvetica" }}>{data.gloss}</Text></Text>
        </View>
        <View style={[styles.trCell, { border: 1 }]}>
          <Text style={[styles.thCell, styles.col15]}>Cuenta</Text>
          <Text style={[styles.thCell, styles.col45]}>Nombre de cuenta</Text>
          <Text style={[styles.thCell, styles.col10]}>Debe (Bs)</Text>
          <Text style={[styles.thCell, styles.col10]}>Haber (Bs)</Text>
          <Text style={[styles.thCell, styles.col10]}>Debe ($us)</Text>
          <Text style={[styles.thCell, styles.col10]}>Haber ($us)</Text>
        </View>
        <View style={{ borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }}>
          {record.items.map((item, index) => (
            <View key={index} style={styles.trCell}>
              <Text style={[styles.tdCell, styles.col15, { borderRightWidth: 1 }]}>{item.code}</Text>
              <Text style={[styles.tdCell, styles.col45, { borderRightWidth: 1 }]}>{item.description}</Text>
              <Text style={[styles.tdCell, styles.col10, { textAlign: "right", borderRightWidth: 1 }]}>{formatNumber(item.debitBs)}</Text>
              <Text style={[styles.tdCell, styles.col10, { textAlign: "right", borderRightWidth: 1 }]}>{formatNumber(item.assetBs)}</Text>
              <Text style={[styles.tdCell, styles.col10, { textAlign: "right", borderRightWidth: 1 }]}>{formatNumber(item.debitSus)}</Text>
              <Text style={[styles.tdCell, styles.col10, { textAlign: "right" }]}>{formatNumber(item.assetSus)}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.trCell, { justifyContent: "center", alignItems: "center", gap: 30, paddingTop: 40 }]}>
          <View style={[styles.thCell, { alignItems: "center" }]}>
            <Text style={{ fontFamily: "Helvetica", textAlign: "center", paddingBottom: 5 }}>________________</Text>
            <Text style={{ fontFamily: "Helvetica", textAlign: "center" }}>Contador</Text>
          </View>
          <View style={[styles.thCell, { alignItems: "center" }]}>
            <Text style={{ fontFamily: "Helvetica", textAlign: "center", paddingBottom: 5 }}>________________</Text>
            <Text style={{ fontFamily: "Helvetica", textAlign: "center" }}>Gerente</Text>
          </View>
        </View>
      </Page>
    </Document >
  )
}