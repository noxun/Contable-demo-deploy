import { PaySlip } from "@/lib/types";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

type PaySlipDocumentProps = {
  data: PaySlip;
};

const tw = createTw({});

export default function PaySlipDocument({ data }: PaySlipDocumentProps) {
  return (
    <Document>
      <Page size="LETTER" style={tw("p-4 flex text-base")}>
        {/* Fila datos header */}
        <View>
          <Text>NIT 375482020</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>BOLETA DE PAGO</Text>
          <Text>En bolivianos</Text>
        </View>

        {/* SEPARADOR 1 */}
        <View style={tw("w-full h-6")}></View>

        {/* Fila datos personales */}
        <View style={tw("flex flex-row")}>
          <View style={tw("w-[50%]")}>
            <View style={tw("flex flex-row")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>NOMBRE:</Text>
              <Text>{data.nameEmployee ?? ""}</Text>
            </View>
            <View style={tw("flex flex-row")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>CARGO:</Text>
              <Text>{data.position ?? ""}</Text>
            </View>
            <View style={tw("flex flex-row")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>F-INGRESO:</Text>
              <Text>{data.dateIncome ?? ""}</Text>
            </View>
          </View>
          <View style={tw("w-[50%]")}>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                SUELDO BÁSICO:
              </Text>
              <Text>{data.salary ?? ""}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                DIAS TRABAJADOS:
              </Text>
              <Text>{data.daysWorked ?? ""}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>MES:</Text>
              <Text>{data.month ?? ""}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>ANTIGÜEDAD:</Text>
              <Text>{data.antique ?? ""}</Text>
            </View>
          </View>
        </View>

        {/* SEPARADOR 2 */}
        <View style={tw("w-full h-6")}></View>

        {/* Fila datos ingresos y egresos */}
        <View style={tw("flex flex-row")}>
          <View style={tw("w-[50%]")}>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                backgroundColor: "#d1cece",
                textDecoration: "underline",
              }}
            >
              INGRESOS
            </Text>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                SALARIO BÁSICO
              </Text>
              <Text>{data.income.salary}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>ANTIGUEDAD</Text>
              <Text>{data.income.antique}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>HORAS EXTRA</Text>
              <Text>{data.income.overtime}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                COMISIONES U OTROS PAGOS
              </Text>
              <Text>{data.income.comminOtherPay}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                TOTAL INGRESOS
              </Text>
              <Text>{data.income.total}</Text>
            </View>
          </View>
          <View style={tw("w-[50%]")}>
            <Text
              style={{
                fontFamily: "Helvetica-Bold",
                backgroundColor: "#d1cece",
                textDecoration: "underline",
              }}
            >
              EGRESOS
            </Text>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>AFP</Text>
              <Text>{data.egress.afps}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>PRESTAMOS</Text>
              <Text>{data.egress.loans}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>ANTICIPOS</Text>
              <Text>{data.egress.advances}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                OTROS DESCUENTOS
              </Text>
              <Text>{data.egress.otherDcts}</Text>
            </View>
            <View style={tw("flex flex-row justify-between")}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                TOTAL EGRESOS
              </Text>
              <Text>{data.egress.total}</Text>
            </View>
          </View>
        </View>
        {/* Fila liquido pagable */}
        <View style={tw("flex flex-row w-full justify-between bg-[#d1cece]")}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            LIQUIDO PAGABLE (I-E)
          </Text>
          <Text>{data.liquidPayable}</Text>
        </View>
        {/* Fecha actual */}
        <View style={tw("w-full")}>
          <Text>
            {new Date().toLocaleDateString("es-BO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* SEPARADOR 3 */}
        <View style={tw("w-full h-20")}></View>

        {/* Fila firmas */}
        <View style={tw("flex flex-row w-full justify-evenly")}>
          <Text>TRABAJADOR</Text>
          <Text>GERENTE R.R.H.H.</Text>
          <Text>CONTABILIDAD</Text>
        </View>
      </Page>
    </Document>
  );
}
