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
import axios from "axios";
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
  fetchAllModelSeats,
  fetchBranchList,
  fetchModelSeatsItems,
} from "@/lib/data";
import CustomSelect from "@/components/custom/select";

type FormNewVoucherProps = {
  type: VoucherType;
  routeType: VoucherTypeRoute;
};

export default function FormNewVoucher({
  type,
  routeType,
}: FormNewVoucherProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isTokenReady } = useToken();

  const [selectedModelSeat, setSelectedModelSeat] = useState(null);

  const [applyGlossToAll, setApplyGlossToAll] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [voucherItems, setVoucherItems] = useState<VoucherItem[]>([
    {
      debitBs: 0,
      debitSus: 0,
      assetBs: 0,
      assetSus: 0,
      gloss: "",
      accountId: "",
      voucherId: "",
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

  const {
    data: modelSeats,
    isLoading: isLoadingModelSeats,
    isPending: isPendingModelSeats,
  } = useQuery({
    queryKey: ["AllModelSeats"],
    queryFn: fetchAllModelSeats,
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<{ data: Account[] }> =>
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Account/Filter?isMotion=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    enabled: isTokenReady,
    staleTime: 1000 * 60 * 10,
  });

  const branchListQuery = useQuery({
    queryKey: ["branchList"],
    queryFn: fetchBranchList,
  });

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
      router.push(`/dashboard/${routeType}`); //de momento, luego pasar el route
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
    }
  }

  function onSubmit(values: Voucher) {
    // values["voucherDate"] = format(values.voucherDate, "yyyy/MM/dd");
    let validatedVoucherItems = voucherItems.map((item) => ({
      accountId: Number(item.accountId),
      debitBs: Number(item.debitBs),
      debitSus: Number(item.debitBs / values.exchangeRate),
      assetBs: Number(item.assetBs),
      assetSus: Number(item.assetBs / values.exchangeRate),
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
    branch: z.string().optional(),
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
    bankId: z.coerce.string().min(1),
    items: z.array(voucherItemSchema).optional(),
  });

  const voucherForm = useForm<z.infer<typeof voucherFormSchema>>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      exchangeRate: 6.97,
      branch: "",
      coin: "BOB",
      checkNum: "",
      gloss: "",
      bankId: "",
    },
  });

  const handleModelSeatChange = async (selectedOption: any) => {
    setSelectedModelSeat(selectedOption);
    const modelSeatDetails = await fetchModelSeatsItems(selectedOption.value);
    const updatedVoucherItems = modelSeatDetails.accounts.map((item) => ({
      ...voucherItems[0], // Usar el primer item como base o adaptar según sea necesario
      accountId: item.accountId,
    }));

    setVoucherItems(updatedVoucherItems);
  };

  useEffect(() => {
    let debitTotal = voucherItems.reduce((total, currentItem) => {
      return total + currentItem.debitBs;
    }, 0);

    let assetTotal = voucherItems.reduce((total, currentItem) => {
      return total + currentItem.assetBs;
    }, 0);

    setButtonEnabled(debitTotal === assetTotal);
  }, [voucherItems]);

  if (
    branchListQuery.isPending ||
    banksQuery.isLoading ||
    banksQuery.isPending ||
    banksQuery.data === undefined ||
    accountsQuery.isPending ||
    accountsQuery.isLoading ||
    accountsQuery.data === undefined ||
    modelSeats === undefined ||
    isLoadingModelSeats ||
    isPendingModelSeats
  ) {
    return <Spinner />;
  }

  return (
    <div>
      <Form {...voucherForm}>
        <form onSubmit={voucherForm.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Selecciona un Asiento Modelo
            </label>
            <CustomSelect
              options={modelSeats.map((seat) => ({
                label: seat.description,
                value: seat.id,
              }))}
              value={selectedModelSeat}
              onChange={handleModelSeatChange}
              isLoading={isLoadingModelSeats}
              placeholder="Selecciona un Asiento Modelo"
            />
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
            <FormField
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
                      {banksQuery.data.data.map((bank) => (
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
            <FormField
              control={voucherForm.control}
              name="branch"
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
                      {branchListQuery.data?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
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
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centro de costos</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Centro de costos" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Diego">Diego</SelectItem>
                      <SelectItem value="Daniel">Daniel</SelectItem>
                      <SelectItem value="Carmen">Carmen</SelectItem>
                      <SelectItem value="Monroy">Monroy</SelectItem>
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
            accountData={accountsQuery.data.data}
            voucherItems={voucherItems}
            setVoucherItems={setVoucherItems}
            applyGlossToAll={applyGlossToAll}
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
