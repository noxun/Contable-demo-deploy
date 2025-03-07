import { REPORTS_LOGO_URL } from "@/lib/constants";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

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
    fontSize: 10,
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
    backgroundColor: "#E0E0E0",
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
  col10: { width: "10%" },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col25: { width: "25%" },
  col35: { width: "35%" },
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

const mockUpDeDatos = {
  "estadoDeFlujosDeEfectivoDirecto": {
    "nombre": "Flujos de efectivo directo",
    "items": [
      { "descripcion": "Cobros a clientes", "valor_2021": 3945053, "valor_2020": 3502000 },
      { "descripcion": "Otros cobros", "valor_2021": 171938, "valor_2020": 112524 },
      { "descripcion": "Pagos por compras", "valor_2021": -2395158, "valor_2020": -2183200 },
      { "descripcion": "Pagos por gastos de administración", "valor_2021": -130247, "valor_2020": -122317 },
      { "descripcion": "Pagos por gastos de comercialización", "valor_2021": -467043, "valor_2020": -430843 },
      { "descripcion": "Pagos por gastos financieros", "valor_2021": -106312, "valor_2020": -113575 },
      { "descripcion": "Pagos por impuestos", "valor_2021": -92679, "valor_2020": -80455 },
      { "descripcion": "Otros pagos", "valor_2021": -146929, "valor_2020": -158207 }
    ],
    "total": { "valor_2021": 254168, "valor_2020": 232627 }
  }
}

export const CashFlowTemplate = () => {
  const messageDate = 'Del 2024 al 2025'
  const { estadoDeFlujosDeEfectivoDirecto: mock } = mockUpDeDatos
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Cabecera del header */}
        <View>
          <Image style={styles.imageOutOfBounds} src={REPORTS_LOGO_URL} />
          <View style={{ textAlign: "center" }}>
            <Text style={[styles.txtHeader, { marginTop: 25 }]}>ESTADO DE RESULTADOS</Text>
            <Text style={styles.txtHeader}>{messageDate}</Text>
            <Text style={[styles.txtHeader, { marginBottom: 8 }]}>
              (Expresado en Bolivianos)
            </Text>
          </View>
        </View>

        {/* Tabla de Contenido */}
        <View style={styles.border}>
          <View style={[styles.trHead, styles.border_b]}>
            <View style={[styles.border_r, styles.thCell, styles.col100]}><Text>Estado de Resultados</Text></View>
            <View style={[styles.border_r, styles.thCell, styles.col15]}><Text>2021</Text></View>
            <View style={[styles.thCell, styles.col15]}><Text>2022</Text></View>
          </View>

          {
            mock.items.map((item, index) => (
              <View style={styles.trCell} key={index}>
                <View style={[styles.border_r_td, styles.border_b_td, styles.col100]}>
                  <Text style={[styles.tdCell]}>{item.descripcion}</Text>
                </View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.col15]}>
                  <Text style={[styles.tdCell, styles.txtRight]}>{item.valor_2020}</Text>
                </View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.col15]}>
                  <Text style={[styles.tdCell, styles.txtRight]}>{item.valor_2021}</Text>
                </View>
              </View>
            ))
          }
          <View style={styles.trCell}>
            <View style={styles.col100}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold", paddingLeft: 10 }]}>Total</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, styles.txtRight, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2020}</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, styles.txtRight, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2021}</Text></View>
          </View>
        </View>
      </Page>

      <Page size="LETTER" style={styles.page}>
        {/* Cabecera del header */}
        <View>
          <Image style={styles.imageOutOfBounds} src={REPORTS_LOGO_URL} />
          <View style={{ textAlign: "center" }}>
            <Text style={[styles.txtHeader, { marginTop: 25 }]}>BALANCE GENERAL</Text>
            <Text style={styles.txtHeader}>{messageDate}</Text>
            <Text style={[styles.txtHeader, { marginBottom: 8 }]}>
              (Expresado en Bolivianos)
            </Text>
          </View>
        </View>

        {/* Tabla de Contenido */}
        <View style={styles.border}>
          <View style={[styles.trHead, styles.border_b]}>
            <View style={[styles.border_r, styles.thCell, styles.col100]}><Text>Descripcion</Text></View>
            <View style={[styles.border_r, styles.thCell, styles.col15]}><Text>2021</Text></View>
            <View style={[styles.thCell, styles.col15]}><Text>2022</Text></View>
          </View>

          {
            mock.items.map((item, index) => (
              <View style={styles.trCell} key={index}>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col100]}><Text>{item.descripcion}</Text></View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col15]}><Text>{item.valor_2020}</Text></View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col15]}><Text>{item.valor_2021}</Text></View>
              </View>
            ))
          }
          <View style={styles.trCell}>
            <View style={styles.col100}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>Total</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2020}</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2021}</Text></View>
          </View>
        </View>
      </Page>

      <Page size="LETTER" style={styles.page}>
        {/* Cabecera del header */}
        <View>
          <Image style={styles.imageOutOfBounds} src={REPORTS_LOGO_URL} />
          <View style={{ textAlign: "center" }}>
            <Text style={[styles.txtHeader, { marginTop: 25 }]}>FLUJO DE EFECTIVO</Text>
            <Text style={styles.txtHeader}>{messageDate}</Text>
            <Text style={[styles.txtHeader, { marginBottom: 8 }]}>
              (Expresado en Bolivianos)
            </Text>
          </View>
        </View>

        {/* Tabla de Contenido */}
        <View style={styles.border}>
          <View style={[styles.trHead, styles.border_b]}>
            <View style={[styles.border_r, styles.thCell, styles.col100]}><Text>Descripcion</Text></View>
            <View style={[styles.border_r, styles.thCell, styles.col15]}><Text>2021</Text></View>
            <View style={[styles.thCell, styles.col15]}><Text>2022</Text></View>
          </View>

          {
            mock.items.map((item, index) => (
              <View style={styles.trCell} key={index}>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col100]}><Text>{item.descripcion}</Text></View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col15]}><Text>{item.valor_2020}</Text></View>
                <View style={[styles.border_r_td, styles.border_b_td, styles.tdCell, styles.col15]}><Text>{item.valor_2021}</Text></View>
              </View>
            ))
          }
          <View style={styles.trCell}>
            <View style={styles.col100}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>Total</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2020}</Text></View>
            <View style={styles.col15}><Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" }]}>{mock.total.valor_2021}</Text></View>
          </View>
        </View>
      </Page>
    </Document>
  )
}