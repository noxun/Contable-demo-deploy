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
  dateRange: DateRange;
}


export const BalanceGeneralTemplate = ({ inSus = false, dateRange }: Props) => {
  const exampleData = {
    activo: [
      {
        account: "Caja Chica",
        codeAccount: "101001123",
        montoTotalBs: 1450,
        montoTotalSus: 145,
      },
      {
        account: "Banco Central",
        codeAccount: "101002456",
        montoTotalBs: 9850,
        montoTotalSus: 1250,
      },
      {
        account: "Cuentas por Cobrar Clientes",
        codeAccount: "101003789",
        montoTotalBs: 4580,
        montoTotalSus: 520,
      },
      {
        account: "Inventario de Mercancías",
        codeAccount: "101004234",
        montoTotalBs: 3250,
        montoTotalSus: 380,
      },
      {
        account: "Terrenos",
        codeAccount: "101005678",
        montoTotalBs: 54000,
        montoTotalSus: 7700,
      },
      {
        account: "Maquinarias",
        codeAccount: "101006543",
        montoTotalBs: 12500,
        montoTotalSus: 1750,
      },
      {
        account: "Mobiliario",
        codeAccount: "101007321",
        montoTotalBs: 7500,
        montoTotalSus: 980,
      },
      {
        account: "Equipo de Computación",
        codeAccount: "101008654",
        montoTotalBs: 6000,
        montoTotalSus: 720,
      },
      {
        account: "Vehículos Comerciales",
        codeAccount: "101009876",
        montoTotalBs: 11000,
        montoTotalSus: 1450,
      },
      {
        account: "Depósitos a Plazo Fijo",
        codeAccount: "101010345",
        montoTotalBs: 30000,
        montoTotalSus: 4400,
      },
    ],
    pasivo: [
      {
        account: "Proveedores Nacionales",
        codeAccount: "201001987",
        montoTotalBs: 28000,
        montoTotalSus: 4200,
      },
      {
        account: "Préstamos Bancarios",
        codeAccount: "201002654",
        montoTotalBs: 15000,
        montoTotalSus: 2300,
      },
      {
        account: "Impuestos por Pagar",
        codeAccount: "201003321",
        montoTotalBs: 7500,
        montoTotalSus: 850,
      },
      {
        account: "Acreedores Diversos",
        codeAccount: "201004876",
        montoTotalBs: 8900,
        montoTotalSus: 950,
      },
      {
        account: "Cuentas por Pagar a Largo Plazo",
        codeAccount: "201005432",
        montoTotalBs: 22000,
        montoTotalSus: 3200,
      },
      {
        account: "Salarios por Pagar",
        codeAccount: "201006765",
        montoTotalBs: 6500,
        montoTotalSus: 730,
      },
    ],
    patrimonio: [
      {
        account: "Capital Social",
        codeAccount: "301001123",
        montoTotalBs: 50000,
        montoTotalSus: 7000,
      },
      {
        account: "Reservas Legales",
        codeAccount: "301002456",
        montoTotalBs: 15000,
        montoTotalSus: 2100,
      },
      {
        account: "Resultados del Ejercicio",
        codeAccount: "301003789",
        montoTotalBs: 18000,
        montoTotalSus: 2500,
      },
      {
        account: "Resultados Acumulados",
        codeAccount: "301004321",
        montoTotalBs: 12000,
        montoTotalSus: 1600,
      },
      {
        account: "Donaciones",
        codeAccount: "301005876",
        montoTotalBs: 8000,
        montoTotalSus: 1000,
      },
    ],
    totales: {
      ActivoBs: 138130,
      ActivoSus: 18395,
      PasivoBs: 87900,
      PasivoSus: 12230,
      PatrimonioBs: 103000,
      PatrimonioSus: 14200,
    },
  };
  const moneyType = inSus ? "Dolares" : "Bolivianos";
  const messageDate =
    dateRange.from === dateRange.to
      ? dateRange.from
      : `${dateRange.from} al ${dateRange.to}`;

  const totalActivo = inSus ? 'montoTotalSus' : 'montoTotalBs';
  const totalPasivo = inSus ? 'ActivoSus' : 'ActivoBs';
  const totalPatrimonio = inSus ? 'ActivoSus' : 'ActivoBs';
  let sumTotalActivo = 0;
  let sumTotalPasivo = 0;
  let sumTotalPatrimonio = 0;

  return (
    <Document >
      <Page size={"LETTER"} orientation="landscape" style={styles.page}>
        <View>
          <Image
            style={styles.imageOutOfBounds}
            src="/images/tradecruz_logo.png"
          />
        </View>

        <View style={[styles.header, { paddingBottom: 10 }]}>
          <Text style={[styles.thCell, { fontSize: 20, }]}>Balance General</Text>
          <Text style={[styles.thCell]}>{messageDate}</Text>
          <Text style={[styles.thCell]}>(Expresado en {moneyType})</Text>
        </View>

        <View style={styles.table}>
          <View style={[{ width: "100%" }]} >
            <View style={[styles.trCell]}>
              <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
              <Text style={[styles.thCell, styles.col60]}>Activo</Text>
              <Text style={[styles.thCell, styles.col20]}>Monto</Text>
            </View>
            <View style={{ textAlign: "left" }}>
              {
                exampleData.activo.map((entry, index) => {
                  sumTotalActivo += entry[totalActivo];
                  return (
                    <View style={styles.trCell} key={index}>
                      <Text style={[styles.tdCell, styles.col20]}>{entry.codeAccount}</Text>
                      <Text style={[styles.tdCell, styles.col60]}>{entry.account}</Text>
                      <Text style={[styles.tdCell, styles.col20]}>{entry[totalActivo]}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View style={[{ width: "100%", paddingBottom: 20 }]}>
            <View>
              <View style={[styles.trCell]}>
                <Text style={[styles.thCell, styles.col20]}>Cuenta</Text>
                <Text style={[styles.thCell, styles.col60]}>Pasivo</Text>
                <Text style={[styles.thCell, styles.col20]}>Monto</Text>
              </View>
              <View style={{ textAlign: "left" }}>
                {
                  exampleData.pasivo.map((entry, index) => {
                    sumTotalPasivo += entry[totalActivo];
                    return (
                      <View style={styles.trCell} key={index}>
                        <Text style={[styles.tdCell, styles.col20]}>{entry.codeAccount}</Text>
                        <Text style={[styles.tdCell, styles.col60]}>{entry.account}</Text>
                        <Text style={[styles.tdCell, styles.col20]}>{entry[totalActivo]}</Text>
                      </View>
                    )
                  })
                }
                <View style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
                  <Text style={[styles.tdCell, styles.col20,]} />
                  <Text style={[styles.tdCell, styles.col60]}>Total Pasivo</Text>
                  <Text style={[styles.tdCell, styles.col20]}>{totalPasivo}</Text>
                </View>
              </View>

            </View>

            <View style={{ paddingTop: 20 }}>
              <View style={[styles.trCell]}>
                <Text style={[styles.thCell, styles.col20]}></Text>
                <Text style={[styles.thCell, styles.col80]}>Patrimonio Neto</Text>
              </View>
              <View style={{ textAlign: "left" }}>
                {
                  exampleData.patrimonio.map((entry, index) => {
                    sumTotalPatrimonio += entry[totalActivo];
                    return (
                      <View style={styles.trCell} key={index}>
                        <Text style={[styles.tdCell, styles.col20]}>{entry.codeAccount}</Text>
                        <Text style={[styles.tdCell, styles.col60]}>{entry.account}</Text>
                        <Text style={[styles.tdCell, styles.col20]}>{entry[totalActivo]}</Text>
                      </View>
                    )
                  })
                }
                <View style={[styles.trCell, { fontFamily: "Helvetica-Bold" }]}>
                  <Text style={[styles.tdCell, styles.col20,]} />
                  <Text style={[styles.tdCell, styles.col60]}>Total Patrimonio Neto</Text>
                  <Text style={[styles.tdCell, styles.col20]}>{sumTotalPatrimonio}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.trCell, styles.table]}>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Activo</Text>
            <Text style={[styles.thCell, styles.col20]}>{sumTotalActivo}</Text>
          </View>
          <View style={[styles.trCell, styles.col50]}>
            <Text style={styles.col20} />
            <Text style={[styles.thCell, styles.col60]}>Total Pasivo y Patrimonio Neto</Text>
            <Text style={[styles.thCell, styles.col20]}>{(sumTotalPasivo + sumTotalPatrimonio)}</Text>
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

      </Page >
    </Document >
  )
}