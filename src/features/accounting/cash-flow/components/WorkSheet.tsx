"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { workSheetCashFlowItemSchema } from "../schemas/cashFlowSchema";

// Schema for the form with array of items
const workSheetFormSchema = z.object({
  items: z.array(workSheetCashFlowItemSchema),
});

type WorkSheetFormData = z.infer<typeof workSheetFormSchema>;

export function WorkSheet() {
  const form = useForm<WorkSheetFormData>({
    resolver: zodResolver(workSheetFormSchema),
    defaultValues: {
      items: [
        {
          id: 1,
          codeAccount: "",
          nameAccount: "",
          balanceSheetBack: 0,
          balanceSheetPresent: 0,
          difference: "",
          periodDepression: 0,
          amorOfIntangibleAsset: 0,
          aitb: 0,
          valueMaintenance: 0,
          provCompensation: 0,
          payCompensation: 0,
          payDividends: 0,
          purchaseFixedAssets: 0,
          saleFixedAssets: 0,
          paymentCompensation: 0,
          paymentDividends: 0,
          diference: 0,
          clasification: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addNewItem = () => {
    const newId = Math.max(...fields.map(field => field.id), 0) + 1;
    append({
      id: newId,
      codeAccount: "",
      nameAccount: "",
      balanceSheetBack: 0,
      balanceSheetPresent: 0,
      difference: "",
      periodDepression: 0,
      amorOfIntangibleAsset: 0,
      aitb: 0,
      valueMaintenance: 0,
      provCompensation: 0,
      payCompensation: 0,
      payDividends: 0,
      purchaseFixedAssets: 0,
      saleFixedAssets: 0,
      paymentCompensation: 0,
      paymentDividends: 0,
      diference: 0,
      clasification: "",
    });
  };

  const onSubmit = (data: WorkSheetFormData) => {
    console.log("Form data:", data);
    toast.success("Hoja de trabajo guardada exitosamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hoja de Trabajo - Flujo de Efectivo</h2>
        <Button onClick={addNewItem} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Cuenta
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Cuenta #{field.id}</CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Code Account */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.codeAccount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Cuenta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 1001" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name Account */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.nameAccount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de Cuenta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Efectivo en bancos" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Classification */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.clasification`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clasificación</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar clasificación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="operacion">Operación</SelectItem>
                            <SelectItem value="inversion">Inversión</SelectItem>
                            <SelectItem value="financiamiento">Financiamiento</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Balance Sheet Back */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.balanceSheetBack`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Balance Anterior</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Balance Sheet Present */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.balanceSheetPresent`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Balance Actual</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Period Depression */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.periodDepression`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depreciación del Período</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amortization of Intangible Asset */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.amorOfIntangibleAsset`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amort. Activos Intangibles</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* AITB */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.aitb`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AITB</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Value Maintenance */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.valueMaintenance`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mantenimiento de Valor</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Provision Compensation */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.provCompensation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provisión Indemnización</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pay Compensation */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.payCompensation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pago Indemnización</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pay Dividends */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.payDividends`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pago Dividendos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Purchase Fixed Assets */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.purchaseFixedAssets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compra Activos Fijos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sale Fixed Assets */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.saleFixedAssets`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venta Activos Fijos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Compensation */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.paymentCompensation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pago Compensación</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Dividends */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.paymentDividends`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pago de Dividendos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Difference */}
                  <FormField
                    control={form.control}
                    name={`items.${index}.diference`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diferencia</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Guardar Hoja de Trabajo
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Limpiar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}