
/* eslint-disable jsx-a11y/alt-text */
import { BalanceAmounts as BalanceAmountsType } from "@/features/accounting/results/types/types"
import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer"
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatNumber } from "../../utils/validate";
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { paginatePDFContent } from "@/features/accounting/results/lib/utils";

interface Props {
  records: BalanceAmountsType,
  dateRange?: DateRange
  inSus?: boolean
}

const styles = StyleSheet.create({
  page: {
    padding: "1cm",
    width: "100%",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: "50%",
    fontSize: 10,
  },
  titlePage: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingBottom: 5,
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
    fontSize: 11,
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
  col10: { width: "10%" },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col30: { width: "30%" },
  col45: { width: "45%" },
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
    height: "1.4cm",
    objectFit: 'cover',
  },
});


export const BalanceAmountsTemplate = ({ records, dateRange, inSus = false }: Props) => {

  const FORMAT_DATE_INITIAL = "dd/MM/yyyy";
  const dateText =
    dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);

  const moneyType = inSus ? "Dolares" : "Bolivianos"

  const paginatedRecords = paginatePDFContent(records.items, {
    firstPageCapacity: 20,
    otherPagesCapacity: 24,
    signatureFooterHeight: 6
  })

  return (
    <Document>
      {paginatedRecords.map((pageData, pageIndex) => (
        <Page key={pageIndex} style={[styles.page]} orientation="landscape" size={"LETTER"}>

          {/* Seccion del header de la primera pagina */}
          {pageIndex === 0 && (
            <>
              <View >
                <Image
                  style={styles.imageOutOfBounds}
                  src={REPORTS_LOGO_URL}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.titlePage, { marginTop: 25 }]} >BALANCE DE SUMAS Y SALDOS</Text>
                <Text style={styles.thCell} >{dateText}</Text>
                <Text style={[styles.thCell, { marginBottom: 8 }]} >(Expresado en {moneyType})</Text>
              </View>
            </>
          )}

          {/* Seccion del header*/}
          <View style={[styles.trCell, { justifyContent: "flex-end", borderWidth: 1 }]}>
            <View style={[styles.col10, { borderRightWidth: 1 }]}>
              <View><Text>{" "}</Text></View>
              <View style={[styles.thCell]}><Text>Cuenta</Text></View>
            </View>
            <View style={[styles.col50,]}>
              <View ><Text>{" "}</Text></View>
              <View style={[styles.thCell]}><Text>Nombre De Cuenta</Text></View>
            </View>
            <View style={[styles.col20, { borderLeftWidth: 1, display: "flex", flexDirection: "column", textAlign: "center", }]}>
              <View style={[styles.thCell, { borderBottomWidth: 1 }]}><Text>Sumas</Text></View>
              <View style={styles.trCell}>
                <View style={[styles.thCell, styles.col50, { textAlign: "center", borderRightWidth: 1 }]}><Text>Debe</Text></View>
                <View style={[styles.thCell, styles.col50, { textAlign: "center" }]}><Text>Haber</Text></View>
              </View>
            </View>
            <View style={[styles.col20, { borderLeftWidth: 1, display: "flex", flexDirection: "column", textAlign: "center", }]}>
              <View style={[styles.thCell, { borderBottomWidth: 1 }]}><Text>Saldos</Text></View>
              <View style={styles.trCell}>
                <View style={[styles.thCell, styles.col50, { textAlign: "center", borderRightWidth: 1 }]}><Text>Deudor</Text></View>
                <View style={[styles.thCell, styles.col50, { textAlign: "center" }]}><Text>Acreedor</Text></View>
              </View>
            </View>
          </View>

          {/* Seccion del contenido */}
          <View style={{ borderBottomWidth: 1 }}>
            {
              pageData.map((record) => (
                <View style={[styles.trCell, { borderLeftWidth: 1, borderRightWidth: 1 }]} key={record.code}>
                  <View style={[styles.col10, styles.tdCell, { borderRightWidth: 1 }]}><Text>{record.code}</Text></View>
                  <View style={[styles.col50, styles.tdCell]}><Text>{record.description}</Text></View>
                  <View style={[styles.trCell, styles.col20, { borderLeftWidth: 1 }]}>
                    <View style={[styles.col50, styles.tdCell, { textAlign: "right" }]}><Text>{formatNumber(record.debit)}</Text></View>
                    <View style={[styles.col50, styles.tdCell, { textAlign: "right" }]}><Text>{formatNumber(record.asset)}</Text></View>
                  </View>
                  <View style={[styles.trCell, styles.col20, { borderLeftWidth: 1 }]}>
                    <View style={[styles.tdCell, styles.col50, { textAlign: "right" }]}><Text>{formatNumber(record.debtor)}</Text></View>
                    <View style={[styles.tdCell, styles.col50, { textAlign: "right" }]}><Text>{formatNumber(record.creditor)}</Text></View>
                  </View>
                </View>
              ))
            }
          </View>

          {/* Seccion de resultados y la forma */}
          <View >
            {pageIndex === paginatedRecords.length - 1 && (
              <>
                {/* Resultados */}
                <View style={[styles.trCell, { borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, fontFamily: "Helvetica-Bold" }]}>
                  <View style={styles.col10}></View>
                  <View style={[styles.col50, styles.tdCell]}><Text>Resultados Finales </Text></View>
                  <View style={[styles.trCell, styles.col20, { borderLeftWidth: 1, textAlign: "right" }]}>
                    <View style={[styles.tdCell, styles.col50]}><Text>{formatNumber(records.asset)}</Text></View>
                    <View style={[styles.tdCell, styles.col50]}><Text>{formatNumber(records.debit)}</Text></View>
                  </View>
                  <View style={[styles.trCell, styles.col20, { borderLeftWidth: 1, textAlign: "right" }]}>
                    <View style={[styles.tdCell, styles.col50]}><Text>{formatNumber(records.debtor)}</Text></View>
                    <View style={[styles.tdCell, styles.col50]}><Text>{formatNumber(records.creditor)}</Text></View>
                  </View>
                </View>
                {/* Firma */}
                <View style={[styles.trCell, { borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }]}>
                  <View style={styles.col25}><Text>{" "}</Text></View>
                  <View style={[styles.thCell, styles.col25, { paddingTop: "2cm", alignItems: "center", borderLeftWidth: 1, borderRightWidth: 1, },]}>
                    <Text style={{ textAlign: "center" }}>CONTADOR</Text>
                  </View>
                  <View style={[styles.thCell, styles.col25, { paddingTop: "2cm", alignItems: "center", borderRightWidth: 1, }]}>
                    <Text style={{ textAlign: "center" }}>GERENTE</Text>
                  </View>
                  <View style={styles.col25}><Text>{" "}</Text></View>
                </View>
              </>
            )}
          </View>

          {/* Seccion de la paginacion */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => (
              `Página ${pageNumber} de ${totalPages}`
            )}
          />
        </Page >
      ))}

    </Document >
  )
}