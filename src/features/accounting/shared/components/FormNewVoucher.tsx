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
import { IBank } from "@/features/accounting/banks/interface/banks";
import axios, { AxiosError } from "axios";
import { Account } from "@/features/accounting/account/types/account";
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
import { format, isValid, parse, set } from "date-fns";
import { es } from "date-fns/locale";
import Spinner from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import useToken from "../hooks/useToken";
import {
  changeBankExtractStatus,
  fetchAllModelSeats,
  fetchBranchList,
  fetchModelSeatsItems,
  postCompanyOrConcept,
} from "@/lib/data";
import CustomSelect from "@/components/custom/select";
import useCostCenter from "../../cost-center/hooks/useCostCenter";
import useMotionAccounts from "../hooks/useMotionAccounts";
import useModelSeatsByType from "../hooks/useModelSeatsByType";
import useModelSeats from "../hooks/useModelSeats";
import useTrazoInternCodesByCompanyId from "../hooks/useTrazoInternCodesByCompanyId";
import useTrazoCompanies from "../hooks/useTrazoCompanies";
import CreatableSelect from "react-select/creatable";
import {
  RegisterVoucherByDocumentResponse,
  TrazoCompany,
  VoucherItemFromExtractedPDF,
} from "@/lib/types";
import { Label } from "@/components/ui/label";
import PdfVoucher from "./PdfVoucher";
import { Switch } from "@/components/ui/switch";

type FormNewVoucherProps = {
  type: VoucherType;
  routeType?: VoucherTypeRoute;
  bankId?: string;
  bankExtractId?: number;
  gloss?: string;
  voucherItemsFromExtractedPDF?: VoucherItemFromExtractedPDF[];
  voucherFromRegisterByDocResponse?: RegisterVoucherByDocumentResponse;
  bankAccountId?: string;
  amountFromExtract?: number;
  dateFromExtract?: string;
  seatBlockType?: ModelBloque;
};

export type ModelBloque = "C" | "D" | "";

const iva = 0.13;
const it = 0.03;
const fact = 0.16;

const processVoucherItems = (
  voucherItems: VoucherItem[],
  invoiceValue: string,
  fact: number,
  it: number,
  iva: number,
  totalDebit: number,
  bloque: ModelBloque
) => {
  console.log("Called!");
  console.log(voucherItems);

  if (!invoiceValue || (isNaN(Number(invoiceValue)) && !invoiceValue))
    return voucherItems;

  const updatedItems = [...voucherItems];

  const factVoucherItem = voucherItems.findIndex(({ accountDescription }) =>
    accountDescription?.startsWith("FACT.")
  );

  const itVoucherItem = voucherItems.findIndex(({ accountDescription }) =>
    accountDescription?.startsWith("IT POR PAGAR")
  );

  const ivaVoucherItem = voucherItems.findIndex(
    ({ accountDescription }) =>
      accountDescription?.startsWith("IVA") ||
      accountDescription?.startsWith("DEBITO FISCAL IVA")
  );

  const utVoucherItem = voucherItems.findIndex(({ accountDescription }) =>
    accountDescription?.startsWith("UT ENCARGAD")
  );

  const iaTransaccionesItem = voucherItems.findIndex(({ accountDescription }) =>
    accountDescription?.startsWith("IMPUESTOS A LAS TRANSACCIONES")
  );

  const htVoucherItem = voucherItems.findIndex(({ accountDescription }) =>
    accountDescription?.startsWith("HT ")
  );

  console.log(
    factVoucherItem,
    itVoucherItem,
    ivaVoucherItem,
    utVoucherItem,
    iaTransaccionesItem,
    htVoucherItem
  );

  const values = {
    factVal: Number(invoiceValue) * fact,
    itVal: Number(invoiceValue) * it,
    ivaVal: Number(invoiceValue) * iva,
    utVal: totalDebit - Number(invoiceValue) * fact,
    iatVal: Number(invoiceValue) * it,
    htVal: totalDebit - Number(invoiceValue) * iva - Number(invoiceValue) * it,
  };
  console.log("values", values);

  if (factVoucherItem !== -1 && bloque === "C") {
    updatedItems[factVoucherItem] = {
      ...updatedItems[factVoucherItem],
      assetBs: values.factVal,
    };
  }

  if (itVoucherItem !== -1 && bloque === "D") {
    updatedItems[itVoucherItem] = {
      ...updatedItems[itVoucherItem],
      assetBs: values.itVal,
    };
  }

  if (ivaVoucherItem !== -1 && bloque === "D") {
    updatedItems[ivaVoucherItem] = {
      ...updatedItems[ivaVoucherItem],
      assetBs: values.ivaVal,
    };
  }

  if (utVoucherItem !== -1 && bloque === "C") {
    updatedItems[utVoucherItem] = {
      ...updatedItems[utVoucherItem],
      assetBs: values.utVal,
    };
  }

  if (iaTransaccionesItem !== -1 && bloque === "D") {
    updatedItems[iaTransaccionesItem] = {
      ...updatedItems[iaTransaccionesItem],
      debitBs: values.iatVal,
    };
  }

  if (
    htVoucherItem !== -1 &&
    ivaVoucherItem !== -1 &&
    itVoucherItem !== -1 &&
    bloque === "D"
  ) {
    updatedItems[htVoucherItem] = {
      ...updatedItems[htVoucherItem],
      assetBs: values.htVal,
    };
  }

  console.log(updatedItems);

  return updatedItems;
};

