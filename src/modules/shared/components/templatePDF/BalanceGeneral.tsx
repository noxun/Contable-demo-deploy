/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { formatNumber } from "../../utils/validate";
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { paginatePDFContent } from "@/modules/results/lib/utils";
import { BalanceGeneralType } from "@/modules/results/types/types";

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
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
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
}

const mockDatos: BalanceGeneralType = {
  "totalActiveCurrent": 150000,
  "totalActiveNoCurrent": 250000,
  "totalActive": 400000,
  "totalLiabilityCurrent": 120000,
  "totalLiabilityNoCurrent": 180000,
  "totalLiability": 300000,
  "totalEquity": 100000,
  "totalLiabilityEquity": 400000,

  "activeCurrentItems": [
    { "account": "1110101001", "description": "Caja General", "amount": 50000 },
    { "account": "1110101002", "description": "Bancos Nacionales", "amount": 100000 },
    { "account": "1110101003", "description": "Inversiones Temporales", "amount": 80000 },
    { "account": "1110101004", "description": "Cuentas por Cobrar", "amount": 70000 },
    { "account": "1110101005", "description": "Inventarios", "amount": 90000 },
    { "account": "1110101006", "description": "Anticipo Proveedores", "amount": 30000 },
    { "account": "1110101007", "description": "Seguros Pagados", "amount": 20000 },
    { "account": "1110101008", "description": "Impuestos Recuperables", "amount": 40000 },
    { "account": "1110101009", "description": "Clientes Nacionales", "amount": 60000 },
    { "account": "1110101010", "description": "Valores Negociables", "amount": 50000 }
  ],

  "activeNoCurrentItems": [
    { "account": "1210101001", "description": "Maquinaria Pesada", "amount": 150000, amountDetail: 123 },
    { "account": "1210101002", "description": "Edificios Corporativos", "amount": 200000, amountDetail: 123 },
    { "account": "1210101003", "description": "Equipos Tecnológicos", "amount": 80000, amountDetail: 123 },
    { "account": "1210101004", "description": "Patentes Registradas", "amount": 50000, amountDetail: 123 },
    { "account": "1210101005", "description": "Marcas Comerciales", "amount": 30000, amountDetail: 123 },
    { "account": "1210101006", "description": "Terrenos Urbanos", "amount": 180000, amountDetail: 123 },
    { "account": "1210101007", "description": "Vehículos Empresariales", "amount": 60000, amountDetail: 123 },
    { "account": "1210101008", "description": "Software Propietario", "amount": 40000, amountDetail: 123 },
    { "account": "1210101009", "description": "Mobiliario Ejecutivo", "amount": 25000, amountDetail: 123 },
    { "account": "1210101010", "description": "Inversiones Permanentes", "amount": 120000, amountDetail: 123 }
  ],

  "liabilityCurrentItems": [
    { "account": "2110101001", "description": "Proveedores Nacionales", "amount": 80000 },
    { "account": "2110101002", "description": "Préstamos Corto Plazo", "amount": 50000 },
    { "account": "2110101003", "description": "Impuestos por Pagar", "amount": 30000 },
    { "account": "2110101004", "description": "Acreedores Diversos", "amount": 20000 },
    { "account": "2110101005", "description": "Obligaciones Laborales", "amount": 40000 },
    { "account": "2110101006", "description": "Anticipo de Clientes", "amount": 60000 },
    { "account": "2110101007", "description": "Dividendos por Pagar", "amount": 25000 },
    { "account": "2110101008", "description": "Cuentas por Pagar", "amount": 35000 },
    { "account": "2110101009", "description": "Préstamos Bancarios", "amount": 45000 },
    { "account": "2110101010", "description": "Obligaciones Fiscales", "amount": 15000 }
  ],

  "liabilityNoCurrentItems": [
    { "account": "2210101001", "description": "Hipotecas Largo Plazo", "amount": 100000 },
    { "account": "2210101002", "description": "Bonos Corporativos", "amount": 80000 },
    { "account": "2210101003", "description": "Préstamos Institucionales", "amount": 60000 },
    { "account": "2210101004", "description": "Obligaciones Pensionarias", "amount": 40000 },
    { "account": "2210101005", "description": "Créditos Refaccionarios", "amount": 50000 },
    { "account": "2210101006", "description": "Arrendamientos Financieros", "amount": 30000 },
    { "account": "2210101007", "description": "Pasivos Diferidos", "amount": 20000 },
    { "account": "2210101008", "description": "Instrumentos Convertibles", "amount": 35000 },
    { "account": "2210101009", "description": "Deuda Subordinada", "amount": 25000 },
    { "account": "2210101009", "description": "Deuda Subordinada", "amount": 25000 },
    { "account": "2210101009", "description": "Deuda Subordinada", "amount": 25000 },
    { "account": "2210101010", "description": "Obligaciones Subordinadas", "amount": 15000 }
  ],

  "equityItems": [
    { "account": "3110101001", "description": "Capital Social", "amount": 500000 },
    { "account": "3110101002", "description": "Reserva Legal", "amount": 80000 },
    { "account": "3110101003", "description": "Utilidades Retenidas", "amount": 120000 },
    { "account": "3110101004", "description": "Ajustes de Inflación", "amount": 30000 },
    { "account": "3110101005", "description": "Superávit de Capital", "amount": 45000 },
    { "account": "3110101006", "description": "Donaciones Capitalizadas", "amount": 15000 },
    { "account": "3110101007", "description": "Revalorización Patrimonial", "amount": 25000 },
    { "account": "3110101008", "description": "Resultados Acumulados", "amount": 60000 },
    { "account": "3110101009", "description": "Acciones Preferentes", "amount": 35000 },
    { "account": "3110101010", "description": "Excedentes1", "amount": 20000 },
    { "account": "3110101010", "description": "Excedentes2", "amount": 20000 },
    { "account": "3110101010", "description": "Excedentes3", "amount": 20000 },
    { "account": "3110101010", "description": "Excedentes4", "amount": 20000 },
  ]
}

