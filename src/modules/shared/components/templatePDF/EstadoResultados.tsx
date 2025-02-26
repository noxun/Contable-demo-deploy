/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatNumber } from "../../utils/validate";
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

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
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: 'cover',
  },
});

interface Item {
  account: string,
  description: string,
  amount: number,
  amountSus: number
}

interface Records {
  totalExpense: number,
  totalIncome: number,
  periodUtility: number,
  taxOnProfits: number,
  taxOnProfitsSus: number,
  managementResult: number,
  expenses: Item[];
  income: Item[];
}

interface Props {
  inSus?: boolean;
  records: Records;
  dateRange?: DateRange;
}

export const EstadoResultadosTemplate = ({ records, dateRange, inSus }: Props) => {

  const FORMAT_DATE_INITIAL = 'dd/MM/yyyy';
  const messageDate =
    dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);

  const moneyType = inSus ? "Dolares" : "Bolivianos";

  const gastoType = inSus ? "amountSus" : "amount";
  const taxOnProfits = inSus ? "taxOnProfitsSus" : "taxOnProfits"


  return (
    <Document>
      <Page style={styles.page} orientation="landscape">
        <View>
          <Image
            style={styles.imageOutOfBounds}
            src={REPORTS_LOGO_URL}
          />
        </View>

        <View style={[styles.header, { paddingBottom: 10 }]}>
          <Text style={[styles.thCell, { fontSize: 18, }]}>Estado de Resultados</Text>
          <Text style={[styles.thCell]}>{messageDate}</Text>
          <Text style={[styles.thCell]}>(Expresado en {moneyType})</Text>
        </View>

        <View style={[styles.table, styles.col100]}>
          <View style={styles.col50}>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Gastos</Text>
              <Text style={[styles.thCell, styles.col20, { textAlign: "center" }]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                records?.expenses.map((entry, index) => {
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.description}</Text>
                      <Text style={[styles.tdCell, styles.col20, { textAlign: "right" }]}>{formatNumber(entry[gastoType])}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>

          <View style={styles.col50}>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Ingresos</Text>
              <Text style={[styles.thCell, styles.col20, { textAlign: "center" }]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                records?.income.map((entry, index) => {
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.description}</Text>
                      <Text style={[styles.tdCell, styles.col20, { textAlign: "right" }]}>{formatNumber(entry[gastoType])}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>

        <View style={[styles.trCell, styles.table, { paddingTop: 4 }]}>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Gastos</Text>
            <Text style={[styles.thCell, styles.col20, { textAlign: "right" }]}>{formatNumber(records.totalExpense)}</Text>
          </View>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Ingresos</Text>
            <Text style={[styles.thCell, styles.col20, { textAlign: "right" }]}>{formatNumber(records.totalIncome)}</Text>
          </View>
        </View>

        <View style={[styles.table, styles.trCell, { paddingTop: 10, justifyContent: "flex-end" }]}>
          <View style={styles.col50} />
          <View style={[styles.col50]}>
            <View style={[styles.trCell]}>
              <Text style={styles.col20} />
              <Text style={[styles.thCell, styles.col60]}>Utilidad antes de impuestos</Text>
              <Text style={[styles.thCell, styles.col20, { textAlign: "right" }]}>{formatNumber((records.periodUtility))}</Text>
            </View>
            <View style={[styles.trCell]}>
              <Text style={styles.col20} />
              <Text style={[styles.thCell, styles.col60]}>Impuestos a las Utilidades</Text>
              <Text style={[styles.thCell, styles.col20, { textAlign: "right" }]}>{formatNumber(Number(records[taxOnProfits]))}</Text>
            </View>
            <View style={[styles.trCell]}>
              <Text style={styles.col20} />
              <Text style={[styles.thCell, styles.col60]}>Resultado de la Gestión</Text>
              <Text style={[styles.thCell, styles.col20, { textAlign: "right" }]}>
                {formatNumber(records.managementResult)}
              </Text>
            </View>
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

      </Page>
    </Document>
  )
}