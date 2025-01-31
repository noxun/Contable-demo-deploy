"use client";

import useDiaryBookData from "@/modules/shared/hooks/useDiaryBookData";
import { formatNumber } from "@/modules/shared/utils/validate";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Virtuoso } from "react-virtuoso";

type DiaryBookPreviewProps = {
  dateRange: DateRange;
  inSus: boolean;
};

export default function DiaryBookPreview({
  dateRange,
  inSus,
}: DiaryBookPreviewProps) {
  const initDate = format(dateRange.from!, "yyyy/MM/dd");
  const endDate = format(dateRange.to!, "yyyy/MM/dd");

  //realmente no hay forma de no enviar la fecha de inicio y fin
  //salvo si se hace la consulta directamente a la api

  const {
    data: diaryBookData,
    isLoading,
    isError,
  } = useDiaryBookData(initDate, endDate, inSus, true);

  //tal vez agregar barra de busqueda luego

  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Cargando...</div>;

  return (
    <section className="border w-full p-2">
      <div className="flex flex-col items-center">
        <h2 className="text-lg">Libro Diario</h2>
        <p>Expresado en {inSus ? "Dolares" : "Bolivianos"}</p>
      </div>
      <div className="flex justify-between">
        Fecha
        <span>
          {initDate === endDate ? initDate : `${initDate} al ${endDate}`}
        </span>
      </div>
      {/* Table Header*/}
      <div className="grid grid-cols-5 font-bold text-base">
        <div>Código</div>
        <div>Detalle</div>
        <div className="justify-self-center">Hoja de Ruta</div>
        <div className="justify-self-center">Debe</div>
        <div className="justify-self-center">Haber</div>
      </div>
      {/* Virtualized Table Data */}
      <div>
        <Virtuoso
          // style={{ height: "calc(100vh - 200px)" }}
          style={{ height: 400 }}
          data={diaryBookData?.report}
          itemContent={(_, record) => (
            <div key={record.id} className="flex flex-col mb-4">
              {/* no se porque gap no funciona en la linea de arriba pero bueno mb lo soluciona */}
              <div id="record">
                <div id="row1" className="grid grid-cols-5">
                  <div>{format(record.voucherDate, "dd/MM/yyyy")}</div>
                  <div className="justify-self-center">{record.typeDes}</div>
                  <div className="col-span-3"></div>
                </div>
                <div id="row2" className="grid grid-cols-5">
                  <div>
                    {record.voucherItems.map((item) => (
                      <div key={item.id}>{item.code}</div>
                    ))}
                  </div>
                  <div>
                    {record.voucherItems.map((item) => (
                      <div
                        className={item.assetBs > 0 ? "pl-2" : ""}
                        key={item.id}
                      >
                        {item.description}
                      </div>
                    ))}
                  </div>
                  <div>
                    {record.voucherItems.map((item) => (
                      <div key={item.id} className="justify-self-center">
                        {item.hojaDeRuta}
                      </div>
                    ))}
                  </div>
                  <div>
                    {record.voucherItems.map((item) => (
                      <div key={item.id} className="justify-self-end">
                        {formatNumber(inSus ? item.debitSus : item.debitBs)}
                      </div>
                    ))}
                  </div>
                  <div>
                    {record.voucherItems.map((item) => (
                      <div key={item.id} className="justify-self-end">
                        {formatNumber(inSus ? item.assetSus : item.assetBs)}
                      </div>
                    ))}
                  </div>
                </div>
                <div id="row3" className="grid grid-cols-5">
                  <div className="col-span-1"></div>
                  <div className="font-bold">{record.gloss}</div>
                  <div className="col-span-1"></div>
                  <div className="font-bold justify-self-end">
                    <span className="border-b-2">
                      {formatNumber(
                        inSus ? record.plusData.debeSus : record.plusData.debe
                      )}
                    </span>
                  </div>
                  <div className="font-bold justify-self-end">
                    <span className="border-b-2">
                      {formatNumber(
                        inSus ? record.plusData.haberSus : record.plusData.haber
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
      {/* Table footer */}
      <div id="row4" className="grid grid-cols-5 text-lg">
        <div className="col-span-3 font-bold">Total</div>
        <div className="font-bold justify-self-end">
          {formatNumber(
            inSus
              ? diaryBookData?.total.debeSus ?? 0
              : diaryBookData?.total.debe ?? 0
          )}
        </div>
        <div className="font-bold justify-self-end">
          {formatNumber(
            inSus
              ? diaryBookData?.total.haberSus ?? 0
              : diaryBookData?.total.haber ?? 0
          )}
        </div>
      </div>
    </section>
  );
}
