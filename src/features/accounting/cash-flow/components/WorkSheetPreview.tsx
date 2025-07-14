import React from "react";
import { formatNumber } from "@/features/accounting/shared/utils/validate";
import type { WorkSheetCashFlowItem } from "../schemas/cashFlowSchema";
import { mockData } from "../utils/mockData";

interface Props {
  data?: WorkSheetCashFlowItem[] | null;
}

export const WorkSheetPreview = ({ data }: Props) => {
  const rows = data?.length ? data : mockData.items;

  const totals = {
    balanceSheetPresent: rows.reduce((sum, item) => sum + (item.balanceSheetPresent || 0), 0),
    balanceSheetBack: rows.reduce((sum, item) => sum + (item.balanceSheetBack || 0), 0),
    difference: rows.reduce((sum, item) => sum + (Number(item.difference || 0)), 0),

    periodDepression: rows.reduce((sum, item) => sum + (item.periodDepression || 0), 0),
    amorOfIntangibleAsset: rows.reduce((sum, item) => sum + (item.amorOfIntangibleAsset || 0), 0),
    aitb: rows.reduce((sum, item) => sum + (item.aitb || 0), 0),
    valueMaintenance: rows.reduce((sum, item) => sum + (item.valueMaintenance || 0), 0),
    provCompensation: rows.reduce((sum, item) => sum + (item.provCompensation || 0), 0),
    payCompensation: rows.reduce((sum, item) => sum + (item.payCompensation || 0), 0),
    payDividends: rows.reduce((sum, item) => sum + (item.payDividends || 0), 0),
    purchaseFixedAssets: rows.reduce((sum, item) => sum + (item.purchaseFixedAssets || 0), 0),
    saleFixedAssets: rows.reduce((sum, item) => sum + (item.saleFixedAssets || 0), 0),
    paymentCompensation: rows.reduce((sum, item) => sum + (item.paymentCompensation || 0), 0),
    paymentDividends: rows.reduce((sum, item) => sum + (item.paymentDividends || 0), 0),
    diference: rows.reduce((sum, item) => sum + (Number(item.diference) || 0), 0),
  };

  return (
    <div className="">
      <div className="bg-gray-50 py-4 border">
        <h2 className="text-2xl font-semibold text-center">Hoja de Trabajo</h2>
        <p className="text-center text-gray-700">(Expresado en Bolivianos)</p>
      </div>

      {/* Encabezado */}
      <div className="text-xs md:text-sm text-[#4A4A4A] overflow-x-auto">
        <div className="flex bg-gray-50 text-center font-semibold">
          <div className="min-w-[120px] border border-gray-300 px-4 py-2 flex justify-center items-center text-base"><p>Código</p></div>
          <div className="min-w-[250px] border border-gray-300 px-4 py-2 flex justify-center items-center text-base"><p>Cuenta</p></div>
          <div className="min-w-[120px] border border-gray-300 flex flex-col justify-betwenn">
            <p className="border-b border-gray-300 h-[50%] content-center">Balance General</p>
            <p className="h-[50%] content-center">31/12/24</p> 
          </div>
          <div className="min-w-[120px] border border-gray-300 flex flex-col justify-betwenn">
            <p className="border-b border-gray-300 h-[50%] content-center">Balance General</p>
            <p className="h-[50%] content-center">31/12/24</p>
          </div>
          <div className="min-w-[120px] border border-gray-300 px-4 py-2 flex justify-center items-center"><p>Diferencia</p></div>
          <div>
              <div className="bg-yellow-100 py-2">
                  <p>AJUSTES DE FLUJO DE EFECTIVO</p>
              </div>
              <div className="flex leading-none">
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Depreciación del Periodo</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Amortización de activo intangible</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>AITB</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Mantenimiento de Valor</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Previsión para Indemnización</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Pago de Indemnización</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Pago de Dividendos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Compra de Activos Fijos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Venta de Activos Fijos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Pago Indemnizaciones</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 px-4 py-2 bg-yellow-100 content-center"><p>Pago Dividendos</p></div>
              </div>
          </div>
          <div className="min-w-[120px] border border-gray-300 bg-gray-50 px-4 py-2 flex justify-center items-center"><p>Diferencia</p></div>
          <div className="min-w-[120px] border border-gray-300 bg-gray-50 px-4 py-2 flex justify-center items-center"><p>Clasificación</p></div>
        </div>

        {/* Filas */}
        {rows.map((item, index) => (
          <div key={index} className="flex border-b hover:bg-blue-50">
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-center"><p>{item.codeAccount ?? "-"}</p></div>
            <div className="min-w-[250px] border border-gray-50 px-4 py-2"><p>{item.nameAccount ?? "-"}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right"><p>{formatNumber(item.balanceSheetPresent)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right"><p>{formatNumber(item.balanceSheetBack)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right"><p>{formatNumber(Number(item.difference ?? 0))}</p></div>

            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.periodDepression)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.amorOfIntangibleAsset)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.aitb)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.valueMaintenance)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.provCompensation)}</p></div>

            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.payCompensation)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.payDividends)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.purchaseFixedAssets)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.saleFixedAssets)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.paymentCompensation)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-right bg-yellow-50"><p>{formatNumber(item.paymentDividends)}</p></div>

            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-center"><p>{formatNumber(item.diference ?? 0)}</p></div>
            <div className="min-w-[120px] border border-gray-50 px-4 py-2 text-center"><p>{item.clasification ?? "-"}</p></div>
          </div>
        ))}
        
        <div className="flex font-semibold">
          <div className="min-w-[120px] px-4 py-2 text-center bg-gray-100">Totales</div>
          <div className="min-w-[250px] px-4 py-2 bg-gray-100">-</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.balanceSheetPresent)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.balanceSheetBack)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.difference)}</div>
          
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.periodDepression)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.amorOfIntangibleAsset)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.aitb)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.valueMaintenance)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.provCompensation)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.payCompensation)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.payDividends)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.purchaseFixedAssets)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.saleFixedAssets)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.payCompensation)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.payDividends)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">{formatNumber(totals.diference)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-gray-100">-</div>
        </div>
      </div>
    </div>
  );

};
