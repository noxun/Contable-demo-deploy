import { HeritageEvaluationData } from "@/lib/types";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { Fragment } from "react";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({});

type HeritageEvaluationPDFProps = {
  data: HeritageEvaluationData;
};

export default function HeritageEvaluationPDF({
  data,
}: HeritageEvaluationPDFProps) {
  const tableData = [...(data?.items ?? []), data.resultFinal];

  return (
    <Document>
      <Page style={tw("flex")}>
        {/* HEADER */}
        <View style={tw("flex items-center")}>
          <Text>EVOLUCION DEL PATRIMONIO NETO</Text>
          <Text>
            Por el ejercicio comprendido desde el {data.initDate} al{" "}
            {data.endDate}
          </Text>
          <Text>(Expresado en {data.inSus ? "dolares" : "bolivianos"})</Text>
        </View>
        {/* TABLE HEADER */}
        <View style={tw("w-full flex flex-row")}>
          <View style={tw("w-[16%]")}>
            <Text>CONCEPTO</Text>
          </View>
          <View style={tw("w-[16%]")}>
            <Text>CAPITAL SOCIAL</Text>
          </View>
          <View style={tw("w-[16%]")}>
            <Text>AJUSTE DE CAPITAL</Text>
          </View>
          <View style={tw("w-[16%]")}>
            <Text>RESERVA LEGAL</Text>
          </View>
          <View style={tw("w-[16%]")}>
            <Text>RESULTADOS ACUMULADOS</Text>
          </View>
          <View style={tw("w-[16%]")}>
            <Text>TOTAL</Text>
          </View>
        </View>
        {/* TABLE BODY */}
        <View style={tw("w-full flex")}>
          {tableData.map((item, index) => (
            <View style={tw("flex flex-row")} key={index}>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldDateText}</Text>
              </View>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldPaidCapital}</Text>
              </View>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldCapitalAdjust}</Text>
              </View>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldLegalReserv}</Text>
              </View>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldCumulResults}</Text>
              </View>
              <View style={tw("w-[16%]")}>
                <Text>{item.sldNetWorth}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