export default function FormNewVoucher({
  type,
  bankId,
  bankExtractId,
  routeType,
  gloss,
  voucherItemsFromExtractedPDF,
  voucherFromRegisterByDocResponse,
  bankAccountId,
  amountFromExtract,
  dateFromExtract,
  seatBlockType,
}: FormNewVoucherProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isTokenReady } = useToken();

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedCompanyOption, setSelectedCompanyOption] = useState<null | {
    value: number;
    label: string;
  }>(null);
  const [isCreatingOption, setIsCreatingOption] = useState(false);

  const [selectedModelSeat, setSelectedModelSeat] = useState(null);
  const [selectedModelSeatType, setSelectedModelSeatType] = useState<
    number | undefined
  >();
  const [selectedBloque, setSelectedBloque] = useState<ModelBloque>(
    seatBlockType ?? ""
  );

  const [applyGlossToAll, setApplyGlossToAll] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [totalDebitValue, setTotalDebitValue] = useState(0);
  const [totalAssetValue, setTotalAssetValue] = useState(0);

  const [automaticRateConversionEnabled, setAutomaticRateConversionEnabled] =
    useState(true);

  const [isDollarEditionActive, setIsDollarEditionActive] = useState(false);

  // New state for gloss prefix checkboxes
  const [isCompraChecked, setIsCompraChecked] = useState(false);
  const [isVentaChecked, setIsVentaChecked] = useState(false);

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

  if (voucherItemsFromExtractedPDF) {
    voucherItemsFromExtractedPDF.forEach((item) => {
      setVoucherItems((items) => [
        ...items,
        {
          debitBs: item.importValue,
          debitSus: 0,
          assetBs: 0,
          assetSus: 0,
          gloss: gloss ?? "",
          accountId: item.accountId.toString(),
          voucherId: "",
          canDebit: true,
          canAsset: true,
        },
      ]);
    });
  }

  useEffect(() => {
    if (
      voucherFromRegisterByDocResponse &&
      voucherFromRegisterByDocResponse.items
    ) {
      const newItems: VoucherItem[] =
        voucherFromRegisterByDocResponse.items.map((item) => ({
          debitBs: item.debitBs,
          debitSus: item.debitSus,
          assetBs: item.assetBs,
          assetSus: item.assetSus,
          gloss: item.gloss,
          accountId: item.accountId.toString(),
          voucherId: item.voucherId,
          canDebit: true,
          canAsset: true,
          accountDescription: item.description,
        }));

      setVoucherItems(newItems);
    }
  }, [voucherFromRegisterByDocResponse]);

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
    onSuccess: (data) => {
      console.log(data);
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

  const {
    data: modelSeats,
    isLoading: isLoadingModelSeats,
    isPending: isPendingModelSeats,
  } = useModelSeatsByType(selectedModelSeatType);

  const accountsQuery = useMotionAccounts();

  const {
    data: trazoCompanies,
    isLoading: isLoadingTrazoCompanies,
    isError: isErrorTrazoCompanies,
  } = useTrazoCompanies();
  const {
    data: trazoInternCodes,
    isPending: isPendingTrazoInternCodes,
    isError: isErrorInternCodes,
  } = useTrazoInternCodesByCompanyId(selectedCompanyId);

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
      return response.data as { id: number; type: number };
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Voucher Creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["Vouchers", type] });
      //router.push(`/dashboard/accounting/${routeType}`); //de momento, luego pasar el route
      // router.push("/dashboard/accounting/transactions/new");

      if (bankId && bankExtractId) {
        changeBankExtractStatusMutation.mutate(bankExtractId);
      }

      setVoucherItems([]);
      voucherForm.reset();
      setSelectedCompanyOption(null);
      setSelectedCompanyId(null);
      //setSelectedModelSeat(null);
      //setSelectedModelSeatType(undefined);
      setApplyGlossToAll(false);
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
    } else {
      const gloss = voucherForm.getValues("gloss");
      setVoucherItems((items) => items.map((item) => ({ ...item, gloss: "" })));
    }
  }

  function handleCompraCheckboxChange() {
    const currentGloss = voucherForm.getValues("gloss");

    if (!isCompraChecked) {
      // Adding "por la compra" prefix
      setIsCompraChecked(true);
      setIsVentaChecked(false); // Ensure only one can be active

      // Remove "por la venta" if it exists, then add "por la compra"
      const cleanGloss = currentGloss.replace(/^por la venta\s*/i, "");
      voucherForm.setValue("gloss", `por la compra ${cleanGloss}`);
    } else {
      // Removing "por la compra" prefix
      setIsCompraChecked(false);
      const cleanGloss = currentGloss.replace(/^por la compra\s*/i, "");
      voucherForm.setValue("gloss", cleanGloss);
    }
  }

  function handleVentaCheckboxChange() {
    const currentGloss = voucherForm.getValues("gloss");

    if (!isVentaChecked) {
      // Adding "por la venta" prefix
      setIsVentaChecked(true);
      setIsCompraChecked(false); // Ensure only one can be active

      // Remove "por la compra" if it exists, then add "por la venta"
      const cleanGloss = currentGloss.replace(/^por la compra\s*/i, "");
      voucherForm.setValue("gloss", `por la venta ${cleanGloss}`);
    } else {
      // Removing "por la venta" prefix
      setIsVentaChecked(false);
      const cleanGloss = currentGloss.replace(/^por la venta\s*/i, "");
      voucherForm.setValue("gloss", cleanGloss);
    }
  }

  function handleGlossChange(value: string) {
    // This function is now just for the checkbox changes
    return value;
  }

  function handleGlossKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    
    // Check if we're trying to delete protected prefix
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const protectedPrefix = isCompraChecked ? 'por la compra ' : 
                            isVentaChecked ? 'por la venta ' : '';
      
      if (protectedPrefix) {
        const prefixLength = protectedPrefix.length;
        
        // Prevent deletion if cursor is within the protected prefix
        if (e.key === 'Backspace' && selectionStart <= prefixLength) {
          e.preventDefault();
          return;
        }
        
        if (e.key === 'Delete' && selectionStart < prefixLength) {
          e.preventDefault();
          return;
        }
        
        // Prevent selection that includes the protected prefix
        if (selectionStart < prefixLength && selectionEnd > selectionStart) {
          e.preventDefault();
          return;
        }
      }
    }
  }

  function handleGlossBeforeInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;
    
    const protectedPrefix = isCompraChecked ? 'por la compra ' : 
                          isVentaChecked ? 'por la venta ' : '';
    
    if (protectedPrefix) {
      const prefixLength = protectedPrefix.length;
      
      // Prevent input that would overwrite the protected prefix
      if (selectionStart < prefixLength) {
        e.preventDefault();
        return;
      }
    }
  }

  function onSubmit(values: Voucher) {
    let debitTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.debitBs ?? 0);
    }, 0);
    let assetTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.assetBs ?? 0);
    }, 0);

    if (Number(debitTotal.toFixed(2)) === Number(assetTotal.toFixed(2))) {
      toast.info("La suma del debe y haber es correcta");
    } else {
      toast.warning(
        "La suma del debe y haber no es igual, corrija e intente de nuevo"
      );
      return;
    }

    if(voucherItems?.some(item => typeof item.gloss !== "string" || item.gloss.trim() === "")) {
      toast.error("Todos los items deben tener una glosa");
      return;
    }

    // values["voucherDate"] = format(values.voucherDate, "yyyy/MM/dd");
    let validatedVoucherItems = voucherItems.map((item) => ({
      accountId: Number(item.accountId),
      debitBs: Number(item.debitBs),
      debitSus: Number(
        item.debitSus ?? (item.debitBs ?? 0) / values.exchangeRate
      ),
      assetBs: Number(item.assetBs),
      assetSus: Number(
        item.assetSus ?? (item.assetBs ?? 0) / values.exchangeRate
      ),
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

  const voucherFormSchema = z
    .object({
      id: z.number().optional(),
      num: z.number().optional(),
      sucursalId: z.string().optional(),
      costCenterId: z.string().optional(),
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
      gloss: z
        .string()
        .min(5, {
          message: "El campo glosa debe tener al menos 5 caracteres.",
        }),
      bankId: z.coerce.string().nullable(),
      items: z.array(voucherItemSchema).optional(),
      bankItemRef: z.number().optional(),
      hojaDeRuta: z.string().optional(),
      provider: z.string().optional(),
      invoice: z.string().optional(),
      invoiceNumber: z.string().optional(),
      nit: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      return {
        ...data,
        sucursalId: data.sucursalId ? Number(data.sucursalId) : null,
        costCenterId: data.costCenterId ? Number(data.costCenterId) : null,
      };
    });
  let voucherDefaultValues = null;
  const defaultValues = {
    voucherDate: format(new Date(), "yyyy-MM-dd"),
    exchangeRate: 6.97,
    coin: "BOB" as "USD" | "BOB",
    checkNum: "0",
    gloss: gloss ?? "",
    bankId: bankId ?? null,
    bankItemRef: bankExtractId, //ironico
    costCenterId: "",
    sucursalId: "",
    invoice: "",
    invoiceNumber: "",
    provider: "",
    nit: "",
  };
  if (voucherFromRegisterByDocResponse) {
    voucherDefaultValues = {
      voucherDate: voucherFromRegisterByDocResponse.voucherDate 
        ? format(new Date(voucherFromRegisterByDocResponse.voucherDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      exchangeRate: voucherFromRegisterByDocResponse.exchangeRate ?? 6.97,
      coin: (voucherFromRegisterByDocResponse.coin as "USD" | "BOB") ?? "BOB",
      checkNum: voucherFromRegisterByDocResponse.checkNum ?? "0",
      gloss: voucherFromRegisterByDocResponse.gloss ?? "",
      bankId: voucherFromRegisterByDocResponse.bankId ?? null,
      bankItemRef: bankExtractId, //ironico
      costCenterId:
        voucherFromRegisterByDocResponse.costCenterId.toString() ?? "",
      sucursalId: voucherFromRegisterByDocResponse.sucursalId.toString() ?? "",
      hojaDeRuta: voucherFromRegisterByDocResponse.hojaDeRuta ?? "",
    };
  } else {
    voucherDefaultValues = defaultValues;
  }

  const voucherForm = useForm<z.infer<typeof voucherFormSchema>>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: voucherDefaultValues,
  });

  useEffect(() => {
    if (bankAccountId && amountFromExtract) {
      if (dateFromExtract !== undefined) {
        //ESTO PROBABLEMENTE SEA DIFERENTE EN JETSTAR O LOGAL
        const parsedDate = parse(
          dateFromExtract,
          "d/M/yyyy HH:mm:ss",
          new Date()
        );

        if (isValid(parsedDate)) {
          const formattedDate = format(parsedDate, "yyyy-MM-dd");
          voucherForm.setValue("voucherDate", formattedDate);
        } else {
          console.log("Fecha no valida");
        }
      }

      if (amountFromExtract > 0) {
        setVoucherItems([
          {
            debitBs: 0,
            debitSus: 0,
            assetBs: Math.abs(amountFromExtract),
            assetSus: 0,
            gloss: gloss ?? "",
            accountId: bankAccountId,
            voucherId: "",
            canDebit: true,
            canAsset: true,
          },
        ]);
      } else {
        setVoucherItems([
          {
            debitBs: Math.abs(amountFromExtract),
            debitSus: 0,
            assetBs: 0,
            assetSus: 0,
            gloss: gloss ?? "",
            accountId: bankAccountId,
            voucherId: "",
            canDebit: true,
            canAsset: true,
          },
        ]);
      }
    }
  }, [amountFromExtract, dateFromExtract, voucherForm, bankAccountId, gloss]);

  const voucherDate = voucherForm.watch("voucherDate");
  const invoiceValue = voucherForm.watch("invoice");
  const exchangeRate = voucherForm.watch("exchangeRate");
  const coin = voucherForm.watch("coin");

  const handleModelSeatChange = async (selectedOption: any) => {
    setVoucherItems([]);
    setSelectedModelSeat(selectedOption);
    const modelSeatDetails = await fetchModelSeatsItems(selectedOption.value);

    if (modelSeatDetails.description.toUpperCase().includes("BLOQUE - C")) {
      setSelectedBloque("C");
    }
    if (modelSeatDetails.description.toUpperCase().includes("BLOQUE - D")) {
      setSelectedBloque("D");
    }

    const flatAccounts = accountsQuery?.data?.flat() ?? [];

    const accountMap = new Map(flatAccounts.map((acc) => [acc.id, acc]));

    const enrichedAccounts = modelSeatDetails.accounts.map((acc) => {
      const matched = acc.accountId && accountMap.get(Number(acc.accountId));
      if (matched === undefined || matched === 0) return;
      return {
        ...acc,
        accountDescription: matched?.description ?? undefined,
      };
    });

    const updatedVoucherItems = modelSeatDetails.accounts.map(
      (item, index) => ({
        // ...voucherItems[0],
        accountId: item.accountId,
        accountDescription: enrichedAccounts[index]?.accountDescription,
        canDebit: item.debit,
        canAsset: item.asset,
        debitBs: null,
        assetBs: null,
        debitSus: 0,
        assetSus: 0,
        gloss: "",
        percentage: item.percentage,
      })
    );

    setVoucherItems(updatedVoucherItems);
  };

  useEffect(() => {
    let debitTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.debitBs ?? 0);
    }, 0);
    let assetTotal = voucherItems.reduce((total, currentItem) => {
      return total + (currentItem?.assetBs ?? 0);
    }, 0);

    setTotalDebitValue(debitTotal);
    setTotalAssetValue(assetTotal);

    // Use Math.abs to compare with a small epsilon value
    // setButtonEnabled(Math.abs(debitTotal - assetTotal) < 0.01);
    if (Number(debitTotal.toFixed(2)) === Number(assetTotal.toFixed(2))) {
      setButtonEnabled(true);
    }
  }, [voucherItems]);

  // Move this function up so it's defined before useEffect
  const formatDateForText = (date: any) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd") + ": ";
  };

  useEffect(() => {
    if (voucherDate && voucherFromRegisterByDocResponse) {
      // Get current text value without the date prefix
      const currentText = voucherForm.watch("gloss");
      const oldDatePrefix = currentText.match(/^\d{4}-\d{2}-\d{2}: /);

      // Remove old date prefix if it exists
      const textWithoutDate = oldDatePrefix
        ? currentText.substring(oldDatePrefix[0].length)
        : currentText;

      // Add new date prefix
      voucherForm.setValue(
        "gloss",
        formatDateForText(voucherDate) + textWithoutDate
      );
    }
  }, [voucherForm, voucherDate, voucherFromRegisterByDocResponse]);

  useEffect(() => {
    // Only process if there are items and invoice value exists

    if (voucherItems.length > 0 && invoiceValue) {
      const processedItems = processVoucherItems(
        voucherItems,
        invoiceValue,
        fact,
        it,
        iva,
        totalDebitValue,
        selectedBloque
      );

      console.log(processedItems);

      // Only update if there's an actual change
      if (JSON.stringify(processedItems) !== JSON.stringify(voucherItems)) {
        setVoucherItems(processedItems);
      }
    }
  }, [
    invoiceValue,
    voucherItems,
    setVoucherItems,
    totalDebitValue,
    selectedBloque,
  ]);

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
    isLoadingCostCenter ||
    isLoadingTrazoCompanies ||
    trazoCompanies === undefined
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
                  <FormLabel>Fecha*</FormLabel>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value instanceof Date
                        ? field.value.toISOString().split("T")[0]
                        : field.value
                    }
                  />
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
                  <FormLabel>Valor de la Factura</FormLabel>
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
                  <FormLabel>Moneda*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormLabel>Sucursal*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormLabel>Centro de costos*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
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
            <div
              className={`space-y-2 ${
                voucherFromRegisterByDocResponse ? "hidden" : ""
              }`}
            >
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
            {isPendingTrazoInternCodes ? (
              <div
                className={`${
                  voucherFromRegisterByDocResponse ? "hidden" : ""
                }`}
              >
                Cargando, Seleccione un cliente para mostrar sus hojas de
                ruta...
              </div>
            ) : (
              <FormField
                control={voucherForm.control}
                name="hojaDeRuta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoja de Ruta (opcional)</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={
                          Array.isArray(trazoInternCodes)
                            ? trazoInternCodes
                            : []
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
            )}
            {voucherFromRegisterByDocResponse?.hojaDeRuta ? (
              <FormField
                control={voucherForm.control}
                name="hojaDeRuta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hoja de Ruta</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
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
                  <Textarea 
                    placeholder="" 
                    className="resize-none" 
                    {...field}
                    onKeyDown={handleGlossKeyDown}
                    onBeforeInput={handleGlossBeforeInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center my-2 space-x-2">
            <Switch
              id="dollar-edition"
              checked={isDollarEditionActive}
              onCheckedChange={() => {
                setIsDollarEditionActive(!isDollarEditionActive);
              }}
            />
            <Label htmlFor="dollar-edition">Edición de dolares</Label>
          </div>
          <div className="flex items-center mb-2 gap-2">
            <label className="flex items-center">
              <Checkbox
                checked={applyGlossToAll}
                onCheckedChange={handleCheckboxChange}
                className="mr-2"
              />
              Aplicar glosa a todos los ítems
            </label>
            {isDollarEditionActive && (
              <label className="flex items-center">
                <Checkbox
                  checked={automaticRateConversionEnabled}
                  onCheckedChange={() =>
                    setAutomaticRateConversionEnabled(
                      !automaticRateConversionEnabled
                    )
                  }
                  className="mr-2"
                />
                Activar conversion automatica de tasas
              </label>
            )}
          </div>
          <div className="flex items-center mb-2 gap-4">
            <label className="flex items-center">
              <Checkbox
                checked={isCompraChecked}
                onCheckedChange={handleCompraCheckboxChange}
                className="mr-2"
              />
              Por la compra
            </label>
            <label className="flex items-center">
              <Checkbox
                checked={isVentaChecked}
                onCheckedChange={handleVentaCheckboxChange}
                className="mr-2"
              />
              Por la venta
            </label>
          </div>
          <br />
          <FormNewVoucherItems
            accountData={accountsQuery.data}
            voucherItems={voucherItems}
            setVoucherItems={setVoucherItems}
            applyGlossToAll={applyGlossToAll}
            glossValue={voucherForm.getValues("gloss")}
            totalDebitValue={totalDebitValue}
            totalAssetValue={totalAssetValue}
            automaticRateConversionEnabled={automaticRateConversionEnabled}
            coin={coin}
            exchangeRate={exchangeRate}
            isDollarEditionActive={isDollarEditionActive} // this time for testing
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!buttonEnabled || newVoucherMutation.isPending}
            >
              <span className="mr-2">Guardar Registro</span>
              <Save size={20} />
            </Button>
            {newVoucherMutation.data ? (
              <PdfVoucher
                id={newVoucherMutation.data.id}
                type={newVoucherMutation.data.type.toString() as VoucherType}
                triggerTitle="Ver Comprobante del Ultimo Creado"
                isButton
              />
            ) : (
              <Button type="button" disabled>
                Ver Comprobante del Ultimo Creado
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
