"use client";

import { useEffect, useState } from "react";
import { Voucher, VoucherItem, VoucherType } from "../types/sharedTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IBank } from "@/features/accounting/banks/interface/banks";
import axios from "axios";
import { Account } from "@/features/accounting/account/types/account";
import { toast } from "sonner";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTrazoInternCodesByCompanyId from "../hooks/useTrazoInternCodesByCompanyId";
import useTrazoCompanies from "../hooks/useTrazoCompanies";
import CreatableSelect from "react-select/creatable";
import { TrazoCompany } from "@/lib/types";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save } from "lucide-react";
import FormEditVoucherItems from "./FormEditVoucherItems";
import Spinner from "@/components/ui/spinner";
import { editVoucher, postCompanyOrConcept } from "@/lib/data";
import useAccounts from "../../account/hooks/useAccounts";
import useBanks from "../../banks/hooks/useBanks";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter } from "next/navigation";
import CustomSelect from "@/components/custom/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormEditVoucherProps = {
  type: VoucherType;
  voucher: Voucher;
  accountDate?: string; //para invalidar la query de bigger book
  accountCode?: string; //para invalidar la query de bigger book x2
};

export default function FormEditVoucher({
  type,
  voucher,
  accountDate,
  accountCode,
}: FormEditVoucherProps) {
  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>(
    voucher?.items ?? []
  );

  const [mainGloss, setMainGloss] = useState(voucher.gloss || "");
  const [totalDebitBs, setTotalDebitBs] = useState(0);
  const [totalAssetBs, setTotalAssetBs] = useState(0);

  const [editionEnabled, setEditionEnabled] = useState(false);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedCompanyOption, setSelectedCompanyOption] = useState<null | {
    value: number;
    label: string;
  }>(null);
  const [isCreatingOption, setIsCreatingOption] = useState(false);

  const {
    data: trazoCompanies,
    isLoading: isLoadingTrazoCompanies,
    isError: isErrorTrazoCompanies,
  } = useTrazoCompanies();
  const {
    data: trazoInternCodes,
    isLoading: isLoadingTrazoInternCodes,
    isError: isErrorInternCodes,
  } = useTrazoInternCodesByCompanyId(selectedCompanyId);

  const pathname = usePathname();
  const router = useRouter();

  const banksQuery = useBanks();

  const accountsQuery = useAccounts();
  const queryClient = useQueryClient();

  const editVoucherMutation = useMutation({
    mutationFn: editVoucher,
    onSuccess: () => {
      if (accountDate) {
        console.log("invalidado");
        queryClient.invalidateQueries({
          queryKey: ["bookBiggerData", accountDate],
        });
      }
      if (accountCode) {
        console.log("invalidado");
        queryClient.invalidateQueries({
          queryKey: ["biggerBookDataByAccountCode", accountCode],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["invoiceRegistry"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      queryClient.invalidateQueries({
        queryKey: ["Vouchers", voucher?.id?.toString() ?? "", type.toString()],
      });
      toast.success("Voucher Editado Correctamente");
      if (pathname.endsWith("edit")) {
        router.push("/dashboard/accounting/transactions");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Hubo un error mientras se editaba el voucher");
    },
  });

  async function handleCreateCompany(inputValue: string) {
    setIsCreatingOption(true);
    try {
      const dataToSend = {
        name: inputValue,
      };
      const response = await postCompanyOrConcept(dataToSend);
      queryClient.setQueryData(
        ["TrazoCompanies"],
        (oldData: TrazoCompany[]) => [
          ...oldData,
          {
            id: response.id,
            razonSocial: response.name,
            ref: "Contable", // Adapt this to your backend response
          },
        ]
      );

      const newOption = {
        value: response.id,
        label: response.name,
      };

      setSelectedCompanyOption(newOption);
      setSelectedCompanyId(response.id);

      toast.success("Nueva opcion agregada correctamente");
    } catch (error) {
      toast.error("Error al agregar una nueva opcion");
      console.log(error);
    } finally {
      setIsCreatingOption(false);
    }
  }

  function onSubmit(values: Voucher) {
    values["type"] = parseInt(type);
    values["id"] = voucher!.id; // no sera undefined te lo juro ts :sadface:
    values["voucherDate"] = format(values.voucherDate!, "yyyy-MM-dd");
    console.log(values);
    editVoucherMutation.mutate(values);
  }

  useEffect(() => {
    let totalDebitBs = voucherItems.reduce((total, currentItem) => {
      // Convert string to number if it's a string, handle empty values
      const debitValue =
        typeof currentItem?.debitBs === "string"
          ? parseFloat(currentItem?.debitBs) || 0
          : currentItem?.debitBs ?? 0;

      return total + debitValue;
    }, 0);

    let totalAssetBs = voucherItems.reduce((total, currentItem) => {
      // Convert string to number if it's a string, handle empty values
      const assetValue =
        typeof currentItem?.assetBs === "string"
          ? parseFloat(currentItem?.assetBs) || 0
          : currentItem?.assetBs ?? 0;

      return total + assetValue;
    }, 0);

    console.log(typeof totalDebitBs, typeof totalAssetBs); // Should be 'number' for both
    setTotalDebitBs(totalDebitBs);
    setTotalAssetBs(totalAssetBs);

    // Compare with precision to avoid floating point issues
    setEditionEnabled(
      Number(totalDebitBs.toFixed(2)) === Number(totalAssetBs.toFixed(2))
    );
  }, [voucherItems]);

  const voucherItemSchema = z.object({
    id: z.number().optional(),
    debitBs: z.number(),
    debitSus: z.number(),
    assetBs: z.number(),
    assetSus: z.number(),
    gloss: z.string(),
    accountId: z.number().optional(),
    voucherId: z.number(),
  });

  const voucherFormSchema = z.object({
    id: z.number().optional(),
    num: z.number().optional(),
    voucherDate: z.string().or(z.date()).optional(),
    exchangeRate: z.coerce.number(),
    coin: z.enum(["USD", "BOB"]),
    checkNum: z.string().optional(),
    canceledTo: z
      .string({
        required_error: "Fecha requerida.",
      })
      .optional(),
    gloss: z.string(),
    bankId: z.coerce.string().nullable(),
    hojaDeRuta: z.string().optional(),
    provider: z.string().optional(),
    invoice: z.string().optional(),
    invoiceNumber: z.string().optional(),
    nit: z.string().optional(),
    items: z.array(voucherItemSchema).optional(),
  });

  const voucherForm = useForm<z.infer<typeof voucherFormSchema>>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      voucherDate: voucher.voucherDate
        ? format(new Date(voucher.voucherDate), "MM/dd/yyyy")
        : "",
      exchangeRate: voucher.exchangeRate,
      coin: voucher.coin,
      checkNum: voucher.checkNum,
      gloss: voucher.gloss,
      bankId: (voucher.bankId as string) ?? null,
      hojaDeRuta: voucher.hojaDeRuta ?? "",
      provider: voucher.provider ?? "",
      invoice: voucher.invoice ?? "",
      invoiceNumber: voucher.invoiceNumber ?? "",
      nit: voucher.nit ?? "",
    },
  });

  if (
    banksQuery.isLoading ||
    !banksQuery.data ||
    accountsQuery.isLoading ||
    !accountsQuery.data ||
    isLoadingTrazoCompanies ||
    !trazoCompanies
  ) {
    return <Spinner />;
  }

  console.log(totalDebitBs, totalAssetBs);

  return (
    <div className="max-h-[80vh] overflow-y-auto px-2">
      <Form {...voucherForm}>
        <form onSubmit={voucherForm.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2">
            <FormField
              control={voucherForm.control}
              name="voucherDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy/MM/dd")
                          ) : (
                            <span>Seleccione la fecha</span>
                          )}
                          {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es}
                        mode="single"
                        selected={new Date(field.value!)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>T/C</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="nit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="invoice"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Factura</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Numero de Factura</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="coin"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Moneda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BOB">Bolivianos</SelectItem>
                      <SelectItem value="USD">Dolares</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2 items-center mb-2">
            <FormField
              control={voucherForm.control}
              name="checkNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de cheque</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    // defaultValue={field?.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Array.isArray(banksQuery.data)
                        ? banksQuery.data
                        : []
                      ).map((bank) => (
                        <SelectItem key={`${bank.id}`} value={`${bank.id}`}>
                          {bank.sigla} - {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label>Cliente</Label>
              <CreatableSelect
                value={selectedCompanyOption}
                isDisabled={isCreatingOption}
                isLoading={isCreatingOption}
                options={(Array.isArray(trazoCompanies)
                  ? trazoCompanies
                  : []
                ).map((company) => ({
                  value: company.id,
                  label: company.razonSocial,
                }))}
                onCreateOption={handleCreateCompany}
                onChange={(value) => {
                  setSelectedCompanyOption(value);
                  setSelectedCompanyId(value?.value as number);
                  // field.onChange(value?.label);
                }}
                formatCreateLabel={(inputValue) =>
                  `Crear cliente "${inputValue}"`
                }
              />
            </div>
            <FormField
              control={voucherForm.control}
              name="hojaDeRuta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hoja de Ruta (opcional)</FormLabel>
                  <FormControl>
                    <CustomSelect
                      defaultInputValue={field.value}
                      options={
                        Array.isArray(trazoInternCodes) ? trazoInternCodes : []
                      }
                      onChange={(option) => {
                        field.onChange(option?.value);
                      }}
                      getOptionLabel={(trazoInternCodes) =>
                        trazoInternCodes.value
                      }
                      getOptionValue={(trazoInternCodes) =>
                        trazoInternCodes.value
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={voucherForm.control}
            name="gloss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glosa</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setMainGloss(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2 mt-2">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={() => {
            if (voucherItems.length > 0 && mainGloss) {
              const updatedItems = voucherItems.map(item => ({
                ...item,
                gloss: mainGloss
              }));
              setVoucherItems(updatedItems);
              toast.success("Glosa aplicada a todos los items");
            } else {
              toast.warning("No hay items para actualizar o la glosa está vacía");
            }
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Aplicar glosa a todos los items
        </Button>
      </div>
          <br />
          <Button type="submit" disabled={!editionEnabled}>
            <span className="mr-2">Guardar Edicion de Registro {}</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
      <br />
      <FormEditVoucherItems
        accountDate={accountDate}
        type={type}
        voucherId={voucher!.id!}
        accountData={accountsQuery.data}
        voucherItems={voucherItems}
        setVoucherItems={setVoucherItems}
        voucher={voucher}
      />
      <br />
      <div className="flex justify-center gap-10 border">
        <div className="font-semibold">
          Total Debe Bs: {totalDebitBs.toFixed(2)}
        </div>
        <div className="font-semibold">
          Total Haber Bs: {totalAssetBs.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
