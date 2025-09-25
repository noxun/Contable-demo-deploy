/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatNumber } from "../../utils/validate";
import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_NIT, REPORTS_LOGO_URL } from "@/lib/constants";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ItemStatementIncomeType, StatementIncomeResultsType, StatementIncomeType } from "@/features/accounting/results/types/types";
import { createTw } from "react-pdf-tailwind";

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

const tw = createTw({})

interface Props {
  inSus?: boolean
  records: StatementIncomeType
  dateRange?: DateRange
  currentLevel: number
}


export const EstadoResultadosTemplate = ({ records, inSus = false, dateRange, currentLevel }: Props) => {
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const FORMAT_DATE_INITIAL = "dd/MM/yyyy";
  
  // Fechas y hora
  const now = new Date();
  const gestion = now.getFullYear();
  const mesLiteral = now.toLocaleString("es-BO", { month: "long" });
  const fecha = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const hora = now.toLocaleTimeString("es-BO");

  const messageDate =
    dateRange?.from &&
    (dateRange?.to
      ? `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)} al ${format(
        dateRange.to,
        FORMAT_DATE_INITIAL
      )}`
      : `Del ${format(dateRange.from, FORMAT_DATE_INITIAL)}`);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* PAGINADO */}
        <View fixed render={({ pageNumber, totalPages }:any) => (
            <View style={{
                fontSize: '8px',
                color: '#2f2f2f',
                width: '100%',
                textAlign: 'right',
                paddingBottom: 4,
                borderBottom: pageNumber !== 1 ? '1px solid black' : undefined,
              }}
            >
              <Text> Página: {pageNumber} / {totalPages} </Text>
            </View>
          )}
        />
        {/* primera pagina */}
        <View style={tw("w-full flex flex-row justify-between mb-4 text-sm")}>
          <View style={tw("w-[28%]")}>
            <Image
              source={REPORTS_LOGO_URL}
              style={{ height: 40, width: 120 }}
            />
            <Text style={tw("font-semibold text-gray-700 mt-2")}>{COMPANY_NAME} </Text>
            <Text style={tw("text-gray-700 mb-1")}>NIT {COMPANY_NIT}</Text>
            <Text style={tw("text-gray-700 w-[140px] text-xs")}>{COMPANY_ADDRESS} </Text>
          </View>
          <View style={tw("w-[58%] flex items-center self-end mt-24")}>
            <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", paddingBottom: 5}}>ESTADO DE RESULTADOS</Text>
            <Text style={[{fontSize:11,paddingTop:3, textAlign: "center", fontWeight:"normal" }]}>{messageDate}</Text>
            <Text style={[{fontSize:10, fontFamily: "Helvetica", fontWeight:'normal', color:"#232323"}]}>(Expresado en {moneyType})</Text>
          </View>
          <View style={tw("w-[24%] flex flex-col items-end pt-4 text-xs")}>
            <View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Gestion </Text>  <Text style={tw("text-gray-800")}> {gestion} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Mes </Text>  <Text style={tw("text-gray-800")}> {mesLiteral} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Fecha: </Text>  <Text style={tw("text-gray-800")}> {fecha} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Hora: </Text>  <Text style={tw("text-gray-800")}> {hora} </Text>  </View>
            </View>
          </View>
        </View>

        {/* Contenido principal paginado */}
        <View style={styles.border}>

          <View style={[styles.trHead, styles.border_b, { fontSize: 8, backgroundColor: '#E0E0E0' }]}>
            <View style={[styles.col15, styles.thCell, styles.border_r]}><Text>Cuenta</Text></View>
            <View style={[styles.col40, styles.thCell, styles.border_r]}><Text>Descripcion</Text></View>
            <View style={[styles.col15, styles.thCell, styles.border_r, styles.txtCenter]}><Text>Imp. Niv. {currentLevel}</Text></View>
            <View style={[styles.col15, styles.thCell, styles.border_r, styles.txtCenter]}><Text>{(currentLevel - 1) <= 0 ? " " : `Imp. Niv. ${currentLevel - 1}`}</Text></View>
            <View style={[styles.col15, styles.thCell, styles.txtCenter]}><Text>{(currentLevel - 2) <= 0 ? " " : `Imp. Niv. ${currentLevel - 2}`}</Text></View>
          </View>

          {records.items.map((item, index) => renderItem({
            managementResult: records.managementResult,
            periodUtility: records.periodUtility,
            taxOnProfits: records.taxOnProfits,
            totalExpense: records.totalExpense,
            totalIncome: records.totalIncome
          }, currentLevel, item))}

          <View wrap={false} style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>PERIODO DE UTILIDAD</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(records.periodUtility)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
          <View wrap={false} style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>IMPUESTOS SOBRE BENEFICIOS</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(records.taxOnProfits)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
          <View wrap={false} style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>RESULTADOS DE LA GESTION</Text>
            <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(records.managementResult)}</Text>
            <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
            <View style={styles.col15}><Text>{" "}</Text></View>
          </View>
        </View>


        {/* seccion de la firma */}
        <View wrap={false} style={[styles.trFooter]}>
          <View style={[styles.tfooter, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>_______________________</Text>
            <Text style={styles.txtCenter}>CONTADOR</Text>
          </View>
          <View style={[styles.tfooter, { paddingTop: '2cm', alignItems: "center" }]}>
            <Text style={{ paddingBottom: 3 }}>_______________________</Text>
            <Text style={styles.txtCenter}>GERENTE</Text>
          </View>
        </View>
        {/*Border bottom */}
        <View fixed render={({ pageNumber, totalPages }: any) =>
          pageNumber !== totalPages ? (
            <View style={{width: '100%',height: 1,marginTop: 'auto',borderTop: '1px solid black',}}/>
          ) : null}
        />
      </Page>
    </Document >
  )
}



const renderItem = (results: StatementIncomeResultsType, currentLevel: number, item: ItemStatementIncomeType, level = 1) => {
  const fontWeight = currentLevel === level ? "Helvetica" : "Helvetica-Bold"
  return (
    <View key={item.code}>
      <View wrap={false} style={[styles.trCell, styles.border_b_td]}>
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

      {
        item.itemsChild.length > 0 && (
          <View>
            {item.itemsChild.map((child) => renderItem({
              managementResult: results.managementResult,
              periodUtility: results.periodUtility,
              taxOnProfits: results.taxOnProfits,
              totalExpense: results.totalExpense,
              totalIncome: results.totalIncome
            }, currentLevel, child, level + 1))}
          </View>
        )
      }

      {/* Resultados --> INGRESOS */}
      {level === 1 && item.description === "INGRESOS" && (
        <View wrap={false} style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>TOTAL INGRESOS</Text>
          <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.totalIncome)}</Text>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <View style={styles.col15}><Text>{" "}</Text></View>
        </View>
      )}
      {/* Resultados --> GASTOS Y COSTOS */}
      {level === 1 && item.description === "GASTOS Y COSTOS" && (
        <View wrap={false} style={[styles.trCell, styles.border_b_td, { fontFamily: "Helvetica-Bold" }]}>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <Text style={[styles.col40, styles.tdCell, styles.border_r_td, { paddingLeft: 30 }]}>TOTAL GASTOS Y COSTOS</Text>
          <Text style={[styles.col15, styles.tdCell, styles.border_r_td, styles.txtRight]}>{formatNumber(results.totalExpense)}</Text>
          <View style={[styles.col15, styles.border_r_td]}><Text>{" "}</Text></View>
          <View style={styles.col15}><Text>{" "}</Text></View>
        </View>
      )}
    </View >
  );
};
