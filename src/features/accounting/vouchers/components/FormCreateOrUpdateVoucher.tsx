"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  CreateVoucher,
  createVoucherSchema,
  UpdateVoucher,
  updateVoucherSchema,
} from "../schemas/voucherSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { NumericFormat } from "react-number-format";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useCreateVoucher } from "../hooks/useCreateVoucher";
import { useUpdateVoucher } from "../hooks/useUpdateVoucher";
import { useVoucherDetails } from "../hooks/useVoucherDetails";
import { AccountSelect } from "../../account/components/AccountSelect";
import {
  ARE_INVOICE_FIELDS_ENABLED,
  COMPANY_HAS_MULTIPLE_BRANCHES,
} from "@/lib/constants";
import { ModelSeatSelect } from "../../model-seats/components/ModelSeatSelect";
import PdfVoucher from "../../shared/components/PdfVoucher";
import { VoucherType } from "../../shared/types/sharedTypes";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useDebouncedCallback } from "use-debounce";
import { BranchSelect } from "../../branches/components/BranchSelect";
import { useChangeBankExtractStatus } from "../../banks/hooks/useChangeBankExtractStatus";

type Props = {
  mode: "create" | "update";
  defaultValues?: Partial<CreateVoucher>;
  voucherId?: number;
  type?: string;
  onSuccess?: () => void;
  enableSelectPortals?: boolean;
};

