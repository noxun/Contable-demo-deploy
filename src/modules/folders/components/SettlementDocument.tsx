/* eslint-disable jsx-a11y/alt-text */
import { Image, Document, Page } from "@react-pdf/renderer";
import View from "@/components/generatePdf/View";
import Text from "@/components/generatePdf/Text";
import { PaymentRoll } from "@/lib/trazoTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { User } from "@/lib/types";

const isQuotation = false;

type SettlementDocumentProps = {
  data: PaymentRoll;
  user: User;
};

export default function SettlementDocument({
  data,
  user,
}: SettlementDocumentProps) {
  const accountNumber = data?.accountNumber ?? "NO DISPONIBLE";
  return (
    <Document>
      <Page size="LETTER" style={{ padding: "20px" }}>
        <View flexDirection="column" borderContent>
          <View padding="4px" style={{ backgroundColor: "#d38c19" }}></View>
          <View flexDirection="column">
            <View
              justifyContent="space-between"
              alignItems="center"
              padding="4px 0"
            >
              <View width="25%">
                <Image src={REPORTS_LOGO_URL} style={{ height: "50px" }} />
              </View>
              <View
                width="60%"
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="flex-end"
              >
                <Text
                  color="#004080"
                  padding="0px 3px"
                  textAlign="end"
                  fontSize="16px"
                  bold
                >
                  {isQuotation ? "COTIZACIÓN" : "PLANILLA DE COBRANZA"}
                </Text>
                <Text
                  color="#d38c19"
                  padding="0px 3px"
                  fontSize="18px"
                  bold
                  textAlign="end"
                >
                  {isQuotation ? data.nroQuotation : data.codigoDeInterno}
                </Text>
                <Text fontSize="10px" padding="0px 3px" textAlign="end">
                  {format(new Date(), "'Santa Cruz' dd 'de' MMMM 'del' yyyy", {
                    locale: es,
                  })}
                </Text>
              </View>
            </View>
            <View
              border={{ top: true }}
              // style={{ marginTop: "5px" }}
            >
              <View width="65%" flexDirection="column">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    SEÑOR(ES):{" "}
                  </Text>
                  <Text padding="2px 3px">{data.senores}</Text>
                </Text>
              </View>
              <View width="35%">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    NIT:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.nit}</Text>
                </Text>
              </View>
            </View>
            <View
            // style={{ marginTop: "5px" }}
            >
              <View width="65%" flexDirection="column">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Doc. Embarque:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.docEmbarque}</Text>
                </Text>
              </View>
              <View width="35%">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Int. Agencia:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.intAgencia}</Text>
                </Text>
              </View>
            </View>

            <View
            // style={{ marginTop: "5px" }}
            >
              <View width="50%" flexDirection="column">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Facturas(s):{" "}
                  </Text>
                  <Text padding="2px 3px">{data.facturas}</Text>
                </Text>
              </View>
              <View width="25%">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Bultos:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.bultos}</Text>
                </Text>
              </View>
              <View width="25%">
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Peso:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.peso}</Text>
                </Text>
              </View>
            </View>
            <View
              flexDirection="column"
              // style={{ marginTop: "5px" }}
            >
              <View>
                <View width="50%">
                  <Text padding="2px 3px">
                    <Text padding="2px 3px" bold>
                      Proveedor/Emisor:{" "}
                    </Text>
                    <Text padding="2px 3px">{data.proveedor}</Text>
                  </Text>
                </View>
              </View>
              <Text padding="2px 3px">
                <Text padding="2px 3px" bold>
                  Mercadería:{" "}
                </Text>
                <Text padding="2px 3px">{data.mercancia}</Text>
              </Text>
            </View>
            <View border={{ top: true, bottom: true }}>
              <View width="13%" flexDirection="column">
                <Text padding="2px 3px" bold>
                  Valor FOB
                </Text>
                <Text padding="2px 3px" bold>
                  Fletes I,II
                </Text>
                <Text padding="2px 3px" bold>
                  Seguro
                </Text>
                <Text padding="2px 3px" bold>
                  Otros Gastos
                </Text>
                <Text padding="2px 3px" bold>
                  Valor CIF
                </Text>
                <Text padding="2px 3px" bold>
                  T.c.
                </Text>
                <Text padding="2px 3px" bold>
                  Valor CIF
                </Text>
              </View>
              <View width="5%" flexDirection="column">
                <Text padding="2px 3px">$us.</Text>
                <Text padding="2px 3px">$us.</Text>
                <Text padding="2px 3px">$us.</Text>
                <Text padding="2px 3px">$us.</Text>
                <Text padding="2px 3px">$us.</Text>
                <Text padding="2px 3px">{data.tc}</Text>
                <Text padding="2px 3px">Bs.</Text>
              </View>
              <View
                width="12%"
                flexDirection="column"
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Text padding="2px 3px">{data.valorFob}</Text>
                <Text padding="2px 3px">{data.flete1y2}</Text>
                <Text padding="2px 3px">{data.seguro}</Text>
                <Text padding="2px 3px">{data.otrosGastos}</Text>
                <Text padding="2px 3px">{data.valorCif}</Text>
                <Text padding="2px 3px"> </Text>
                <Text padding="2px 3px">{data.valorCifBs}</Text>
              </View>
              <View
                style={{ marginLeft: "5%" }}
                width="50%"
                flexDirection="column"
              >
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Aduana:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.aduana}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Modalidad:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.modalidad}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Items:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.items}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Tipo:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.tipo}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    DIM/DEX:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.dim}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Nro. de factura:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.nroFactura}</Text>
                </Text>
                <Text padding="2px 3px">
                  <Text padding="2px 3px" bold>
                    Fecha de Validación:{" "}
                  </Text>
                  <Text padding="2px 3px">{data.fechaValidacion}</Text>
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#dddddd" }}>
              <Text bold>A - Tributos y otros Conceptos Aduaneros</Text>
            </View>
            {data.aList.map(
              (element) =>
                element.description != null &&
                element.description !== "0" && (
                  <View justifyContent="space-between" key={element.id}>
                    <View width="50%">
                      <Text padding="2px 3px">
                        {element.label} {element.recibo ? "*" : ""}
                      </Text>
                    </View>
                    <View width="50%" justifyContent="flex-end">
                      <Text padding="2px 3px" textAlign="end">
                        {element.description}
                      </Text>
                    </View>
                  </View>
                )
            )}
            <View justifyContent="flex-end">
              <View width="10%">
                <Text padding="2px 3px" bold>
                  Sub Total:
                </Text>
              </View>
              <View width="20%" justifyContent="flex-end">
                <Text padding="2px 3px" bold textAlign="end">
                  {data.aSubTotal}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#dddddd" }}>
              <Text padding="2px 3px" bold>
                B - Otros Gastos de Importacion/Exportacion
              </Text>
            </View>
            {data.bList.map(
              (element) =>
                element.description != null &&
                element.description !== "0" && (
                  <View justifyContent="space-between" key={element.id}>
                    <View width="50%">
                      <Text padding="2px 3px">
                        {element.label} {element.recibo ? "*" : ""}
                      </Text>
                    </View>
                    <View width="50%" justifyContent="flex-end">
                      <Text padding="2px 3px" textAlign="end">
                        {element.description}
                      </Text>
                    </View>
                  </View>
                )
            )}
            <View justifyContent="flex-end">
              <View width="10%">
                <Text padding="2px 3px" bold>
                  Sub Total:
                </Text>
              </View>
              <View width="20%" justifyContent="flex-end">
                <Text padding="2px 3px" bold textAlign="end">
                  {data.bSubTotal}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#dddddd" }}>
              <Text padding="2px 3px" bold>
                C - Gastos de Operaciones
              </Text>
            </View>
            {data.cList.map(
              (element) =>
                element.description != null &&
                element.description !== "0" && (
                  <View justifyContent="space-between" key={element.id}>
                    <View width="50%">
                      <Text padding="2px 3px">
                        {element.label} {element.recibo ? "*" : ""}
                      </Text>
                    </View>
                    <View width="50%" justifyContent="flex-end">
                      <Text padding="2px 3px" textAlign="end">
                        {element.description}
                      </Text>
                    </View>
                  </View>
                )
            )}
            <View justifyContent="flex-end">
              <View width="10%">
                <Text padding="2px 3px" bold>
                  Sub Total:
                </Text>
              </View>
              <View width="20%" justifyContent="flex-end">
                <Text padding="2px 3px" bold textAlign="end">
                  {data.cSubTotal}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#dddddd" }}>
              <Text padding="2px 3px" bold>
                D - Honorarios Profesionales
              </Text>
            </View>
            {data.dList.map(
              (element) =>
                element.description != null &&
                element.description !== "0" && (
                  <View justifyContent="space-between" key={element.id}>
                    <View width="50%">
                      <Text padding="2px 3px">
                        {element.label} {element.recibo ? "*" : ""}
                      </Text>
                    </View>
                    <View width="50%" justifyContent="flex-end">
                      <Text padding="2px 3px" textAlign="end">
                        {element.description}
                      </Text>
                    </View>
                  </View>
                )
            )}
            <View justifyContent="flex-end">
              <View width="10%">
                <Text padding="2px 3px" bold>
                  Sub Total:
                </Text>
              </View>
              <View width="20%" justifyContent="flex-end">
                <Text padding="2px 3px" bold textAlign="end">
                  {data.dSubTotal}
                </Text>
              </View>
            </View>
            <View
              flexDirection="column"
              padding="5px"
              border={{ top: true, bottom: true }}
              style={{ marginTop: "5px" }}
            >
              <View justifyContent="flex-end">
                <View width="17%">
                  <Text padding="3px 3px" bold>
                    Total Planilla $us. 6.85
                  </Text>
                </View>
                <View borderContent width="20%" justifyContent="flex-end">
                  <Text padding="3px 3px" bold textAlign="end">
                    {data.totalProformaSus}
                  </Text>
                </View>
              </View>
              <View justifyContent="flex-end">
                <View width="14%">
                  <Text padding="3px 3px" bold>
                    Total Planilla (Bs.)
                  </Text>
                </View>
                <View
                  border={{ right: true, left: true, bottom: true }}
                  width="20%"
                  justifyContent="flex-end"
                >
                  <Text padding="3px 3px" bold textAlign="end">
                    {data.totalProformaBs}
                  </Text>
                </View>
              </View>
              <View justifyContent="flex-end">
                <View width="25%">
                  <Text padding="3px 3px" bold>
                    Gastos pagados por el importador
                  </Text>
                </View>
                <View
                  border={{ right: true, left: true, bottom: true }}
                  width="20%"
                  justifyContent="flex-end"
                >
                  <Text padding="3px 3px" bold textAlign="end">
                    {data.otherChargesPaidByTheImporter}
                  </Text>
                </View>
              </View>
              <View justifyContent="flex-end">
                <View width="12%">
                  <Text padding="3px 3px" bold>
                    Total Anticipos
                  </Text>
                </View>
                <View
                  border={{ right: true, left: true, bottom: true }}
                  width="20%"
                  justifyContent="flex-end"
                >
                  <Text padding="3px 3px" bold textAlign="end">
                    {data.totalAdvancePayments}
                  </Text>
                </View>
              </View>

              <View justifyContent="flex-end">
                {parseFloat(data.balanceOfPayroll ?? 0) < 0 ? (
                  <View width="19%">
                    <Text padding="3px 3px" bold>
                      Saldo a favor Cliente (Bs.)
                    </Text>
                  </View>
                ) : parseFloat(data.balanceOfPayroll ?? 0) > 0 ? (
                  <View width="20%">
                    <Text padding="3px 3px" bold>
                      Saldo a favor Agencia (Bs.)
                    </Text>
                  </View>
                ) : (
                  <View width="9%">
                    <Text padding="3px 3px" bold>
                      Saldo (Bs.)
                    </Text>
                  </View>
                )}

                <View
                  border={{ right: true, left: true, bottom: true }}
                  width="20%"
                  justifyContent="flex-end"
                >
                  <Text padding="3px 3px" bold textAlign="end">
                    {data.balanceOfPayroll &&
                    parseFloat(data.balanceOfPayroll) >= 0
                      ? data.balanceOfPayroll
                      : (data.balanceOfPayroll ?? "0").replace("-", "")}
                  </Text>
                </View>
              </View>
            </View>
            {data.clarifications ? (
              <Text padding="2px 3px" color="#004080" fontSize="7px" bold>
                ACLARACIONES: {data.clarifications}
              </Text>
            ) : null}
            <View>
              <View width="50%" flexDirection="column">
                <Text padding="2px 3px" color="#004080" bold>
                  BANCO UNION S.A. (Cta. Corriente)
                </Text>
                <Text padding="2px 3px">Cuenta En Bs.: {accountNumber}</Text>
                <Text padding="2px 3px">NOXUN S.R.L</Text>
              </View>
              <View width="50%" flexDirection="column">
                <Text padding="2px 3px">
                  Elaborado por: {user?.name} {user?.fatherLastName}{" "}
                  {user?.motherLastName}{" "}
                </Text>
                <Text padding="2px 3px">NIT: 375482020</Text>
                <Text padding="2px 3px">SWIFT: BAUNBO22</Text>
              </View>
            </View>
            <Text padding="2px 3px" fontSize="7px">
              Nota.: La presente Proforma esta sujeta a Cambio dentro del plazo
              requerido por Noxun SRL por variacion en el T./C.
            </Text>
          </View>
          <View
            flexDirection="column"
            padding="4px 0"
            justifyContent="center"
            alignItems="center"
            style={{ backgroundColor: "#002747" }}
          >
            <Text padding="2px 3px" color="white">
              4to. Anillo entre Av. Banzer y Beni Calle Tristan
              Languidey Nro. 19
            </Text>
            <Text padding="2px 3px" color="white">
              Teléfono: (591)3-3406135 Teléfono: (591)3-385332 - (591)3-3852168
            </Text>
          </View>
        </View>
      </Page>
      {isQuotation && (
        <Page size="A4" style={{ padding: "20px" }}>
          <View flexDirection="column" borderContent>
            <View padding="4px" style={{ backgroundColor: "#d38c19" }}></View>
            <View flexDirection="column">
              <View
                justifyContent="center"
                alignItems="center"
                padding="2px 0"
                width="100%"
              >
                <Text
                  padding="10px 3px 2px"
                  textAlign="center"
                  bold
                  fontSize="11px"
                >
                  CONDICIONES GENERALES
                </Text>
              </View>
              <TextSubTitle text="BASE LEGAL" />
              {[
                "• Art. 42 del Capítulo III de la Ley General de Aduanas Nº 1990 define al Despachante de Aduana como la persona natural y profesional auxiliar de la función pública aduanera, autorizado por la Aduana Nacional para realizar gestiones inherentes a operaciones de comercio exterior por cuenta de terceros.",
                "• Art. 46 del Capítulo III de la Ley General de Aduanas Nº 1990 establece que el Despachante de Aduana y la Agencia Despachante de Aduana realizan su labor bajo el principio de buena fe y presunción de veracidad, por cuenta del comitente o consignatario de las mercancías.",
                "• Art. 48 de la Ley General de Aduanas Nº 1990 indica que el Despachante y la Agencia Despachante de Aduana, solo a efectos de la valoración aduanera, se regirán por lo dispuesto en el Acuerdo del GATT – 1994, y no asumirán responsabilidad sobre la veracidad y exactitud de la Declaración Jurada del Valor en Aduanas, la cual debe ser realizada por el importador.",
                "• Art. 51 del Capítulo III de la Ley General de Aduanas Nº 1990 señala que la Agencia Despachante de Aduana, mediante su representante legal (el Despachante de Aduana), podrá constituirse y apelar al cumplimiento de las normas vigentes bajo cualquiera de las formas jurídicas reconocidas por el Código de Comercio.",
                "• Art. 111 del Reglamento a la Ley General de Aduanas (D.S. 25870) estipula la documentación necesaria con carácter obligatorio para realizar la declaración de mercancías correspondiente, la cual será puesta a disposición y revisión de la Administración Aduanera de turno. Art. 20 del Reglamento a la Ley General de Aduanas (D.S. 25870) estipula el criterio por el cual se determina la base imponible sobre la cual se realizará el pago correspondiente de la tributación aduanera.",
              ].map((data, index) => (
                <TextParagraph key={index} text={data} />
              ))}
              <TextSubTitle text="BASE CONTRACTUAL" />
              {[
                "• El presente documento es emitido conforme solicitud del comitente o consignatario a partir de la presentación de documentación soporte suficiente para determinar lo estipulado según Art. 20 del Reglamento a la Ley General de Aduanas D.S. 25870.",
                "• La validez del presente documento tiene una duración de 7 días calendario a partir de la fecha de emisión, siempre y cuando los valores finales de la documentación soporte no sufran ningún cambio en relación a la cotización de monedas vigente emitida por el Banco Central de Bolivia y exigida por Aduana Nacional.",
                "• La presente proforma/cotización en ninguno de los casos ampara transporte de mercadería antes y después de las gestiones dentro del Recinto Aduanero de turno, siendo esta responsabilidad exclusiva del comitente, consignatario y/o agente de carga contratado directamente por el comitente o consignatario.",
                "• El presente documento queda sujeto a modificación sin previo aviso por parte de la Agencia Despachante de Aduana NOXUN SRL, estableciendo que los valores que cite el mismo son temporales y/o aproximados.",
                "• Las proformas/cotizaciones están expresadas en dólares al tipo de cambio a la fecha de la emisión del documento; en caso que este cambiara, la deuda se actualizará en moneda extranjera dólares.",
                "• El pago de la siguiente cotización/proforma por transferencia, efectivo, depósito, cheque o cualquier otro medio genera la aceptación de la misma, sujetándose el comitente, consignatario o intermediario a las condiciones antes estipuladas sin derecho a reclamos posteriores.",
                "• El valor final del presente documento debe ser cancelado a las siguientes cuentas habilitadas:",
              ].map((data, index) => (
                <TextParagraph
                  key={index}
                  text={data}
                  color={index === 2 ? "#ff0000" : undefined}
                />
              ))}
              <TextSubTitle text="CUENTAS NOXUN SRL BANCO UNION S.A. MONEDA NACIONAL (Bolivianos)" />
              {[
                "a)	10000030319095",
                "b)	10000030108464",
                "c)	10000030318930",
                "d)	10000030319045",
              ].map((data, index) => (
                <TextParagraph padding="2px 20px" key={index} text={data} />
              ))}
              {[
                "- Enviar recibo escaneado a los correos una vez realizado el depósito.",
              ].map((data, index) => (
                <TextParagraph padding="24px 5px" key={index} text={data} />
              ))}
            </View>
            <View padding="40px"></View>
          </View>
        </Page>
      )}
    </Document>
  );
}

const TextParagraph = ({
  text,
  padding = "5px 10px",
  color = "#1a1a1a",
}: {
  text: string;
  padding?: string;
  color?: string;
}) => {
  return (
    <View>
      <Text padding={padding} fontSize="10px" color={color} textAlign="justify">
        {text}
      </Text>
    </View>
  );
};

const TextSubTitle = ({ text }: { text: string }) => {
  return (
    <View padding="5px 10px 5px">
      <Text
        padding="0px"
        textAlign="center"
        bold
        fontSize="10px"
        style={{
          marginBottom: "1px",
          borderBottom: "1px solid black",
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </View>
  );
};
