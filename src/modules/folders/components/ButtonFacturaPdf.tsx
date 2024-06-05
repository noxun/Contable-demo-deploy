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
export const ButtonFacturaPdf = (props: Props) => {
  const { data, dataFolder } = props;
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">Ver Factura</Button>
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "60%", alignItems: "center" }}>
                    <Image src="/images/noxun.jpg" style={{ height: 40 }} />
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          ...styles.title1,
                          fontFamily: "Helvetica-Bold",
                        }}
                      >
                        AGENTES GENERALES DESPACHANTES DE ADUANA S.A.
                      </Text>
                      <Text
                        style={{
                          ...styles.title1,
                          fontFamily: "Helvetica-Bold",
                        }}
                      >
                        CASA MATRIZ
                      </Text>
                      <Text
                        style={{
                          ...styles.title1,
                          fontFamily: "Helvetica-Bold",
                        }}
                      >
                        No. Punto de Venta 0
                      </Text>
                      <Text style={{ ...styles.title1 }}>
                        Edif. Torre Goya 1578 Piso 1 Of.2
                      </Text>
                      <Text style={{ ...styles.title1 }}>
                        Av. Brasil esquina Pasoskanky (Miraflores) - La Paz
                        Bolivia
                      </Text>
                      <Text style={{ ...styles.title1 }}>
                        Teléfonos 78944081/70140353
                      </Text>
                      <Text style={{ ...styles.title1 }}>
                        https://noxun.net/
                      </Text>
                      <Text style={{ ...styles.title1 }}>LA PAZ</Text>
                    </View>
                  </View>
                  <View style={{ width: "38%" }}>
                    <View
                      style={{
                        border: "1px solid black",
                        flexDirection: "row",
                        gap: "5px",
                        padding: "5px 10px",
                      }}
                    >
                      <View style={{ width: "45%" }}>
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          NIT:
                        </Text>
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          FACTURA N°:
                        </Text>
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          AUTORIZACIÓN:
                        </Text>
                      </View>
                      <View style={{ width: "55%" }}>
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          1016557021
                        </Text>
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          0
                        </Text>
                        {/* {urlSiat ? (
                          <View>
                            {handleListCuf(urlSiat).map((item, index) => (
                              <Text
                                key={index}
                                style={{
                                  fontSize: 10,
                                  fontFamily: "Helvetica-Bold",
                                }}
                              >
                                {item}
                              </Text>
                            ))}
                          </View>
                        ) : (
                          <Text
                            style={{
                              ...styles.title1,
                              fontFamily: "Helvetica-Bold",
                            }}
                          >
                            -
                          </Text>
                        )} */}
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          -
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingVertical: 2,
                        fontFamily: "Helvetica-Bold",
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      FACTURA
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        paddingVertical: 2,
                        fontFamily: "Helvetica-Bold",
                        textAlign: "center",
                      }}
                    >
                      (CON DERECHO A CRÉDITO FISCAL)
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: "10px",
                    gap: "10px",
                  }}
                >
                  <View style={{ minWidth: "120px" }}>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Fecha:
                    </Text>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Nombre/Razón Social:
                    </Text>
                  </View>
                  <View style={{ width: "calc(75% - 210px)" }}>
                    <Text style={{ ...styles.title1 }}>
                      {/* {dayjs(dispatchDocument.registerDate).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )} */}
                      {format(new Date(), "dd/MM/yyyy HH:mm:ss") ?? "-"}
                    </Text>
                    <Text style={{ ...styles.title1 }}>
                      {dataFolder?.clienteNombre}
                    </Text>
                  </View>
                  <View style={{ minWidth: "90px" }}>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      NIT/CI/CEX:
                    </Text>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Código cliente:
                    </Text>
                  </View>
                  <View style={{ width: "calc(25% - 210px)" }}>
                    <Text style={{ ...styles.title1 }}>
                      {dataFolder?.nitCi ?? "-"}
                    </Text>
                    <Text style={{ ...styles.title1 }}>
                      {dataFolder?.clienteCodigo ?? "-"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "10px",
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
                  {dataFolder?.procedureTypeId === 2 ? (
                    <View></View>
                  ) : (
                    <>
                      <Text style={{ ...styles.title1 }}>
                        FOB[Us]:{" "}
                        {dataFolder?.fobUsd && dataFolder?.fobUsd !== "-"
                          ? dataFolder?.fobUsd.includes(",")
                            ? dataFolder?.fobUsd
                            : Number(dataFolder?.fobUsd).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                          : "-"}
                      </Text>
                      <Text style={{ ...styles.title1 }}>
                        CIF[Bs]:{" "}
                        {dataFolder?.cifBs && dataFolder?.cifBs !== "-"
                          ? dataFolder?.cifBs.includes(",")
                            ? dataFolder?.cifBs
                            : Number(dataFolder?.cifBs).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                          : "-"}
                      </Text>
                    </>
                  )}
                </View>
                <View style={{ flexDirection: "row", marginTop: "10px" }}>
                  <View
                    style={{
                      alignItems: "center",
                      border: "1px solid black",
                      padding: "0px 5px",
                      minWidth: "80px",
                    }}
                  >
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Código
                    </Text>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Producto
                    </Text>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Servicio
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid black",
                      padding: "0px 5px",
                      borderLeft: "",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Descripción
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid black",
                      borderLeft: "",
                      padding: "0px 5px",
                      minWidth: "80px",
                    }}
                  >
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Precio
                    </Text>
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Unitario
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid black",
                      borderLeft: "",
                      padding: "0px 5px",
                      minWidth: "80px",
                    }}
                  >
                    <Text
                      style={{ ...styles.title1, fontFamily: "Helvetica-Bold" }}
                    >
                      Subtotal
                    </Text>
                  </View>
                </View>
                {data
                  .filter((item) => item.typeOfExpense === "Factura")
                  .map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        border: "1px solid black",
                        borderTop: "",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0px 5px",
                          minWidth: "79px",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {item.acronym ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          padding: "0px 5px",
                          width: "100%",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {item.description ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "center",
                          padding: "0px 5px",
                          minWidth: "80px",
                          borderLeft: "1px solid black",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {item.assetBs.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) ?? "-"}
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "center",
                          padding: "3px 5px",
                          minWidth: "80px",
                          borderLeft: "1px solid black",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {item.assetBs.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) ?? "-"}
                        </Text>
                      </View>
                    </View>
                  ))}
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      ...styles.title1,
                      fontFamily: "Helvetica-Bold",
                      width: "100%",
                      marginTop: "5px",
                    }}
                  >
                    SON:{" "}
                    {Number(
                      data
                        .filter((item) => item.typeOfExpense === "Factura")
                        .reduce(
                          (total, payment) =>
                            Number(total) + Number(payment.assetBs ?? 0),
                          0
                        )
                        .toFixed(2)
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                  <View style={{ minWidth: "231px" }}>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          SUBTOTAL Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {Number(
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
                          }) ?? "-"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          DESCUENTO Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>{"0"}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          TOTAL Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {Number(
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
                          }) ?? "-"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          IMPORTE GIFT CARD Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>{"0"}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          TOTAL A PAGAR Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {Number(
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
                          }) ?? "-"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        border: "1px solid black",
                        borderTop: "",
                        flexDirection: "row",
                        transform: "translateY(-1px)",
                      }}
                    >
                      <View
                        style={{
                          minWidth: "150px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          padding: "0px 5px",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.title1,
                            fontFamily: "Helvetica-Bold",
                          }}
                        >
                          BASE CRÉDITO FISCAL Bs
                        </Text>
                      </View>
                      <View
                        style={{
                          minWidth: "80px",
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          padding: "0px 5px",
                        }}
                      >
                        <Text style={{ ...styles.title1 }}>
                          {Number(
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
                          }) ?? "-"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "90%", marginHorizontal: "auto" }}>
                    <Text
                      style={{
                        ...styles.title1,
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                        marginBottom: 8,
                      }}
                    >
                      ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS. EL USO
                      ILÍCITO DE ESTA SERÁ SANCIONADO PENALMENTE DE ACUERDO A
                      LEY
                    </Text>
                    <Text
                      style={{
                        ...styles.title1,
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                      }}
                    >
                      Ley N° 453: El proveedor de servicios debe habilitar
                      medios e instrumentos para efectuar consultas y
                      reclamaciones.
                    </Text>
                    <Text
                      style={{
                        ...styles.title1,
                        textAlign: "center",
                        fontFamily: "Helvetica-Bold",
                      }}
                    >
                      Este documento es la Representación Gráfica de un
                      Documento Fiscal Digital emitido en una modalidad de
                      facturación en línea
                    </Text>
                  </View>
                  {/* {src ? (
                    <ImagePdf src={src} style={{ width: 100 }} />
                  ) : (
                    <View></View>
                  )} */}
                  <View></View>
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
                      Av. Brasil esquina Pasoskanky (Miraflores) - La Paz
                      Bolivia
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
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2,
  },
  title2: {
    fontSize: 11,
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
