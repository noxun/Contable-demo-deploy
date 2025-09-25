"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  WorkSheetCashFlow,
  UpdateWorkSheetCashFlowItem,
} from "../schemas/workSheetSchema";
import { useUpdateWorkSheetDataItemMutation } from "../hooks/useUpdateWorkSheetDataItemMutation";
import { ClasificationSelect } from "./ClasificationSelect";

type Props = {
  workSheetData: WorkSheetCashFlow;
};

export function WorkSheet({ workSheetData }: Props) {
  const [items, setItems] = useState<UpdateWorkSheetCashFlowItem[]>(
    workSheetData.items?.map((item) => ({
      periodDepression: item.periodDepression || 0,
      amorOfIntangibleAsset: item.amorOfIntangibleAsset || 0,
      aitb: item.aitb || 0,
      valueMaintenance: item.valueMaintenance || 0,
      provCompensation: item.provCompensation || 0,
      payCompensation: item.payCompensation || 0,
      payDividends: item.payDividends || 0,
      purchaseFixedAssets: item.purchaseFixedAssets || 0,
      saleFixedAssets: item.saleFixedAssets || 0,
      paymentCompensation: item.paymentCompensation || 0,
      paymentDividends: item.paymentDividends || 0,
      clasification: item.clasification || "",
    })) || []
  );

  const updateMutation = useUpdateWorkSheetDataItemMutation();

  const handleInputChange = (
    index: number,
    field: keyof UpdateWorkSheetCashFlowItem,
    value: number | string
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleUpdateItem = async (index: number) => {
    const originalItem = workSheetData.items?.[index];
    if (!originalItem) {
      toast.error("No se encontró el item original");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: originalItem.id,
        data: items[index],
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Hoja de Trabajo - Flujo de Efectivo
        </h2>
      </div>

      <div className="space-y-6">
        {workSheetData.items?.map((originalItem, index) => (
          <Card key={originalItem.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Cuenta #{originalItem.id}
                </CardTitle>
                <Button
                  onClick={() => handleUpdateItem(index)}
                  disabled={updateMutation.isPending}
                  size="sm"
                >
                  {updateMutation.isPending ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Code Account - Read Only */}
                <div>
                  <Label>Código de Cuenta</Label>
                  <div className="mt-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {originalItem.codeAccount || "N/A"}
                  </div>
                </div>

                {/* Name Account - Read Only */}
                <div>
                  <Label>Nombre de Cuenta</Label>
                  <div className="mt-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {originalItem.nameAccount || "N/A"}
                  </div>
                </div>

                {/* Classification - Not editable per schema */}
                <div>
                  <Label>Clasificación</Label>
                  <ClasificationSelect
                    value={items[index]?.clasification || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "clasification", value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Balance Sheet Back - Read Only */}
                <div>
                  <Label>Balance Anterior</Label>
                  <div className="mt-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {originalItem.balanceSheetBack || 0}
                  </div>
                </div>

                {/* Balance Sheet Present - Read Only */}
                <div>
                  <Label>Balance Actual</Label>
                  <div className="mt-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {originalItem.balanceSheetPresent || 0}
                  </div>
                </div>

                {/* Period Depression */}
                <div>
                  <Label>Depreciación del Período</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.periodDepression || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "periodDepression",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Amortization of Intangible Asset */}
                <div>
                  <Label>Amort. Activos Intangibles</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.amorOfIntangibleAsset || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "amorOfIntangibleAsset",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* AITB */}
                <div>
                  <Label>AITB</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.aitb || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "aitb",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Value Maintenance */}
                <div>
                  <Label>Mantenimiento de Valor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.valueMaintenance || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "valueMaintenance",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Provision Compensation */}
                <div>
                  <Label>Provisión Indemnización</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.provCompensation || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "provCompensation",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Pay Compensation */}
                <div>
                  <Label>Pago Indemnización</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.payCompensation || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "payCompensation",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pay Dividends */}
                <div>
                  <Label>Pago Dividendos</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.payDividends || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "payDividends",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Purchase Fixed Assets */}
                <div>
                  <Label>Compra Activos Fijos</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.purchaseFixedAssets || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "purchaseFixedAssets",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Sale Fixed Assets */}
                <div>
                  <Label>Venta Activos Fijos</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.saleFixedAssets || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "saleFixedAssets",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Payment Compensation */}
                <div>
                  <Label>Pago Compensación</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.paymentCompensation || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "paymentCompensation",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Dividends */}
                <div>
                  <Label>Pago de Dividendos</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={items[index]?.paymentDividends || 0}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "paymentDividends",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>

                {/* Difference - Read Only */}
                <div>
                  <Label>Diferencia</Label>
                  <div className="mt-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {originalItem.diference || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
