"use client";

import { useRouter } from "next/navigation";
import {
  Voucher,
  VoucherItem,
  VoucherType,
  VoucherTypeRoute,
} from "../types/sharedTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IBank } from "@/modules/banks/interface/banks";
import axios, { AxiosError } from "axios";
import { Account } from "@/modules/account/types/account";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MySelect from "react-select";
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
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import FormNewVoucherItems from "./FormNewVoucherItems";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Spinner from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import useToken from "../hooks/useToken";
import {
  changeBankExtractStatus,
  fetchAllModelSeats,
  fetchBranchList,
  fetchModelSeatsItems,
} from "@/lib/data";
import CustomSelect from "@/components/custom/select";
import useCostCenter from "../hooks/useCostCenter";
import useMotionAccounts from "../hooks/useMotionAccounts";
import useModelSeatsByType from "../hooks/useModelSeatsByType";
import useModelSeats from "../hooks/useModelSeats";

type FormNewVoucherProps = {
  type: VoucherType;
  routeType?: VoucherTypeRoute;
  bankId?: string;
  bankExtractId?: number;
  gloss?: string;
};

export default function FormNewVoucher({
  type,
  bankId,
  bankExtractId,
  routeType,
  gloss,
}: FormNewVoucherProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isTokenReady } = useToken();

  const [selectedModelSeat, setSelectedModelSeat] = useState(null);
  const [selectedModelSeatType, setSelectedModelSeatType] = useState<
    number | undefined
  >();

  const [applyGlossToAll, setApplyGlossToAll] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([
    {
      debitBs: null,
      debitSus: 0,
      assetBs: null,
      assetSus: 0,
      gloss: gloss ?? "",
      accountId: "",
      voucherId: "",
      canDebit: true,
      canAsset: true,
    },
  ]);

  const banksQuery = useQuery({
    queryKey: ["banks"],
    queryFn: async (): Promise<{ data: IBank[] }> =>
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Bank`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: isTokenReady,
    staleTime: 1000 * 60 * 10,
  });

  const changeBankExtractStatusMutation = useMutation({
    mutationFn: changeBankExtractStatus,
    onSuccess: () => {
      toast.success("Registrado correctamente");
      if (bankId) {
        queryClient.invalidateQueries({ queryKey: ["bankExcerpt", bankId] });
      }
    },
    onError: (error: AxiosError) => {
      toast.error("Error al registrar");
      console.log(error);
    },
  });

  const {
    data: modelSeats,
    isLoading: isLoadingModelSeats,
    isPending: isPendingModelSeats,
  } = useModelSeatsByType(selectedModelSeatType);

  const accountsQuery = useMotionAccounts();

  const branchListQuery = useQuery({
    queryKey: ["branchList"],
    queryFn: fetchBranchList,
  });

  const { data: costCenter, isLoading: isLoadingCostCenter } = useCostCenter();

  const newVoucherMutation = useMutation({
    mutationFn: async ({
      voucher,
      voucherItems,
      type,
    }: {
      voucher: Voucher;
      voucherItems: VoucherItem[];
      type: VoucherType;
    }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher`,
        {
          type: Number(type),
          ...voucher,
          items: voucherItems,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Voucher Creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      //router.push(`/dashboard/${routeType}`); //de momento, luego pasar el route
      // router.push("/dashboard/transactions/new");

      if (bankId && bankExtractId) {
        changeBankExtractStatusMutation.mutate(bankExtractId);
      }

      setVoucherItems([]);
      voucherForm.reset();
    },
    onError: (error) => {
      console.log(error);
      toast.error("error al insertar un voucher");
    },
  });

  function handleCheckboxChange() {
    setApplyGlossToAll(!applyGlossToAll);
    if (!applyGlossToAll) {
      const gloss = voucherForm.getValues("gloss");
      setVoucherItems((items) => items.map((item) => ({ ...item, gloss })));
    }else{
      const gloss = voucherForm.getValues("gloss");
      setVoucherItems((items) => items.map((item) => ({ ...item, gloss: "" })));
    }
  }

  function onSubmit(values: Voucher) {
    // values["voucherDate"] = format(values.voucherDate, "yyyy/MM/dd");
    let validatedVoucherItems = voucherItems.map((item) => ({
      accountId: Number(item.accountId),
      debitBs: Number(item.debitBs),
      debitSus: Number(item?.debitBs ?? 0 / values.exchangeRate),
      assetBs: Number(item.assetBs),
      assetSus: Number(item?.assetBs ?? 0 / values.exchangeRate),
      gloss: item.gloss,
    }));
    let newValues = {
      voucher: values,
      voucherItems: validatedVoucherItems,
      type,
    };
    console.log(newValues);
    newVoucherMutation.mutate(newValues);
  }

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
    sucursalId: z.string().optional(),
    costCenterId: z.coerce.number().optional(),
    voucherDate: z
      .string({
        required_error: "Fecha requerida.",
      })
      .or(z.date()),
    exchangeRate: z.coerce.number(),
    coin: z.enum(["USD", "BOB"]),
    checkNum: z.string().optional(),
    canceledTo: z
      .string({
        required_error: "Fecha requerida.",
      })
      .or(z.date())
      .optional(),
    gloss: z.string(),
    bankId: z.coerce.string().nullable(),
    items: z.array(voucherItemSchema).optional(),
    bankItemRef: z.number().optional(),
  });

  const voucherForm = useForm<z.infer<typeof voucherFormSchema>>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      exchangeRate: 6.97,
      coin: "BOB",
      checkNum: "",
      gloss: gloss ?? "",
      bankId: bankId ?? null,
      bankItemRef: bankExtractId, //ironico
    },
  });

  const handleModelSeatChange = async (selectedOption: any) => {
    setSelectedModelSeat(selectedOption);
    const modelSeatDetails = await fetchModelSeatsItems(selectedOption.value);
    const updatedVoucherItems = modelSeatDetails.accounts.map((item) => ({
      ...voucherItems[0], // Usar el primer item como base o adaptar según sea necesario
      accountId: item.accountId,
      canDebit: item.debit,
      canAsset: item.asset,
      debitBs: null,
      assetBs: null,
    }));

    setVoucherItems(updatedVoucherItems);
  };

  useEffect(() => {
    let debitTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.debitBs ?? 0);
    }, 0);

    let assetTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.assetBs ?? 0);
    }, 0);

    setButtonEnabled(debitTotal === assetTotal);
  }, [voucherItems]);

  if (
    branchListQuery.isPending ||
    branchListQuery.data === undefined ||
    banksQuery.isLoading ||
    banksQuery.isPending ||
    banksQuery.data === undefined ||
    accountsQuery.isPending ||
    accountsQuery.isLoading ||
    accountsQuery.data === undefined ||
    costCenter === undefined ||
    isLoadingCostCenter
  ) {
    return <Spinner />;
  }

  return (
    <div>
      <Form {...voucherForm}>
        <form onSubmit={voucherForm.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex w-full gap-2">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">
                  Selecciona un tipo de transacción para filtrar los asientos
                  modelo
                </label>
                <Select
                  value={
                    selectedModelSeatType !== undefined
                      ? selectedModelSeatType.toString()
                      : undefined
                  }
                  onValueChange={(value) => {
                    setSelectedModelSeatType(parseInt(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Traspaso</SelectItem>
                    <SelectItem value="1">Egreso</SelectItem>
                    <SelectItem value="2">Ingreso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium">
                  Selecciona un Asiento Modelo
                </label>
                <CustomSelect
                  options={(Array.isArray(modelSeats) ? modelSeats : []).map(
                    (seat) => ({
                      label: seat.description,
                      value: seat.id,
                    })
                  )}
                  value={selectedModelSeat}
                  onChange={handleModelSeatChange}
                  isLoading={isLoadingModelSeats}
                  isDisabled={selectedModelSeatType === undefined}
                  placeholder="Selecciona un Asiento Modelo"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <FormField
              control={voucherForm.control}
              name="voucherDate"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2 justify-around">
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
                            format(field.value, "dd 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          ) : (
                            <span>Seleccione la fecha</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value!)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={voucherForm.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>T/C</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
            {/* <FormField
              control={voucherForm.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Array.isArray(banksQuery.data.data)
                        ? banksQuery.data.data
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
            /> */}
            <FormField
              control={voucherForm.control}
              name="sucursalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Array.isArray(branchListQuery.data)
                        ? branchListQuery.data
                        : []
                      ).map((branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id.toString()}
                        >
                          {branch.nameSucutsal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={voucherForm.control}
              name="costCenterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de costos</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Centro de costos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Array.isArray(costCenter) ? costCenter : []).map(
                        (costCenter) => (
                          <SelectItem
                            key={costCenter.id}
                            value={costCenter.id.toString()}
                          >
                            {costCenter.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={voucherForm.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de registro</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de registro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ingreso">Ingreso</SelectItem>
                      <SelectItem value="Egreso">Egreso</SelectItem>
                      <SelectItem value="Traspaso">Traspaso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <FormField
            control={voucherForm.control}
            name="gloss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Glosa</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center mb-2">
            <label className="flex items-center">
              <Checkbox
                checked={applyGlossToAll}
                onCheckedChange={handleCheckboxChange}
                className="mr-2"
              />
              Aplicar glosa a todos los ítems
            </label>
          </div>
          <br />
          <FormNewVoucherItems
            accountData={accountsQuery.data}
            voucherItems={voucherItems}
            setVoucherItems={setVoucherItems}
            applyGlossToAll={applyGlossToAll}
            glossValue={voucherForm.getValues("gloss")}
          />
          <Button
            type="submit"
            disabled={!buttonEnabled || newVoucherMutation.isPending}
          >
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
}