export function FormCreateOrUpdateVoucher({
  mode,
  defaultValues,
  voucherId,
  type,
  onSuccess,
  enableSelectPortals = true,
}: Props) {
  const [applyGlossToAllItems, setApplyGlossToAllItems] = useState(false);
  const [
    isAutomaticRateConversionEnabled,
    setIsAutomaticRateConversionEnabled,
  ] = useState(false);
  const [isDollarEditionActive, setIsDollarEditionActive] = useState(false);

  const createVoucherMutation = useCreateVoucher();
  const updateVoucherMutation = useUpdateVoucher();

  const { data: voucherDetails } = useVoucherDetails(
    voucherId,
    type,
    mode === "update"
  );

  const schema = mode === "create" ? createVoucherSchema : updateVoucherSchema;

  const form = useForm<CreateVoucher | UpdateVoucher>({
    resolver: zodResolver(schema),
    values: {
      id: voucherDetails?.id || 0,
      type: voucherDetails?.type || defaultValues?.type || 0,
      voucherDate: voucherDetails?.voucherDate
        ? format(voucherDetails.voucherDate, "yyyy-MM-dd")
        : defaultValues?.voucherDate
        ? format(defaultValues.voucherDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      provider: voucherDetails?.provider || defaultValues?.provider || "",
      invoice: voucherDetails?.invoice || defaultValues?.invoice || "",
      invoiceNumber:
        voucherDetails?.invoiceNumber || defaultValues?.invoiceNumber || "",
      nit: voucherDetails?.nit || defaultValues?.nit || "",
      exchangeRate:
        voucherDetails?.exchangeRate || defaultValues?.exchangeRate || 6.97,
      coin: voucherDetails?.coin || defaultValues?.coin || "BOB",
      checkNum: voucherDetails?.checkNum || defaultValues?.checkNum || "0",
      gloss: voucherDetails?.gloss || defaultValues?.gloss || "",
      items:
        voucherDetails?.items?.map((item) => ({
          id: item.id,
          debitBs: item.debitBs,
          debitSus: item.debitSus,
          assetBs: item.assetBs,
          assetSus: item.assetSus,
          gloss: item.gloss || "",
          accountId: item.accountId,
          description: item.description || null,
          typeOfExpense: item.typeOfExpense || null,
          // createdAt: item.createdAt || "",
          voucherId: item.voucherId || 0,
          carpeta: item.carpeta || null,
        })) ||
        defaultValues?.items ||
        [],
      typeDocument:
        voucherDetails?.typeDocument || defaultValues?.typeDocument || null,
      canceledTo:
        voucherDetails?.canceledTo || defaultValues?.canceledTo || null,
      num: voucherDetails?.num || defaultValues?.num || 0,
      costCenterId:
        voucherDetails?.costCenterId || defaultValues?.costCenterId || null,
      bankId: voucherDetails?.bankId || defaultValues?.bankId || null,
      hojaDeRuta:
        voucherDetails?.hojaDeRuta || defaultValues?.hojaDeRuta || null,
      bankItemRef:
        voucherDetails?.bankItemRef || defaultValues?.bankItemRef || 0,
      accountingBoxItemRef:
        voucherDetails?.accountingBoxItemRef ||
        defaultValues?.accountingBoxItemRef ||
        0,
      bookSBRef: voucherDetails?.bookSBRef || defaultValues?.bookSBRef || 0,
      sucursalId: voucherDetails?.sucursalId || defaultValues?.sucursalId || 0,
      movementType:
        voucherDetails?.movementType || defaultValues?.movementType || 0,
      isHistoric:
        voucherDetails?.isHistoric || defaultValues?.isHistoric || false,
      isTransfer:
        voucherDetails?.isTransfer || defaultValues?.isTransfer || false,
      refCode: voucherDetails?.refCode || defaultValues?.refCode || "",
    },
  });

  console.log(form.formState.errors);

  const { fields, append, remove, replace, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  });

  const watchedType = useWatch({
    control: form.control,
    name: "type",
  });

  const watchedCoin = useWatch({
    control: form.control,
    name: "coin",
  });

  // Helper function to check if a field should be disabled based on its counterpart
  const isFieldDisabled = (
    index: number,
    currentField: "debitBs" | "debitSus" | "assetBs" | "assetSus"
  ) => {
    const currentItem = watchedItems?.[index];
    if (!currentItem) return false;

    // Check if automatic rate conversion is enabled and should disable fields
    if (isAutomaticRateConversionEnabled) {
      if (
        watchedCoin === "USD" &&
        (currentField === "debitBs" || currentField === "assetBs")
      ) {
        return true;
      }
      if (
        watchedCoin === "BOB" &&
        (currentField === "debitSus" || currentField === "assetSus")
      ) {
        return true;
      }
    }

    // Check mutual exclusion logic
    switch (currentField) {
      case "debitBs":
        // Disable debitBs if assetBs has a value
        return !!(currentItem.assetBs && currentItem.assetBs !== 0);
      case "debitSus":
        // Disable debitSus if assetSus has a value
        return !!(currentItem.assetSus && currentItem.assetSus !== 0);
      case "assetBs":
        // Disable assetBs if debitBs has a value
        return !!(currentItem.debitBs && currentItem.debitBs !== 0);
      case "assetSus":
        // Disable assetSus if debitSus has a value
        return !!(currentItem.debitSus && currentItem.debitSus !== 0);
      default:
        return false;
    }
  };

  const { totalDebitBs, totalAssetBs, isBalanced } = useMemo(() => {
    const debitTotal = (watchedItems || []).reduce((sum, item) => {
      return sum + (Number(item?.debitBs) || 0);
    }, 0);

    const assetTotal = (watchedItems || []).reduce((sum, item) => {
      return sum + (Number(item?.assetBs) || 0);
    }, 0);

    return {
      totalDebitBs: debitTotal,
      totalAssetBs: assetTotal,
      isBalanced: Math.abs(debitTotal - assetTotal) < 0.01, // Tolerancia para errores de redondeo
    };
  }, [watchedItems]);

  function handleGlossChange(checked: boolean) {
    const gloss = form.getValues("gloss");

    setApplyGlossToAllItems(checked);
    if (checked && gloss) {
      replace(
        watchedItems.map((item) => ({
          ...item,
          gloss: gloss,
        }))
      );
    } else if (!checked) {
      replace(
        watchedItems.map((item) => ({
          ...item,
          gloss: "",
        }))
      );
    }
  }

  const debouncedHandleDollarEdition = useDebouncedCallback(
    (
      index: number,
      field: "debitBs" | "debitSus" | "assetBs" | "assetSus",
      value: number
    ) => {
      if (!isAutomaticRateConversionEnabled || !isDollarEditionActive) return;

      const currentCoin = form.getValues("coin");
      const currentExchangeRate = form.getValues("exchangeRate");

      if (!currentCoin || !currentExchangeRate) return;

      if (currentCoin === "USD") {
        // Convert from USD to BOB
        if (field === "debitSus") {
          const convertedValue =
            Math.round(value * currentExchangeRate * 100) / 100;
          form.setValue(`items.${index}.debitBs`, convertedValue);
        } else if (field === "assetSus") {
          const convertedValue =
            Math.round(value * currentExchangeRate * 100) / 100;
          form.setValue(`items.${index}.assetBs`, convertedValue);
        }
      } else if (currentCoin === "BOB") {
        // Convert from BOB to USD
        if (field === "debitBs") {
          const convertedValue =
            Math.round((value / currentExchangeRate) * 100) / 100;
          form.setValue(`items.${index}.debitSus`, convertedValue);
        } else if (field === "assetBs") {
          const convertedValue =
            Math.round((value / currentExchangeRate) * 100) / 100;
          form.setValue(`items.${index}.assetSus`, convertedValue);
        }
      }
    },
    500 // 500ms debounce delay
  );

  async function onSubmit(data: CreateVoucher | UpdateVoucher) {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here
    if (mode === "create") {
      const validated = createVoucherSchema.safeParse(data);
      if (validated.success) {
        await createVoucherMutation.mutateAsync(validated.data);
        form.reset();
        onSuccess?.();
      }
    } else {
      const validated = updateVoucherSchema.safeParse(data);
      if (validated.success) {
        await updateVoucherMutation.mutateAsync(validated.data);
        onSuccess?.();
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">
          {mode === "create" ? "Crear Nuevo Voucher" : "Actualizar Voucher"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Main Information and Configuration Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - General Information */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-3">
                  Información General
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tipo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Traspaso</SelectItem>
                            <SelectItem value="1">Egreso</SelectItem>
                            <SelectItem value="2">Ingreso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="voucherDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Fecha</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value}
                            onChange={field.onChange}
                            className="h-8 text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="coin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Moneda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Moneda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BOB">BOB</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="exchangeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">T. Cambio</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            className="h-8 text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="checkNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">N° Cheque</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            className="h-8 text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {COMPANY_HAS_MULTIPLE_BRANCHES ? (
                    <FormField
                      name="sucursalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Sucursal</FormLabel>
                          <FormControl>
                            <div className="text-xs">
                              <BranchSelect
                                value={
                                  field?.value ? field.value.toString() : ""
                                }
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null}
                  {/* Gloss Field - spans 2 columns */}
                  <div className="col-span-2">
                    <FormField
                      name="gloss"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Glosa General
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Descripción general del voucher"
                              className="min-h-[60px] text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Configuration and Model Seat */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Configuración</h3>
                <div className="space-y-4">
                  {/* Currency Controls */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Campos USD</Label>
                      <p className="text-xs text-muted-foreground">
                        Mostrar columnas en dólares
                      </p>
                    </div>
                    <Switch
                      checked={isDollarEditionActive}
                      onCheckedChange={setIsDollarEditionActive}
                    />
                  </div>

                  {isDollarEditionActive && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Conversión automática
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Convierte automáticamente entre BOB y USD
                        </p>
                      </div>
                      <Checkbox
                        checked={isAutomaticRateConversionEnabled}
                        onCheckedChange={(checked) =>
                          setIsAutomaticRateConversionEnabled(checked === true)
                        }
                      />
                    </div>
                  )}

                  {/* Apply Gloss to All Items */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Aplicar glosa a todos
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Usa la glosa general en todos los items
                      </p>
                    </div>
                    <Checkbox
                      checked={applyGlossToAllItems}
                      onCheckedChange={handleGlossChange}
                    />
                  </div>

                  {/* Model Seat Selector */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Asiento Modelo
                      </Label>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Carga automáticamente las cuentas predefinidas
                      </p>
                      <ModelSeatSelect
                        voucherType={watchedType}
                        onSelectOption={(accounts) => {
                          console.log("Selected Model Seat Data:", accounts);
                          replace(
                            accounts.map((item) => ({
                              accountId: item.accountId,
                              debitBs: 0,
                              assetBs: 0,
                              gloss: "",
                              description: "",
                              debitSus: 0,
                              assetSus: 0,
                              // createdAt: "",
                              carpeta: null,
                              voucherId: 0,
                              typeOfExpense: null,
                            }))
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider and Invoice Information Section */}
            {ARE_INVOICE_FIELDS_ENABLED ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <h3 className="col-span-full text-lg font-medium mb-2">
                  Información del Proveedor y Factura
                </h3>

                <FormField
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Proveedor</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="invoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Valor Factura</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">N° Factura</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="nit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">NIT</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="h-8 text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {/* Accounts Section */}
            <div className="space-y-3 overflow-visible">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Cuentas del Voucher</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => remove()}
                    size="sm"
                    variant="outline"
                  >
                    Limpiar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      append({
                        accountId: 0,
                        debitBs: 0,
                        assetBs: 0,
                        gloss: applyGlossToAllItems
                          ? form.getValues("gloss")
                          : "",
                        description: "",
                        debitSus: 0,
                        assetSus: 0,
                        // createdAt: "",
                        carpeta: null,
                        voucherId: 0,
                        typeOfExpense: null,
                      })
                    }
                  >
                    + Agregar
                  </Button>
                </div>
              </div>

              {/* Table Container with Overflow */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-[30%] text-xs">
                          Cuenta
                        </TableHead>
                        <TableHead className="w-[100px] text-xs">
                          Debe Bs.
                        </TableHead>
                        {isDollarEditionActive && (
                          <TableHead className="w-[100px] text-xs">
                            Debe USD
                          </TableHead>
                        )}
                        <TableHead className="w-[100px] text-xs">
                          Haber Bs.
                        </TableHead>
                        {isDollarEditionActive && (
                          <TableHead className="w-[100px] text-xs">
                            Haber USD
                          </TableHead>
                        )}
                        <TableHead className="w-[20%] text-xs">Glosa</TableHead>
                        <TableHead className="w-[50px] text-center text-xs">
                          Acc.
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="p-2 w-[180px]">
                            <FormField
                              control={form.control}
                              name={`items.${index}.accountId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="text-xs">
                                      <AccountSelect
                                        usePortal={enableSelectPortals}
                                        value={
                                          field?.value
                                            ? field.value.toString()
                                            : ""
                                        }
                                        onChange={field.onChange}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.debitBs`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <NumericFormat
                                      disabled={isFieldDisabled(
                                        index,
                                        "debitBs"
                                      )}
                                      value={field.value}
                                      onValueChange={(values) => {
                                        const newValue = values.floatValue || 0;
                                        field.onChange(newValue);
                                        debouncedHandleDollarEdition(
                                          index,
                                          "debitBs",
                                          newValue
                                        );
                                      }}
                                      customInput={Input}
                                      thousandSeparator
                                      decimalScale={2}
                                      className="h-7 text-xs"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          {isDollarEditionActive && (
                            <TableCell className="p-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.debitSus`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <NumericFormat
                                        disabled={isFieldDisabled(
                                          index,
                                          "debitSus"
                                        )}
                                        value={field.value}
                                        onValueChange={(values) => {
                                          const newValue =
                                            values.floatValue || 0;
                                          field.onChange(newValue);
                                          debouncedHandleDollarEdition(
                                            index,
                                            "debitSus",
                                            newValue
                                          );
                                        }}
                                        customInput={Input}
                                        thousandSeparator
                                        decimalScale={2}
                                        className="h-7 text-xs"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          )}
                          <TableCell className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.assetBs`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <NumericFormat
                                      disabled={isFieldDisabled(
                                        index,
                                        "assetBs"
                                      )}
                                      value={field.value}
                                      onValueChange={(values) => {
                                        const newValue = values.floatValue || 0;
                                        field.onChange(newValue);
                                        debouncedHandleDollarEdition(
                                          index,
                                          "assetBs",
                                          newValue
                                        );
                                      }}
                                      customInput={Input}
                                      thousandSeparator
                                      decimalScale={2}
                                      className="h-7 text-xs"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          {isDollarEditionActive && (
                            <TableCell className="p-2">
                              <FormField
                                control={form.control}
                                name={`items.${index}.assetSus`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <NumericFormat
                                        disabled={isFieldDisabled(
                                          index,
                                          "assetSus"
                                        )}
                                        value={field.value}
                                        onValueChange={(values) => {
                                          const newValue =
                                            values.floatValue || 0;
                                          field.onChange(newValue);
                                          debouncedHandleDollarEdition(
                                            index,
                                            "assetSus",
                                            newValue
                                          );
                                        }}
                                        customInput={Input}
                                        thousandSeparator
                                        decimalScale={2}
                                        className="h-7 text-xs"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          )}
                          <TableCell className="p-2">
                            <FormField
                              control={form.control}
                              name={`items.${index}.gloss`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                      placeholder="Glosa"
                                      className="h-7 text-xs"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="text-center p-2">
                            <Button
                              onClick={() => remove(index)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                            >
                              <Trash className="size-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                {/* Root items array error */}
                {form.formState.errors.items && (
                  <p className="text-red-500 text-sm mt-2">
                    {form.formState.errors.items.message}
                  </p>
                )}
              </div>
            </div>

            {/* Totals and Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Totals */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Resumen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Debe Bs.:</span>
                    <span className="font-mono font-medium">
                      {totalDebitBs.toLocaleString("es-BO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Haber Bs.:</span>
                    <span className="font-mono font-medium">
                      {totalAssetBs.toLocaleString("es-BO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Estado:</span>
                    <span
                      className={`font-medium ${
                        isBalanced ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isBalanced ? "✓ Balanceado" : "✗ Desbalanceado"}
                    </span>
                  </div>
                </div>
                {!isBalanced && (
                  <div className="text-amber-600 text-xs flex items-center gap-2 mt-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
                    <span>⚠️</span>
                    <span>El voucher debe estar balanceado (Debe = Haber)</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {/* Main Submit Button - Most Prominent */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isBalanced || form.formState.isSubmitting}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    {mode === "create"
                      ? "🎯 Crear Voucher"
                      : "💾 Actualizar Voucher"}
                  </Button>
                </div>

                {/* PDF Voucher Buttons - Secondary Actions */}
                <div className="space-y-2 border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Acciones adicionales:
                  </p>
                  {mode === "update" && voucherDetails ? (
                    <div className="[&>button]:w-full [&>button]:justify-start [&>button]:text-sm [&>button]:h-8">
                      <PdfVoucher
                        isButton
                        triggerTitle="📄 Ver Comprobante"
                        key={voucherDetails.id}
                        id={voucherDetails.id}
                        type={voucherDetails.type.toString() as VoucherType}
                      />
                    </div>
                  ) : null}
                  {mode === "create" && createVoucherMutation.data ? (
                    <div className="[&>button]:w-full [&>button]:justify-start [&>button]:text-sm [&>button]:h-8">
                      <PdfVoucher
                        isButton
                        triggerTitle="📄 Ver Comprobante Creado"
                        key={createVoucherMutation.data.id}
                        id={createVoucherMutation.data.id}
                        type={
                          createVoucherMutation.data.type.toString() as VoucherType
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
