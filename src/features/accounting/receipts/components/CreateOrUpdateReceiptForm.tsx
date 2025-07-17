"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  StoreReceipt,
  storeReceiptSchema,
  Receipt,
} from "../schemas/receiptSchema";
import { useCreateReceipt, useUpdateReceipt } from "../hooks/useReceipts";

interface CreateOrUpdateReceiptFormProps {
  receipt?: Receipt;
  onSuccess?: () => void;
  mode: "create" | "edit";
}

export function CreateOrUpdateReceiptForm({
  receipt,
  onSuccess,
  mode,
}: CreateOrUpdateReceiptFormProps) {
  const createReceiptMutation = useCreateReceipt();
  const updateReceiptMutation = useUpdateReceipt();

  const form = useForm<StoreReceipt>({
    resolver: zodResolver(storeReceiptSchema),
    defaultValues: {
      concept: receipt?.concept || "",
      amountBs: receipt?.amountBs || 0,
      amountSus: receipt?.amountSus || 0,
      receiverName: receipt?.receiverName || "",
      receiverId: receipt?.receiverId || null,
      payerName: receipt?.payerName || "",
      payerId: receipt?.payerId || null,
    },
  });

  const onSubmit = (data: StoreReceipt) => {
    if (mode === "edit" && receipt) {
      updateReceiptMutation.mutate({ id: receipt.id, receipt: data });
      onSuccess?.();
    } else {
      createReceiptMutation.mutate(data);
      onSuccess?.();
    }
  };

  const isLoading =
    createReceiptMutation.isPending || updateReceiptMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="concept"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concepto</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el concepto del recibo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amountBs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto en Bs</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value || 0)
                      }
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountSus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto en $US</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="receiverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Receptor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese el nombre del receptor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="receiverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Receptor (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID del receptor"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="payerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Pagador</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre del pagador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
{/* 
        <FormField
          control={form.control}
          name="payerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Pagador (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID del pagador"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading
            ? mode === "edit"
              ? "Actualizando..."
              : "Creando..."
            : mode === "edit"
            ? "Actualizar Recibo"
            : "Crear Recibo"}
        </Button>
      </form>
    </Form>
  );
}
