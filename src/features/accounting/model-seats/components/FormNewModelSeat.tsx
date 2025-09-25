"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoMenuSelect from "@/components/custom/no-menu-select";
import { Checkbox } from "@/components/ui/checkbox";
import useFormNewModelSeat from "../hooks/useFormNewModelSeat";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FormNewModelSeat() {
  const {
    modelSeatForm,
    fields,
    isLoading,
    isPending,
    motionAccounts,
    totalPercentage,
    isPercentageValid,
    handleAddAccount,
    handleToggleDebitAsset,
    removeAccount,
    onSubmit,
  } = useFormNewModelSeat();

  if (isLoading || !motionAccounts) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <Form {...modelSeatForm}>
        <form
          onSubmit={modelSeatForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Form header fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={modelSeatForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción" {...field} />
                  </FormControl>
                  <FormDescription>
                    La descripción del asiento a guardar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={modelSeatForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Transacción</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de transacción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Traspasos</SelectItem>
                      <SelectItem value="1">Egresos</SelectItem>
                      <SelectItem value="2">Ingresos</SelectItem>
                      <SelectItem value="3">Caja</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Seleccione el tipo de transacción para este asiento modelo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Accounts table section */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Cuentas del Asiento Modelo
              </h2>
              <Button
                type="button"
                onClick={handleAddAccount}
                variant="outline"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Cuenta
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay cuentas añadidas. Haga clic en &quot;Adicionar
                Cuenta&quot; para comenzar.
              </div>
            ) : (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuenta</TableHead>
                      <TableHead className="w-24">Es Debe</TableHead>
                      <TableHead className="w-24">Es Haber</TableHead>
                      <TableHead className="w-32">Porcentaje</TableHead>
                      <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            name={`accounts.${index}.accountId`}
                            control={modelSeatForm.control}
                            render={({ field: accountField }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <NoMenuSelect
                                    placeholder="Selecciona una Cuenta..."
                                    options={motionAccounts}
                                    getOptionLabel={(account) =>
                                      `${account.code} - ${account.description}`
                                    }
                                    getOptionValue={(account) =>
                                      account.id.toString()
                                    }
                                    onChange={(option) => {
                                      accountField.onChange(option?.id);
                                    }}
                                    value={motionAccounts.find(
                                      (account) =>
                                        account.id === accountField.value
                                    )}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={modelSeatForm.control}
                            name={`accounts.${index}.debit`}
                            render={({ field: debitField }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={debitField.value}
                                    onCheckedChange={(checked) => {
                                      handleToggleDebitAsset(
                                        index,
                                        "debit",
                                        checked as boolean
                                      );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={modelSeatForm.control}
                            name={`accounts.${index}.asset`}
                            render={({ field: assetField }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={assetField.value}
                                    onCheckedChange={(checked) => {
                                      handleToggleDebitAsset(
                                        index,
                                        "asset",
                                        checked as boolean
                                      );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={modelSeatForm.control}
                            name={`accounts.${index}.percentage`}
                            render={({ field: percentageField }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    {...percentageField}
                                    onChange={(e) =>
                                      percentageField.onChange(
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => removeAccount(index)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Percentage validation alerts */}
            {modelSeatForm.watch("type") === 3 && (
              <div className="mt-4">
                <div className="text-sm font-medium">
                  Porcentaje total: {totalPercentage}%
                </div>
                {totalPercentage > 100 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      La suma de los porcentajes no debe ser mayor a 100
                    </AlertDescription>
                  </Alert>
                )}
                {totalPercentage < 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      La suma de los porcentajes no debe ser menor a 0
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isPending || !isPercentageValid || fields.length === 0}
            className="w-full sm:w-auto"
          >
            {isPending ? <Spinner /> : <Save size={18} className="mr-2" />}
            Guardar Asiento Modelo
          </Button>
        </form>
      </Form>
    </div>
  );
}
