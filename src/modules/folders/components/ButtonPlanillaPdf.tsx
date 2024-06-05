import { Button } from "@/components/ui/button";
import { IResponseConceptFolder, IResponseFolder } from "../interface/folders";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import CustomTablePDF from "@/modules/shared/components/generatePdf/CustomTablePDF";

interface Props {
  data: IResponseConceptFolder[];
  dataFolder: IResponseFolder | undefined;
}
export const ButtonPlanillaPdf = (props: Props) => {
  const { data, dataFolder } = props;

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">Ver Planilla</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[98vh] w-full flex items-center justify-center p-0 border-none">
        <PDFViewer showToolbar={true} className="h-full w-full rounded-lg">
          <Document>
            <Page
              size="A4"
              style={{
                ...styles.body,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginBottom: 20,
                  }}
                >
                  <Image src="/images/noxun.jpg" style={{ height: 40 }} />
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        ...styles.title1,
                      }}
                    >
                      PLANILLA DE DESPACHO
                    </Text>
                    <Text style={{ ...styles.title1 }}>
                      La Paz Casa Matriz - N° 1
                    </Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ ...styles.title1 }}>Fecha:</Text>
                      <Text style={{ ...styles.title2 }}>
                        {format(new Date(), "dd/MM/yyyy") ?? "-"}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ ...styles.title1 }}>Hora:</Text>
                      <Text style={{ ...styles.title2 }}>
                        {format(new Date(), "HH:mm:ss") ?? "-"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                  >
                    Razón Social: {dataFolder?.clienteNombre}
                  </Text>
                  <Text
                    style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                  >
                    Cliente: {dataFolder?.clienteCodigo ?? "-"}
                  </Text>
                </View>
                <View
                  style={{ borderTop: "1px solid black", marginVertical: 5 }}
                ></View>
                <Text
                  style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                >
                  REFERENCIAS:
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0 10px",
                  }}
                >
                  <Text style={{ ...styles.title1 }}>
                    Ref.: {dataFolder?.referenciaCliente}
                  </Text>
                  <Text style={{ ...styles.title1 }}>
                    Mer.: {dataFolder?.mercaderia}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0 10px",
                  }}
                >
                  <Text style={{ ...styles.title1 }}>
                    Carpeta: {dataFolder?.numRef}
                  </Text>
                  <Text style={{ ...styles.title1 }}>
                    DIM: {dataFolder?.dim} - {dataFolder?.fechaAceptacion}
                  </Text>
                  <Text style={{ ...styles.title1 }}>
                    FOB[Us]:{" "}
                    {dataFolder?.fobUsd && dataFolder?.fobUsd !== "-"
                      ? dataFolder?.fobUsd.includes(",")
                        ? dataFolder?.fobUsd
                        : Number(dataFolder?.fobUsd).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                      : "-"}
                  </Text>
                  <Text style={{ ...styles.title1 }}>
                    CIF[Bs]:{" "}
                    {dataFolder?.cifBs && dataFolder?.cifBs !== "-"
                      ? dataFolder?.cifBs.includes(",")
                        ? dataFolder?.cifBs
                        : Number(dataFolder?.cifBs).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{ borderTop: "1px solid black", marginVertical: 5 }}
                ></View>
                <Text
                  style={{
                    ...styles.title1,
                    marginBottom: "5px",
                  }}
                >
                  POR LO SIGUIENTE, DEBE:
                </Text>
                <CustomTablePDF
                  fontSize={12}
                  data={data.filter(
                    (item) => item.typeOfExpense === "Planilla"
                  )}
                  fields={[
                    {
                      label: "Item",
                      name: "acronym",
                      width: "12",
                    },
                    {
                      label: "Description",
                      name: "description",
                      width: "60",
                    },
                    {
                      label: "Importe Bs",
                      name: "debitBs",
                      width: "30",
                      type: "amountString",
                      textAlign: "right",
                    },
                  ]}
                />
                <View
                  style={{ borderTop: "1px solid black", marginVertical: 5 }}
                ></View>
                <Text
                  style={{
                    ...styles.title1,
                    fontFamily: "Helvetica-Bold",
                    marginVertical: "5px",
                    textAlign: "right",
                  }}
                >
                  PAGADO POR SU CUENTA: Bs.{" "}
                  {Number(
                    data
                      .filter((item) => item.typeOfExpense === "Planilla")
                      .reduce(
                        (total, payment) =>
                          Number(total) + Number(payment.debitBs ?? 0),
                        0
                      )
                      .toFixed(2)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <Text
                  style={{
                    ...styles.title1,
                    marginBottom: "5px",
                  }}
                >
                  SON:{" "}
                  {Number(
                    data
                      .filter((item) => item.typeOfExpense === "Planilla")
                      .reduce(
                        (total, payment) =>
                          Number(total) + Number(payment.debitBs ?? 0),
                        0
                      )
                      .toFixed(2)
                  ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <View
                  style={{ borderTop: "1px solid black", marginVertical: 5 }}
                ></View>
                <Text
                  style={{
                    ...styles.title1,
                    fontFamily: "Helvetica-Bold",
                    marginVertical: "5px",
                  }}
                >
                  CONSOLIDACIÓN:
                </Text>
                <View
                  style={{
                    marginVertical: 5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ ...styles.title1, maxWidth: "60%" }}>
                    SON:{" "}
                    {Number(
                      data
                        .filter((item) => item.typeOfExpense === "Planilla")
                        .reduce(
                          (total, payment) =>
                            Number(total) + Number(payment.debitBs ?? 0),
                          0
                        )
                        .toFixed(2)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <View style={{ maxWidth: "50%" }}>
                    <CustomTablePDF
                      fontSize={12}
                      data={[
                        {
                          doc: "Planilla N°: ",
                          amount: Number(
                            data
                              .filter(
                                (item) => item.typeOfExpense === "Planilla"
                              )
                              .reduce(
                                (total, payment) =>
                                  Number(total) + Number(payment.debitBs ?? 0),
                                0
                              )
                              .toFixed(2)
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                        },
                        {
                          doc: "Factura N°: ",
                          amount: Number(
                            data
                              .filter(
                                (item) => item.typeOfExpense === "Factura"
                              )
                              .reduce(
                                (total, payment) =>
                                  Number(total) + Number(payment.assetBs ?? 0),
                                0
                              )
                              .toFixed(2)
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                        },
                        {
                          doc: "TOTAL TRÁMITE",
                          amount: Number(
                            data
                              .reduce(
                                (total, payment) =>
                                  Number(total) + Number(payment.debitBs ?? 0),
                                0
                              )
                              .toFixed(2)
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                        },
                      ]}
                      fields={[
                        {
                          label: "Documento",
                          name: "doc",
                          width: "40",
                        },
                        {
                          label: "Importe Bs",
                          name: "amount",
                          width: "40",
                          textAlign: "right",
                        },
                      ]}
                    />
                    <View
                      style={{
                        borderTop: "1px solid black",
                        borderBottom: "1px solid black",
                        height: 3,
                        marginVertical: 0,
                      }}
                    ></View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  src="https://res.cloudinary.com/joeldes/image/upload/v1704774719/Agda/logoOEA_nceuhb.png"
                  style={{ width: 50 }}
                />
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      ...styles.title1,
                      textAlign: "center",
                      color: "#00823d",
                    }}
                  >
                    CASA MATRIZ: Edif. Torre Goya 1578 Piso 1 Of.2
                  </Text>
                  <Text
                    style={{
                      ...styles.title1,
                      textAlign: "center",
                      color: "#00823d",
                    }}
                  >
                    Av. Brasil esquina Pasoskanky (Miraflores) - La Paz Bolivia
                  </Text>
                  <Text
                    style={{
                      ...styles.title1,
                      textAlign: "center",
                      color: "#00823d",
                    }}
                  >
                    Telf. 78944081/70140353 - Email info@noxun.net
                  </Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  title1: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2,
  },
  title2: {
    fontSize: 12,
    fontFamily: "Helvetica",
    paddingVertical: 2,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
});