export const BalanceGeneralTemplate = ({ records, inSus = false, dateRange }: Props) => {
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

  const allItems = [
    // SECCION ACTIVO
    { type: 'title', title: 'ACTIVO', total: '' },
    { type: 'header', title: 'ACTIVO CORRIENTE', total: records.totalActiveCurrent },
    ...records.activeCurrentItems,
    { type: 'header', title: 'ACTIVO NO CORRIENTE', total: records.totalActiveNoCurrent },
    ...records.activeNoCurrentItems,
    { type: 'result', title: 'TOTAL ACTIVO', total: records.totalActive },
    { type: 'break', title: '', total: '' },

    // SECCION PASIVO
    { type: 'title', title: 'PASIVO Y PATRIMONIO', total: '' },
    { type: 'title', title: 'PASIVO', total: '' },
    { type: 'header', title: 'PASIVO CORRIENTE', total: records.totalLiabilityCurrent },
    ...records.liabilityCurrentItems,
    { type: 'header', title: 'PASIVO NO CORRIENTE', total: records.totalLiabilityNoCurrent },
    ...records.liabilityNoCurrentItems,
    { type: 'result', title: 'TOTAL PASIVO', total: records.totalLiability },
    { type: 'break', title: '', total: '' },

    // SECCION PATRIMONIO
    { type: 'header', title: 'PATRIMONIO', total: records.totalEquity },
    ...records.equityItems,
    { type: 'result', title: 'TOTAL PATRIMONIO', total: records.totalEquity },
    { type: 'result', title: 'TOTAL PASIVO Y PATRIMONIO', total: records.totalLiabilityEquity },
  ];

  const paginatedRecords = paginatePDFContent(allItems, {
    firstPageCapacity: 27,
    otherPagesCapacity: 33,
    signatureFooterHeight: 6
  })

  return (
    <Document>
      {paginatedRecords.map((page, pageIndex) => (
        <Page size="LETTER" style={styles.page} key={pageIndex}>
          {/* primera pagina */}
          {
            pageIndex === 0 && (
              < View >
                <Image style={styles.imageOutOfBounds} src={REPORTS_LOGO_URL} />
                <View style={{ textAlign: "center" }}>
                  <Text style={[styles.thCell, { fontSize: 14, marginTop: 25 }]}>Balance General</Text>
                  <Text style={styles.thCell}>{messageDate}</Text>
                  <Text style={[styles.thCell, { marginBottom: 8 }]}>
                    (Expresado en {moneyType})
                  </Text>
                </View>
              </View>
            )
          }

          {/* Contenido principal paginado */}
          <View>
            {page.map((item, index) => renderItem(item, index))}
          </View>

          {/* seccion de la firma */}
          {pageIndex === paginatedRecords.length - 1 && (
            <>
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
            </>
          )}

          {/* Paginación */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => (
              `Página ${pageNumber} de ${totalPages}`
            )}
          />
        </Page>
      ))
      }
    </Document >
  )
}

const renderItem = (item: any, index: number) => {

  if (item.type === 'header') {
    return (
      <View key={`header-${index}`} style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
        <Text style={[styles.tdCell, styles.col85]}>{item.title}</Text>
        <Text style={[styles.tdCell, styles.col15, { textAlign: "right" }]}>
          {formatNumber(item.total)}
        </Text>
      </View>
    );
  }

  if (item.type === 'title') {
    return (
      <View key={`title-${index}`} style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
        <Text style={[styles.tdCell, styles.col100]}>{item.title}</Text>
      </View>
    );
  }

  if (item.type === 'result') {
    return (
      <View key={`result-${index}`} style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
        <Text style={[styles.tdCell, styles.col15]}>{" "}</Text>
        <Text style={[styles.tdCell, styles.col70]}>{item.title}</Text>
        <Text style={[styles.tdCell, styles.col15, { textAlign: "right" }]}>{formatNumber(item.total)}</Text>
      </View>
    );
  }

  if (item.type === 'break') {
    return (
      <View key={`break-${index}`} style={[styles.trCell]}>
        <Text style={[styles.tdCell, styles.col100]}>{" "}</Text>
      </View>
    );
  }

  return (
    <View style={styles.trCell} key={`row-${item.account}`}>
      <View style={[styles.tdCell, styles.col55]}><Text>{item.description}</Text></View>
      <View style={[styles.tdCell, styles.col15, { textAlign: "right" }]}>
        <Text>{item.amountDetail ? formatNumber(item.amountDetail) : ' '}</Text>
      </View>
      <View style={[styles.tdCell, styles.col15, { textAlign: "right" }]}>
        <Text>{formatNumber(item.amount)}</Text>
      </View>
      <View style={[styles.tdCell, styles.col15]}><Text>{" "}</Text></View>
    </View>
  );
};