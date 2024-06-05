"use client";
import { ChangeEvent, useState } from "react";
import { IResponseConceptFolder } from "../interface/folders";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { FormConceptItems } from "./FormConceptItems";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { IBank } from "@/modules/banks/interface/banks";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Voucher,
  VoucherItem,
  VoucherType,
} from "@/modules/shared/types/sharedTypes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useToken from "@/modules/shared/hooks/useToken";

interface Props {
  data: IResponseConceptFolder[];
  numRef: string;
}
export const FormConceptFolder = (props: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {token, isTokenReady} = useToken();
  const { data, numRef } = props;
  const [concepts, setConcepts] = useState(
    data.map((item) => ({ ...item, amount: 0 }))
  );

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

  const conceptFormSchema = z.object({
    date: z
      .string({
        required_error: "Fecha requerida.",
      })
      .or(z.date())
      .optional(),
    exchangeRate: z.coerce.number(),
    checkNum: z.string().optional(),
    gloss: z.string(),
    bankId: z.coerce.string(),
  });

  const conceptForm = useForm<z.infer<typeof conceptFormSchema>>({
    resolver: zodResolver(conceptFormSchema),
    defaultValues: {
      date: "",
      exchangeRate: 6.97,
      checkNum: "",
      gloss: "",
      bankId: "",
    },
  });

  function onSubmit(values: any) {
    values["voucherDate"] = values.date;
    let validatedVoucherItems: {
      accountId: number;
      debitBs: number;
      debitSus: number;
      assetBs: number;
      assetSus: number;
      gloss: any;
      conceptExpenseId?: number;
      carpeta?: string;
    }[] = concepts
      .filter((item) => item.amount && item.amount > 0)
      .map((item) => ({
        accountId: Number(item.accountId),
        debitBs: item.typeOfExpense === "Planilla" ? Number(item.amount) : 0,
        debitSus:
          item.typeOfExpense === "Planilla"
            ? Number(item.amount / values.exchangeRate)
            : 0,
        assetBs: item.typeOfExpense === "Factura" ? Number(item.amount) : 0,
        assetSus:
          item.typeOfExpense === "Factura"
            ? Number(item.amount / values.exchangeRate)
            : 0,
        gloss: values.gloss,
        conceptExpenseId: item.id,
        carpeta: numRef,
      }));

    const totalDebitBs = Number(
      validatedVoucherItems
        .reduce(
          (total, payment) => Number(total) + Number(payment.debitBs ?? 0),
          0
        )
        .toFixed(2)
    );

    const totalDebitSus = Number(
      validatedVoucherItems
        .reduce(
          (total, payment) => Number(total) + Number(payment.debitSus ?? 0),
          0
        )
        .toFixed(2)
    );

    const totalAssetBs = Number(
      validatedVoucherItems
        .reduce(
          (total, payment) => Number(total) + Number(payment.assetBs ?? 0),
          0
        )
        .toFixed(2)
    );

    const totalAssetSus = Number(
      validatedVoucherItems
        .reduce(
          (total, payment) => Number(total) + Number(payment.assetSus ?? 0),
          0
        )
        .toFixed(2)
    );

    if (totalDebitBs > 0) {
      const bank = banksQuery
        ? banksQuery?.data?.data.filter(
            (item) => item.id === Number(values.bankId)
          )[0]
        : null;

      if (bank) {
        validatedVoucherItems.push({
          accountId: Number(bank.nroCuentaBancaria),
          debitBs: 0,
          debitSus: 0,
          assetBs: totalDebitBs,
          assetSus: totalDebitSus,
          gloss: values.gloss,
        });
      }
    }

    if (totalAssetBs > 0) {
      validatedVoucherItems.push({
        accountId: 164,
        debitBs: 0,
        debitSus: 0,
        assetBs: totalAssetBs,
        assetSus: totalAssetSus,
        gloss: values.gloss,
      });
    }

    let newValues = {
      voucher: {
        ...values,
        coin: "BOB",
      },
      voucherItems: validatedVoucherItems,
      type: 1,
    };
    newVoucherMutation.mutate(newValues);
  }

  const newVoucherMutation = useMutation({
    mutationFn: async ({
      voucher,
      voucherItems,
      type,
    }: {
      voucher: any;
      voucherItems: VoucherItem[];
      type: number;
    }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Voucher`,
        {
          type: type,
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
      queryClient.invalidateQueries({ queryKey: ["Vouchers", "1"] });
      router.push(`/dashboard/expenses`); //de momento, luego pasar el route
    },
    onError: (error) => {
      console.log(error);
      toast.error("error al insertar un voucher");
    },
  });

  if (banksQuery.isLoading || banksQuery.data === undefined) {
    return <Spinner />;
  }

  return (
    <div>
      <Form {...conceptForm}>
        <form onSubmit={conceptForm.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2">
            <FormField
              control={conceptForm.control}
              name="date"
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
                            format(field.value, "dd/MM/yyyy")
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
            <FormField
              control={conceptForm.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem className="w-fit">
                  <FormLabel>T/C</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={conceptForm.control}
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
          </div>
          <FormConceptItems concepts={concepts} setConcepts={setConcepts} />
          <div className="flex gap-2 mb-3">
            {/* {concepts.reduce(
              (total, payment) =>
                Number(total) +
                Number(
                  payment.typeOfExpense === "Planilla" ? payment.amount ?? 0 : 0
                ),
              0
            ) > 0 ? (
            ) : null} */}
            <div className="w-1/3">
              <FormField
                control={conceptForm.control}
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
            </div>
            <div className="w-full">
              <FormField
                control={conceptForm.control}
                name="gloss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Glosa</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            // disabled={!buttonEnabled || newVoucherMutation.isPending}
          >
            <span className="mr-2">Guardar Registro</span>
            <Save size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
};
