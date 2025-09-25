/* eslint-disable jsx-a11y/alt-text */

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatNumber } from "../../utils/validate";
import { COMPANY_ADDRESS, COMPANY_NAME, COMPANY_NIT, REPORTS_LOGO_URL } from "@/lib/constants";
import { DiaryBookResponse } from "@/lib/types";
import { createTw } from "react-pdf-tailwind";

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
  table: {
    width: "100%",
  },
  trCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  thCell: {
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 3,
  },
  tdCell: {
    fontSize: 9,
    paddingHorizontal: 5,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  trEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col40: { width: "40%" },
  col50: { width: "50%" },
  col55: { width: "55%" },
  col60: { width: "60%" },
  col70: { width: "70%" },
  imageOutOfBounds: {
    position: 'absolute',
    top: -15,
    left: -15,
    height: "1.5cm",
    objectFit: 'cover',
  },
  zebra: {
    backgroundColor: '#f8f8f8',
  },
});

const tw = createTw({})

interface DateRange {
  from: string;
  to: string;
}

export const DiaryBookTemplate = ({
  records,
  isSus,
  dateRange,
}: {
  records: DiaryBookResponse;
  isSus: Boolean;
  dateRange: DateRange;
}) => {
  const debitType = isSus ? "debitSus" : "debitBs";
  const assetType = isSus ? "assetSus" : "assetBs";
  const moneyType = isSus ? "Dolares" : "Bolivianos";

  const now = new Date();
  const gestion = now.getFullYear();
  const mesLiteral = now.toLocaleString("es-BO", { month: "long" });
  const fecha = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  const hora = now.toLocaleTimeString("es-BO");

  const messageDate =
    dateRange.from === dateRange.to
      ? `Del ${dateRange.from}`
      : `${dateRange.from} al ${dateRange.to}`;

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View fixed render={({ pageNumber, totalPages }:any) => (
            <View style={{
                fontSize: '8px',
                color: '#2f2f2f',
                width: '100%',
                textAlign: 'right',
                paddingBottom: 4,
                borderBottom: pageNumber !== 1 ? '1px solid black' : undefined,
              }}
            >
              <Text> Página: {pageNumber} / {totalPages} </Text>
            </View>
          )}
        />
        <View style={tw("w-full flex flex-row justify-between mb-4 text-sm")}>
          <View style={tw("flex-1")}>
            <Image
              source={REPORTS_LOGO_URL}
              style={{ height: 40, width: 120 }}
            />
            <Text style={tw("font-semibold text-gray-700 mt-2")}>{COMPANY_NAME} </Text>
            <Text style={tw("text-gray-700 mb-1")}>NIT {COMPANY_NIT}</Text>
            <Text style={tw("text-gray-700 w-[170px] text-xs")}>{COMPANY_ADDRESS} </Text>
          </View>
          <View style={tw(" flex-1 w-full flex items-center self-end")}>
            <Text style={{ fontSize: 15, fontFamily: "Helvetica-Bold", paddingBottom: 5}}>
              Libro Diario
            </Text>
            <Text style={[styles.thCell, { fontFamily: "Helvetica", fontWeight:'normal', color:"#232323", fontSize:10 }]}>(Expresado en {moneyType})</Text>
          </View>
          <View style={tw("flex-1 flex flex-col items-end pt-4 text-xs")}>
            <View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Gestion </Text>  <Text style={tw("text-gray-800")}> {gestion} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Mes </Text>  <Text style={tw("text-gray-800")}> {mesLiteral} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Fecha: </Text>  <Text style={tw("text-gray-800")}> {fecha} </Text>  </View>
              <View style={tw("flex flex-row")}> <Text style={tw("font-semibold text-gray-800 pb-1")}>Hora: </Text>  <Text style={tw("text-gray-800")}> {hora} </Text>  </View>
            </View>
          </View>
        </View>
        {/* <View style={{ display: "flex", textAlign: "center", gap: 2, paddingBottom: 10, paddingTop: 20 }}>
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold" }}>
            Libro Diario
          </Text>
          <Text style={[styles.thCell, { fontFamily: "Helvetica-Bold" }]}>(Expresado en {moneyType})</Text>
        </View> */}
        <View style={[styles.trCell, { paddingBottom: 5, borderTopWidth: 1,borderLeft:"1px solid black", borderRight:"1px solid black" }]}>
          <View style={styles.col15}>
            <Text style={[styles.thCell,{paddingBottom:1.5, paddingTop:2.5}]}>Fecha:</Text>
          </View>
          <View style={[styles.col70,{paddingLeft:4}]}>
            <Text style={[styles.thCell, {fontWeight:'normal',paddingBottom:1.5, paddingTop:2.5}]}>{messageDate}</Text>
          </View>
          <View style={[styles.col20, { paddingTop: 1, paddingBottom: 1 }]}></View>
        </View>

        <View style={[styles.trCell, { border:'1px solid black', fontFamily: "Helvetica-Bold" }]}>
          <Text style={[styles.thCell, styles.col15, {paddingVertical:5}]}>Codigo</Text>
          <Text style={[styles.thCell, styles.col40, {paddingVertical:5}]}>Detalle</Text>
          <Text style={[styles.thCell, styles.col15, {paddingVertical:5}]}>Hoja de Ruta</Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center",paddingVertical:5}]}>Debe</Text>
          <Text style={[styles.thCell, styles.col15, { textAlign: "center",paddingVertical:5 }]}>Haber</Text>
        </View>
        {/* FALTA COMPLETAR LAS LIONEAS DE CADA ITEMS AL FINAL DE CADA PAGINA */}
        <View style={{borderLeft:'1px solid black', borderRight:'1px solid black'}}>
          {(Array.isArray(records.report) ? records.report : []).map((asiento, index) => (
            <View wrap={false} key={asiento.id} style={[styles.table,{flexGrow:1},  index % 2 === 0 ? {} : styles.zebra ]}>
              <View style={styles.trCell}>
                <Text style={[styles.tdCell, styles.col15, { height: '100%', paddingTop:7, borderRight:'1px solid black' }]}>
                  {format(asiento.voucherDate, "dd/MM/yyyy")}
                </Text>
                <Text style={[styles.tdCell, styles.col40, { textAlign: "center", paddingTop:7, height: '100%', borderRight:'1px solid black'}]}>
                  {asiento.typeDes}
                </Text>
                <Text style={[styles.col15, {borderRight:'1px solid black', paddingTop:7, }]}>{" "}</Text>
                <Text style={[styles.col15, {borderRight:'1px solid black', paddingTop:7, }]}> </Text>
                <Text style={[styles.col15, {paddingTop:7,}]}></Text>
              </View>

              {(Array.isArray(asiento.voucherItems) ? asiento.voucherItems : []).map((record) => (
                <View wrap={false} style={styles.entry} key={record.id}>
                  <View style={[styles.col15, { borderRight:'1px solid black', height:'100%' }]}>
                    <Text style={[styles.tdCell]}>
                      {record.code}
                    </Text>
                  </View>
                  <View style={[styles.col40, { borderRight:'1px solid black', height:'100%' }]}>
                    <Text style={[styles.tdCell, { paddingLeft: `${record[assetType] > 0 ? "20" : styles.tdCell.paddingHorizontal}`, },]}>
                      {record.description}
                    </Text>
                  </View>
                  <View style={[styles.col15, {borderRight:'1px solid black', height:'100%'}]}>
                    <Text style={[styles.tdCell]}>
                      {record.hojaDeRuta ?? '-'}
                    </Text>
                  </View>
                  <View style={[styles.col15, {borderRight:'1px solid black', height:'100%'}]}>
                    <Text style={[styles.tdCell, { textAlign: "right" }]}>
                      {formatNumber(record[debitType])}
                    </Text>
                  </View>
                  <View style={[styles.col15,{height:'100%'}]}>
                    <Text style={[styles.tdCell, { textAlign: "right" }]}>
                      {formatNumber(record[assetType])}
                    </Text>
                  </View>
                </View>
              ))}
            
              <View style={[styles.trEntry,{alignItems: 'stretch'}]}>
                <View style={[styles.col15, { paddingBottom: 15,paddingTop:3, borderRight:'1px solid black', height: '100%'}]}>
                  <Text style={[styles.tdCell]}>
                    {" "}
                  </Text>
                </View>
                <View style={[styles.col40, { paddingBottom: 15, paddingTop:3, borderRight:'1px solid black', height: '100%'}]} >
                  <Text style={[styles.tdCell, { fontSize: 9, fontFamily: "Helvetica-BoldOblique" }]}>
                    {`${asiento.gloss} `}
                  </Text>
                </View>
                <View style={[styles.col15, { paddingBottom: 15, paddingTop:3, borderRight:'1px solid black', height: '100%'}]}>
                  <Text style={[styles.tdCell]}>
                    {" "}
                  </Text>
                </View>
                <View style={[styles.col15, { paddingBottom: 15,paddingTop:3, borderRight:'1px solid black', height: '100%' }]}>
                  <View style={{ alignSelf: 'flex-end', borderBottomWidth: 2 }}>
                    <Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" },]}>
                      {formatNumber(isSus ? asiento.plusData.debeSus : asiento.plusData.debe)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.col15, { paddingBottom: 15,paddingTop:3, height: '100%', }]}>
                  <View style={{ alignSelf: 'flex-end', borderBottomWidth: 2 }}>
                    <Text style={[styles.tdCell, { fontFamily: "Helvetica-Bold" },]}>
                      {formatNumber(isSus ? asiento.plusData.haberSus : asiento.plusData.haber)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* separacion espacio restante */}
              <View style={{ flexGrow: 1, flexDirection: 'row' }} wrap={false}>
                <View style={{ width: '15%', borderRight: '1px solid black'}} />
                <View style={{ width: '40%', borderRight: '1px solid black'}} />
                <View style={{ width: '15%', borderRight: '1px solid black'}} />
                <View style={{ width: '15%', borderRight: '1px solid black'}} />
                <View style={{ width: '15%',  }} />
              </View>

            </View>
          ))
          }
        </View>
        <View wrap={false} style={[styles.trCell, { border:'1px solid black', fontFamily:"Helvetica-Bold" }]}>
          <Text style={[styles.tdCell, styles.col70, { paddingVertical:5, fontSize:10 }]}>Total</Text>
          <Text style={[styles.tdCell, styles.col15, { textAlign: "right", paddingVertical:5, fontSize:10, borderRight:"1px solid black" }]}>{formatNumber(isSus ? records.total.debeSus : records.total.debe)}</Text>
          <Text style={[styles.tdCell, styles.col15, { textAlign: "right", paddingVertical:5, fontSize:10 }]}>{formatNumber(isSus ? records.total.haberSus : records.total.haber)}</Text>
        </View>
        <View wrap={false} style={tw("w-full flex flex-row gap-8 text-sm mt-2")}>
          <View style={tw("h-36 flex-1 flex")}>
            <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
              {/* Aqui podria venir un text mas si se necesita */}
              <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>CONTADOR</Text>
            </View>
          </View>
          <View style={tw("h-36 flex-1 flex")}>
            <View style={tw("border h-full rounded-lg my-1 flex flex-row items-end justify-center")}>
              {/* Aqui podria venir un text mas si se necesita */}
              <Text style={tw("border-t py-1 px-2 text-center w-[95%] text-gray-500 border-gray-800 font-semibold")}>GERENTE</Text>
            </View>
          </View>
        </View>
        {/*Border bottom */}
        <View fixed render={({ pageNumber, totalPages }: any) =>
            pageNumber !== totalPages ? (
              <View style={{width: '100%',height: 1,marginTop: 'auto',borderTop: '1px solid black',}}/>
            ) : null}
          />
      </Page >
    </Document >
  );
};