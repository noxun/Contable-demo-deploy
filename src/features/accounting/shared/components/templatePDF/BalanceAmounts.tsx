
/* eslint-disable jsx-a11y/alt-text */
import { BalanceAmounts as BalanceAmountsType } from "@/features/accounting/results/types/types"
import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer"
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { formatNumber } from "../../utils/validate";
import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_NIT, REPORTS_LOGO_URL } from "@/lib/constants";
import { paginatePDFContent } from "@/features/accounting/results/lib/utils";
import { createTw } from "react-pdf-tailwind";

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

const tw = createTw({});

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

  // Fechas y hora
  const now = new Date();
  const gestion = now.getFullYear();
  const mesLiteral = now.toLocaleString("es-BO", { month: "long" });
  const fecha = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const hora = now.toLocaleTimeString("es-BO");

  const paginatedRecords = paginatePDFContent(records.items, {
    firstPageCapacity: 20,
    otherPagesCapacity: 24,
    signatureFooterHeight: 0
  })

  return (
    <Document>
      {paginatedRecords.map((pageData, pageIndex) => (
        <Page key={pageIndex} style={[styles.page]} orientation="landscape" size={"LETTER"}>

          {/* Seccion del header de la primera pagina */}
          {pageIndex === 0 && (
            <>
            {/* Encabezado del documento */}
            <View style={tw("w-full flex flex-row justify-between mb-8 text-sm")}>
              <View style={tw("flex-1")}>
                <Image
                  source={REPORTS_LOGO_URL}
                  style={{ height: 40, width: 120 }}
                />
                <Text style={tw("font-semibold text-gray-700 mt-2")}>{COMPANY_NAME} </Text>
                <Text style={tw("text-gray-700 mb-1")}>NIT {COMPANY_NIT}</Text>
                <Text style={tw("text-gray-700 w-[140px] text-xs")}>{COMPANY_ADDRESS} </Text>
              </View>
              <View style={tw("flex-1 flex items-center self-end")}>
                <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", paddingBottom: 5}}>BALANCE DE SUMAS Y SALDOS</Text>
                <Text style={[{fontSize:11,paddingTop:3, textAlign: "center", fontWeight:"normal" }]}>{dateText}</Text>
                <Text style={[{fontSize:11, fontFamily: "Helvetica", fontWeight:'normal', color:"#232323"}]}>(Expresado en {moneyType})</Text>
              </View>
              <View style={tw("flex-1 flex flex-col items-end pt-4 text-xs")}>
                <View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Gestion </Text>  <Text style={tw("text-gray-800")}> {gestion} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Mes </Text>  <Text style={tw("text-gray-800")}> {mesLiteral} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Fecha: </Text>  <Text style={tw("text-gray-800")}> {fecha} </Text>  </View>
                  <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Hora: </Text>  <Text style={tw("text-gray-800")}> {hora} </Text>  </View>
                </View>
              </View>
            </View>
            </>
          )}

          {/* Seccion del header*/}
          <View style={[styles.trCell, { justifyContent: "flex-end", borderWidth: 1 }]}>
            <View style={[styles.col10, { borderRightWidth: 1, height:"100%", display:"flex", justifyContent:"center"}]}>
              <View style={[styles.thCell]}><Text>Cuenta</Text></View>
            </View>
            <View style={[styles.col50,{height:"100%", display:"flex", justifyContent:"center"}]}>
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
                    <View style={[styles.col50, styles.tdCell, { textAlign: "right",}]}><Text>{formatNumber(record.debit)}</Text></View>
                    <View style={[styles.col50, styles.tdCell, { textAlign: "right",}]}><Text>{formatNumber(record.asset)}</Text></View>
                  </View>
                  <View style={[styles.trCell, styles.col20, { borderLeftWidth: 1 }]}>
                    <View style={[styles.tdCell, styles.col50, { textAlign: "right",}]}><Text>{formatNumber(record.debtor)}</Text></View>
                    <View style={[styles.tdCell, styles.col50, { textAlign: "right",}]}><Text>{formatNumber(record.creditor)}</Text></View>
                  </View>
                </View>
              ))
            }
          </View>

          {/* Seccion de resultados y la forma */}
          <View>
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
                <View wrap={false} style={[styles.trCell]}>
                  <View style={styles.col25}><Text>{" "}</Text></View>
                  <View style={[styles.thCell, styles.col25, { paddingTop: "3cm", alignItems: "center"},]}>
                    <Text style={{ textAlign: "center", borderTopWidth: 1,borderColor:"gray", width:"120px", paddingTop:2 }}>CONTADOR</Text>
                  </View>
                  <View style={[styles.thCell, styles.col25, { paddingTop: "3cm", alignItems: "center"}]}>
                    <Text style={{ textAlign: "center", borderTopWidth: 1,borderColor:"gray", width:"120px", paddingTop:2 }}>GERENTE</Text>
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