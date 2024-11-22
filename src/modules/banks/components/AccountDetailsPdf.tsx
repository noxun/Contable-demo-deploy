/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

type AccountPDFData = {
  id: number;
  num: number;
  exchangeRate: number;
  voucherDate: string;
  coin: string;
  checkNum: any;
  canceledTo: any;
  gloss: string;
  bankId: number;
  items: Array<{
    id: number;
    debitBs: number;
    debitSus: number;
    assetBs: number;
    assetSus: number;
    gloss: string;
    accountId: number;
    CodeAccount: number;
    DescriptionAccount: string;
    typeOfExpense: any;
  }>;
};

type AccountDetailsPdfProps = {
  data: AccountPDFData;
};

const tw = createTw({});

export default function AccountDetailsPdf({ data }: AccountDetailsPdfProps) {

  const totalDebitBs = data.items?.reduce(
    (sum: number, item) => sum + item.debitBs,
    0
  );
  const totalDebitSus = data.items?.reduce(
    (sum: number, item) => sum + item.debitSus,
    0
  );
  const totalAssetBs = data.items?.reduce(
    (sum: number, item) => sum + item.assetBs,
    0
  );
  const totalAssetSus = data.items?.reduce(
    (sum: number, item) => sum + item.assetSus,
    0
  );

  return (
    <Document>
      <Page size="LETTER" style={tw("p-4 flex flex-col h-full text-base")}>
        {/* <Page wrap={true} size="A4" style={tw("p-4 flex gap-8")}> */}
        <View
          style={tw(
            "border-4 border-black m-0 p-4 grid grid-rows-[auto_auto_auto_1fr_auto] h-full"
          )}
        >
          <View style={tw("flex justify-center items-start")}>
            <View style={tw("flex flex-col items-center justify-center")}>
              <Image src="/images/noxun.jpg" style={tw("p-1 w-15 h-20")} />
              <Text>NOXUN</Text>
              <Text>Gestión {new Date().getFullYear()}</Text>
            </View>
          </View>
          <View style={tw("flex flex-col items-center justify-center mt-8")}>
            <Text style={tw("text-2xl mt-0 ")}>
              COMPROBANTE DE EGRESO N (Número Acá)
            </Text>
            <Text style={tw("text-xl")}>(Expresado en Bs)</Text>
          </View>
          <View>
            <Text>
              <>Fecha: {data?.voucherDate ?? "HOY"}</>
            </Text>
            <Text>Pagado a: {data?.gloss ?? "SIN REGISTRO"}</Text>
          </View>
          <View style={tw("mt-4 flex-1")}>
            <Text style={tw("font-bold mb-2")}>Items contables:</Text>
            <View style={tw("flex flex-col h-full border border-gray-500")}>
              <View
                style={tw("flex flex-row border-b border-gray-500 bg-gray-200")}
              >
                <Text
                  style={tw("w-1/12 p-2 border-r border-gray-500 text-center")}
                >
                  ID
                </Text>
                <Text
                  style={tw("w-3/12 p-2 border-r border-gray-500 text-center")}
                >
                  Glosa
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  Debe Bs
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  Haber Bs
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  Debe Sus
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  Haber Sus
                </Text>
                <Text style={tw("w-2/12 p-2 text-center")}>ID CUENTA</Text>
              </View>
              <View style={tw("flex flex-col flex-1")}>
                {data.items &&
                  data?.items?.map((item) => (
                    <View
                      key={item.id}
                      style={tw("flex flex-row  border-gray-500")}
                    >
                      <Text
                        style={tw(
                          "w-1/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.id}
                      </Text>
                      <Text
                        style={tw(
                          "w-3/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.gloss}
                      </Text>
                      <Text
                        style={tw(
                          "w-2/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.debitBs}
                      </Text>
                      <Text
                        style={tw(
                          "w-2/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.assetBs}
                      </Text>
                      <Text
                        style={tw(
                          "w-2/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.debitSus.toFixed(2)}
                      </Text>
                      <Text
                        style={tw(
                          "w-2/12 p-2 border-r border-gray-500 text-center"
                        )}
                      >
                        {item.assetSus.toFixed(2)}
                      </Text>
                      <Text style={tw("w-2/12 p-2 text-center")}>
                        {item.accountId}
                      </Text>
                    </View>
                  ))}
              </View>
              <View
                style={tw("flex flex-row border-t border-gray-500 bg-gray-200")}
              >
                <Text
                  style={tw("w-4/12 p-2 border-r border-gray-500 text-center")}
                >
                  Total
                </Text>
                {/* <Text style={tw("w-1/12 p-2 border-r border-gray-500")}></Text> */}
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  {totalDebitBs}
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  {totalAssetBs}
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  {totalDebitSus?.toFixed(2)}
                </Text>
                <Text
                  style={tw("w-2/12 p-2 border-r border-gray-500 text-center")}
                >
                  {totalAssetSus?.toFixed(2)}
                </Text>
                <Text style={tw("w-2/12 p-2")}></Text>
              </View>
            </View>
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
        </View>
      </Page>
    </Document>
  );
}
