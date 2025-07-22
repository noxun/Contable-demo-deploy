import React, { useMemo } from "react";
import { formatNumber } from "@/features/accounting/shared/utils/validate";
import type { WorkSheetCashFlowItem } from "../schemas/workSheetSchema";
import { mockData } from "../utils/mockData";
import { useWorkSheetData } from "../hooks/useWorkSheetData";

export const WorkSheetPreview = () => {

  const {data: worksheetData, isLoading: isLoadingWorksheet, isError} = useWorkSheetData();
  
  const rows = useMemo(() => {
    return Array.isArray(worksheetData?.items) && worksheetData.items.length > 0 
      ? worksheetData
      : mockData
  }, [worksheetData?.items]);

  if(isLoadingWorksheet){
    return <p className="text-center text-sm text-gray-500">Cargando hoja de trabajo...</p>
  }
  
  if (isError) {
    return <p className="text-center text-sm text-red-500">Ocurrió un error al cargar la hoja de trabajo.</p>
  }

  return (
    <div className=" dark:text-white">
      <div className="bg-gray-50 dark:bg-black dark:text-white py-4 border">
        <h2 className="text-2xl font-semibold text-center">Hoja de Trabajo</h2>
        <p className="text-center text-gray-700 dark:text-gray-300">(Expresado en Bolivianos)</p>
      </div>

      {/* Encabezado */}
      <div className="text-xs md:text-sm text-[#4A4A4A] overflow-x-auto dark:bg-gray-700 dark:text-white">
        <div className="flex bg-gray-50 text-center font-semibold dark:bg-gray-700">
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 flex justify-center items-center text-base"><p>Código</p></div>
          <div className="min-w-[250px] border border-gray-300 dark:border-gray-500 px-4 py-2 flex justify-center items-center text-base"><p>Cuenta</p></div>
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 flex flex-col justify-betwenn dark:bg-gray-700">
            <p className="border-b border-gray-300 dark:border-gray-500 h-[50%] content-center">Balance General</p>
            <p className="h-[50%] content-center">{new Date().getFullYear() - 1}</p> 
          </div>
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 flex flex-col justify-betwenn dark:bg-gray-700">
            <p className="border-b border-gray-300 dark:border-gray-500 h-[50%] content-center">Balance General</p>
            <p className="h-[50%] content-center">{new Date().getFullYear()}</p>
          </div>
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 flex justify-center items-center"><p>Diferencia</p></div>
          <div className="dark:text-white">
              <div className="bg-yellow-100 py-2 dark:bg-gray-800 border-t border-gray-500">
                  <p>AJUSTES DE FLUJO DE EFECTIVO</p>
              </div>
              <div className="flex leading-none">
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Depreciación del Periodo</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Amortización de activo intangible</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>AITB</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Mantenimiento de Valor</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Previsión para Indemnización</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Pago de Indemnización</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Pago de Dividendos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Compra de Activos Fijos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Venta de Activos Fijos</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Pago Indemnizaciones</p></div>
                  <div className="min-w-[120px] max-w-[120px] border border-gray-300 dark:border-gray-500 px-4 py-2 bg-yellow-100 dark:bg-gray-800 content-center"><p>Pago Dividendos</p></div>
              </div>
          </div>
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 bg-gray-50 px-4 py-2 flex justify-center items-center dark:bg-gray-700"><p>Diferencia</p></div>
          <div className="min-w-[120px] border border-gray-300 dark:border-gray-500 bg-gray-50 px-4 py-2 flex justify-center items-center dark:bg-gray-700"><p>Clasificación</p></div>
        </div>

        {/* Filas */}
        {rows?.items?.map((item, index) => (
          <div key={index} className="flex border-b dark:text-white border-gray-50 dark:border-gray-600">
            <div className="min-w-[120px] border border-inherit  px-4 py-2 text-center"><p>{item.codeAccount ?? "-"}</p></div>
            <div className="min-w-[250px] border border-inherit  px-4 py-2"><p>{item.nameAccount ?? "-"}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right"><p>{formatNumber(item.balanceSheetBack)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right"><p>{formatNumber(item.balanceSheetPresent)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right"><p>{formatNumber(Number(item.diference ?? 0))}</p></div>

            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.periodDepression)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.amorOfIntangibleAsset)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.aitb)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.valueMaintenance)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.provCompensation)}</p></div>

            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.payCompensation)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.payDividends)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.purchaseFixedAssets)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.saleFixedAssets)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.paymentCompensation)}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-right bg-yellow-50 dark:bg-gray-800"><p>{formatNumber(item.paymentDividends)}</p></div>

            <div className="min-w-[120px] border border-inherit px-4 py-2 text-center"><p>{item.difference ?? 0}</p></div>
            <div className="min-w-[120px] border border-inherit px-4 py-2 text-center"><p>{item.clasification ?? "-"}</p></div>
          </div>
        ))}
        
        <div className="flex font-semibold dark:bg-gray-700 bg-gray-100">
          <div className="min-w-[120px] px-4 py-2 text-center bg-inherit">Totales</div>
          <div className="min-w-[250px] px-4 py-2 bg-inherit">-</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.balanceSheetBackTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.balanceSheetPresentTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(Number(rows?.differenceTotal ?? 0))}</div>
          
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.periodDepressionTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.amorOfIntangibleAssetTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.aitbTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.valueMaintenanceTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.provCompensationTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.payCompensationTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.payDividendsTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.purchaseFixedAssetsTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.saleFixedAssetsTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.paymentCompensationTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.paymentDividendsTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{formatNumber(rows?.diferenceTotal || 0)}</div>
          <div className="min-w-[120px] px-4 py-2 text-right bg-inherit">{rows?.clasificationTotal || "-"}</div>
        </div>
      </div>
    </div>
  );

};
