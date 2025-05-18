/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatNumber } from "../../utils/validate";
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { BalanceGeneralResultsType, BalanceGeneralType, BalanceItemType } from "@/features/accounting/results/types/types";
import { toast } from "sonner";

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
  header: {
    display: "flex",
    gap: 2,
    textAlign: "center"
  },
  txtHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    padding: 3,
  },
  table: {
    display: "flex",
    flexDirection: "row",
    gap: 25,
    width: "100%",
  },
  trHead: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 8
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  trFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
    width: "100%",
  },
  thCell: {
    fontFamily: "Helvetica-Bold",
    padding: 3,
  },
  tfooter: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    padding: 3,
  },
  tdCell: {
    fontSize: 9,
    paddingVertical: 2,
    padding: 3,
  },
  border: { borderWidth: 1 },
  border_l: { borderLeftWidth: 1 },
  border_r: { borderRightWidth: 1 },
  border_t: { borderTopWidth: 1 },
  border_b: { borderBottomWidth: 1 },
  border_r_td: { borderRightWidth: 1, borderColor: '#F0F0F0' },
  border_b_td: { borderBottomWidth: 1, borderColor: '#F0F0F0' },
  txtCenter: { textAlign: "center" },
  txtRight: { textAlign: "right" },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col35: { width: "35%" },
  col40: { width: "40%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col65: { width: "65%" },
  col70: { width: "70%" },
  col80: { width: "80%" },
  col85: { width: "85%" },
  col100: { width: "100%" },
  imageOutOfBounds: {
    position: 'absolute',
    top: -15,
    left: -15,
    height: "1.4cm",
    objectFit: 'cover',
  },
});

interface Props {
  inSus?: boolean;
  records: BalanceGeneralType;
  dateRange: DateRange;
  currentLevel: number
}

export const BalanceGeneralTemplate = ({ records, inSus = false, dateRange, currentLevel }: Props) => {
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const FORMAT_DATE_INITIAL = "dd/MM/yyyy";
  const messageDate =
    dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);

  if (records?.items.length <= 0) {
    toast.warning('sin resultados')
    return <></>
  }

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado del documento */}
        <View>
          <Image style={styles.imageOutOfBounds} src={REPORTS_LOGO_URL} />
          <View style={{ textAlign: "center" }}>
            <Text style={[styles.txtHeader, { fontSize: 14, marginTop: 25 }]}>BALANCE GENERAL</Text>
            <Text style={styles.txtHeader}>{messageDate}</Text>
            <Text style={[styles.txtHeader, { marginBottom: 8 }]}>
              (Expresado en {moneyType})
            </Text>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.border}>
          <View style={[styles.trHead, styles.border_b, { fontSize: 8, backgroundColor: '#E0E0E0' }]}>
            <View style={[styles.col15, styles.thCell, styles.border_r]}><Text>Cuenta</Text></View>
            <View style={[styles.col40, styles.thCell, styles.border_r]}><Text>Descripcion</Text></View>
            <View style={[styles.col15, styles.thCell, styles.border_r, styles.txtCenter]}><Text>Imp. Niv. {currentLevel}</Text></View>
            <View style={[styles.col15, styles.thCell, styles.border_r, styles.txtCenter]}><Text>{(currentLevel - 1) <= 0 ? " " : `Imp. Niv. ${currentLevel - 1}`}</Text></View>
            <View style={[styles.col15, styles.thCell, styles.txtCenter]}><Text>{(currentLevel - 2) <= 0 ? " " : `Imp. Niv. ${currentLevel - 2}`}</Text></View>
          </View>
          {records.items.map((item, index) => renderItem({
            liabilityEquityResult: records.liabilityEquityResult,
            result: records.result,
            totalActive: records.totalActive,
            totalHeritage: records.totalHeritage,
            totalPassive: records.totalPassive
          }, currentLevel, item))}
        </View>

        {/* seccion de la firma */}
        <View style={[styles.trFooter]}>
          <View style={[styles.tfooter, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>_______________________</Text>
            <Text style={styles.txtCenter}>CONTADOR</Text>
          </View>
          <View style={[styles.tfooter, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>_______________________</Text>
            <Text style={styles.txtCenter}>GERENTE</Text>
          </View>
        </View>

        {/* Paginación */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )}
        />
      </Page>

    </Document >
  )
}



const renderItem = (results: BalanceGeneralResultsType, currentLevel: number, item: BalanceItemType, level = 1) => {
  const fontWeight = currentLevel === level ? "Helvetica" : "Helvetica-Bold"
  return (
    <View key={item.code}>
      <View style={[styles.trCell, styles.border_b_td]}>
        <View style={[styles.col15, styles.border_r_td]}>
          <Text style={[styles.tdCell]}>{item.code}</Text>
        </View>
        <View style={[styles.col40, styles.border_r_td]}>
          <Text style={[styles.tdCell, { paddingLeft: level * 10, fontFamily: fontWeight }]}>{item.description}</Text>
        </View>
        <View style={[styles.col15, styles.border_r_td]}>
          <Text style={[styles.tdCell, styles.txtRight]}>
            {currentLevel === item.level ? formatNumber(item.sld) : " "}
          </Text>
        </View>
        <View style={[styles.col15, styles.border_r_td]}>
          <Text style={[styles.tdCell, styles.txtRight, { fontFamily: "Helvetica-Bold" }]}>
            {currentLevel - 1 === item.level ? formatNumber(item.sld) : " "}
          </Text>
        </View>
        <View style={styles.col15}>
          <Text style={[styles.tdCell, styles.txtRight, { fontFamily: "Helvetica-Bold" }]}>
            {currentLevel - 2 === item.level ? formatNumber(item.sld) : " "}
          </Text>
        </View>
      </View>

      {/* Agregando los items */}
      {
        item.itemsChild.length > 0 && (
          <View>
            {item.itemsChild.map((child) => renderItem(
              {
                liabilityEquityResult: results.liabilityEquityResult,
                result: results.result,
                totalActive: results.totalActive,
                totalHeritage: results.totalHeritage,
                totalPassive: results.totalPassive
              }, currentLevel, child, level + 1))}
          </View>
        )
      }

      {/* Agregando los resultados de ACTIVOS */}
      {level === 1 && item.description === "ACTIVO" && (
        <View style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>TOTAL ACTIVO</Text>
          <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.totalActive)}</Text>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <View style={styles.col15}><Text>{" "}</Text></View>
        </View>
      )}
      {/* Agregando los resultados de PASIVOS */}
      {level === 1 && item.description === "PASIVOS" && (
        <View style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>TOTAL PASIVO</Text>
          <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.totalPassive)}</Text>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <View style={styles.col15}><Text>{" "}</Text></View>
        </View>
      )}
      {/* Agregando los resultados de PATRIMONIO */}
      {level === 1 && item.description === "PATRIMONIO" && (
        <>
          <View style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>TOTAL PATRIMONIO</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.totalActive)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
          <View style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>RESULTADO</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.result)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
          <View style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>PASIVO+PATRIMONIO+RESULTADO</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.liabilityEquityResult)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
        </>
      )}
    </View >
  );
};
