/* eslint-disable jsx-a11y/alt-text */
"use client"
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

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
    width: "100%",
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 13,
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
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
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
    height: "1.5cm",
    objectFit: 'cover',
  },
});

interface DateRange {
  from: string;
  to: string;
}

interface Props {
  inSus?: boolean;
  records?: any;
  dateRange?: DateRange;
}

export const EstadoResultadosTemplate = ({ dateRange, inSus }: Props) => {
  const messageDate =
    dateRange?.from === dateRange?.to
      ? dateRange?.from
      : `${dateRange?.from} al ${dateRange?.to}`;
  const moneyType = inSus ? "Dolares" : "Bolivianos";

  const gastoType = inSus ? "totalSus" : "totalBs";

  const mockData = {
    ingresos: [
      {
        account: "1231233",
        accountName: "Ventas",
        totalSus: 1231,
        totalBs: 534654
      },
      {
        account: "1231234",
        accountName: "Ingresos por Servicios",
        totalSus: 874,
        totalBs: 38974
      },
      {
        account: "1231235",
        accountName: "Ingresos Diversos",
        totalSus: 543,
        totalBs: 28976
      },
      {
        account: "1231236",
        accountName: "Ingresos por Alquileres",
        totalSus: 320,
        totalBs: 15000
      },
      {
        account: "1231237",
        accountName: "Ingresos por Intereses",
        totalSus: 450,
        totalBs: 21300
      }
    ],
    gastos: [
      {
        account: "987234",
        accountName: "Costo de Ventas",
        totalSus: 9898,
        totalBs: 98732
      },
      {
        account: "987235",
        accountName: "Sueldos y Salarios",
        totalSus: 7500,
        totalBs: 102300
      },
      {
        account: "987236",
        accountName: "Servicios Básicos",
        totalSus: 1500,
        totalBs: 10000
      },
      {
        account: "987237",
        accountName: "Mantenimiento",
        totalSus: 2200,
        totalBs: 15600
      },
      {
        account: "987238",
        accountName: "Publicidad",
        totalSus: 1800,
        totalBs: 12500
      },
      {
        account: "987239",
        accountName: "Transporte",
        totalSus: 500,
        totalBs: 3500
      },
      {
        account: "987240",
        accountName: "Gastos de Oficina",
        totalSus: 1200,
        totalBs: 8700
      },
      {
        account: "987241",
        accountName: "Capacitación",
        totalSus: 1000,
        totalBs: 6500
      },
      {
        account: "987242",
        accountName: "Gastos Legales",
        totalSus: 900,
        totalBs: 5600
      },
      {
        account: "987243",
        accountName: "Donaciones",
        totalSus: 300,
        totalBs: 2500
      }
    ],
    totales: {
      totalGastoBs: 2934,
      totalGastoSus: 543,
      totalIngresosBs: 6545,
      totalIngresosSus: 984,
      impuestosBs: 1298,
      impuestosSus: 7834,
    }
  };



  return (
    <Document>
      <Page style={styles.page} orientation="landscape">
        {/* <View>
          <Image
            style={styles.imageOutOfBounds}
            src="/images/tradecruz_logo.png"
          />
        </View> */}

        <View style={[styles.header, { paddingBottom: 10 }]}>
          <Text style={[styles.thCell, { fontSize: 20, }]}>Balance General</Text>
          <Text style={[styles.thCell]}>{messageDate} Por el periodo terminado de 2024</Text>
          <Text style={[styles.thCell]}>(Expresado en {moneyType})</Text>
        </View>

        <View style={styles.table}>
          <View>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Gastos</Text>
              <Text style={[styles.thCell, styles.col20]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                mockData.gastos.map((entry, index) => {
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.accountName}</Text>
                      <Text style={[styles.tdCell, styles.col20]}>{entry[gastoType]}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>

          <View>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Ingresos</Text>
              <Text style={[styles.thCell, styles.col20]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                mockData.ingresos.map((entry, index) => {
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.accountName}</Text>
                      <Text style={[styles.tdCell, styles.col20]}>{entry[gastoType]}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </View>

        <View style={[styles.trCell, styles.table]}>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Gastos</Text>
            <Text style={[styles.thCell, styles.col20]}>98234</Text>
          </View>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Ingresos</Text>
            <Text style={[styles.thCell, styles.col20]}>76534</Text>
          </View>
        </View>

        <View style={[styles.table, { paddingTop: 10, justifyContent: "flex-end" }]}>
          <View style={[styles.col50]}>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col60]}>Utilidad del Periodo (Antes de impuestos)</Text>
              <Text style={[styles.thCell, styles.col20]}>76534</Text>
            </View>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col60]}>Impuestos a las Utilidades</Text>
              <Text style={[styles.thCell, styles.col20]}>76534</Text>
            </View>
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col60]}>Resultado de la Gestión</Text>
              <Text style={[styles.thCell, styles.col20]}>76534</Text>
            </View>
          </View>
        </View>



      </Page>
    </Document>
  )
}