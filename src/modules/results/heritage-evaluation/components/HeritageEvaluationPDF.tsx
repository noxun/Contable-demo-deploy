/* eslint-disable jsx-a11y/alt-text */
import { REPORTS_LOGO_URL } from "@/lib/constants";
import { HeritageEvaluationData } from "@/lib/types";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
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
      <Page style={[tw("flex text-xs w-full"), { padding: "1cm" }]}>
        <Image
          src={REPORTS_LOGO_URL}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "1.4cm",
            objectFit: "cover",
          }}
        />
        {/* HEADER */}
        <View style={tw("flex items-center text-lg")}>
          <Text>EVOLUCIÓN DEL PATRIMONIO NETO</Text>
          <Text>
            Por el ejercicio comprendido desde el {data.initDate} al{" "}
            {data.endDate}
          </Text>
          <Text>(Expresado en {data.inSus ? "dolares" : "bolivianos"})</Text>
        </View>
        {/* TABLE HEADER */}
        <View style={tw("w-full flex flex-row border")}>
          <View style={tw("w-[20%] border")}>
            <Text>CONCEPTO</Text>
          </View>
          <View style={tw("w-[16%] border")}>
            <Text>CAPITAL SOCIAL</Text>
          </View>
          <View style={tw("w-[16%] border")}>
            <Text>AJUSTE DE CAPITAL</Text>
          </View>
          <View style={tw("w-[16%] border")}>
            <Text>RESERVA LEGAL</Text>
          </View>
          <View style={tw("w-[16%] border")}>
            <Text>RESULTADOS ACUMULADOS</Text>
          </View>
          <View style={tw("w-[16%] border")}>
            <Text>TOTAL</Text>
          </View>
        </View>
        {/* TABLE BODY */}
        <View style={tw("w-full flex border")}>
          {tableData.map((item, index) => (
            <View style={tw("flex flex-row")} key={index}>
              <View style={tw("w-[20%] border")}>
                <Text>{item.sldDateText}</Text>
              </View>
              <View style={tw("w-[16%] border")}>
                <Text>{item.sldPaidCapital}</Text>
              </View>
              <View style={tw("w-[16%] border")}>
                <Text>{item.sldCapitalAdjust}</Text>
              </View>
              <View style={tw("w-[16%] border")}>
                <Text>{item.sldLegalReserv}</Text>
              </View>
              <View style={tw("w-[16%] border")}>
                <Text>{item.sldCumulResults}</Text>
              </View>
              <View style={tw("w-[16%] border")}>
                <Text>{item.sldNetWorth}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={tw("flex flex-row justify-between mt-4")}>
          <View
            style={tw(
              "text-center border border-gray-500 rounded-md h-32 w-60 flex flex-col justify-end px-4 pb-2 mr-2"
            )}
          >
            <View style={tw("border-b border-gray-500 mb-2 w-full")}></View>
            <Text>ELABORADO POR</Text>
          </View>
          <View
            style={tw(
              "text-center border border-gray-500 rounded-md h-32 w-60 flex flex-col justify-end px-4 pb-2 mr-2"
            )}
          >
            <View style={tw("border-b border-gray-500 mb-2 w-full")}></View>
            <Text>REVISADO POR</Text>
          </View>
          <View
            style={tw(
              "text-center border border-gray-500 rounded-md h-32 w-60 flex flex-col justify-end px-4 pb-2 "
            )}
          >
            <View style={tw("border-b border-gray-500 mb-2 w-full")}></View>
            <Text>APROBADO POR</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
