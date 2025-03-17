"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SchemaFixedAsset } from "../types/types";
import { schemaFormFixedAssets } from "../schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { postAssetFixed, putAssetFixed } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DatePickerField } from "./DatePickerField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { ListAssetsSelect } from "./ListAssetsSelect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";

interface Props {
  defaultValueForm: SchemaFixedAsset;
  mode: "create" | "edit";
  idAsset?: string | null;
}
export const FormFixedAssets = ({ defaultValueForm, mode, idAsset }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const fixedAssetForm = useForm<SchemaFixedAsset>({
    resolver: zodResolver(schemaFormFixedAssets),
    defaultValues: defaultValueForm,
  });
  const createMutation = useMutation({
    mutationFn: postAssetFixed,
    onMutate: () => {
      toast("Registrando activo fijo...");
    },
    onSuccess: () => {
      toast.success("Activo fijo registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["fixedAssets"] });
      fixedAssetForm.reset();
    },
    onError: (error) => {
      toast.error("Error al registrar el activo fijo");
      console.error("Ocurrio un error: ", error);
    },
  });
  const editMutation = useMutation({
    mutationFn: putAssetFixed,
    onMutate: () => {
      toast("Editando activo fijo...");
    },
    onSuccess: () => {
      toast.success("Activo fijo editado correctamente");
      router.replace("/dashboard/accounting/fixed-assets/new");
      queryClient.invalidateQueries({ queryKey: ["fixedAsset"] });
      queryClient.invalidateQueries({ queryKey: ["fixedAssets"] });
    },
    onError: (error) => {
      toast.error("Error al editar el activo fijo");
      console.error("Ocurrio un error: ", error);
    },
  });

  useEffect(() => {
    fixedAssetForm.reset(defaultValueForm);
  }, [defaultValueForm]);

  //logica para enviar el fomulario
  const onSumbit = (data: SchemaFixedAsset) => {
    if (mode === "create") return createMutation.mutate(data);
    if (mode === "edit" && idAsset)
      return editMutation.mutate({ IdAssets: idAsset, fixedAsset: data });
  };

  return (
    <>
      <Form {...fixedAssetForm}>
        <form
          className="flex flex-col items-end w-full justify-start gap-4"
          onSubmit={fixedAssetForm.handleSubmit(onSumbit)}
        >
          <div className="w-full flex md:flex-row flex-col justify-between md:items-start items-center gap-2 md:gap-8 ">
            <FormField
              name="fixedAssetsId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Activos</FormLabel>
                  <ListAssetsSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormItem>
              )}
            />

            <FormField
              name="registrationDate"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de registro</FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={field.value}
                      onChange={(date: string | null) => {
                        const formattedDate = date
                          ? format(new Date(date), "yyyy-MM-dd")
                          : "";
                        field.onChange(formattedDate);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="startDate"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de inicio</FormLabel>
                  <FormControl>
                    <DatePickerField
                      value={field.value}
                      onChange={(date: string | null) => {
                        const formattedDate = date
                          ? format(new Date(date), "yyyy-MM-dd")
                          : "";
                        field.onChange(formattedDate);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:gap-8 w-full gap-2">
            <FormField
              name="proveedor"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el proveedor"
                      {...field}
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="reference"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese la referencia"
                      {...field}
                    ></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:gap-8 w-full gap-2 md:flex-row flex-col">
            <div className="w-full flex flex-col gap-4 basis-1/3 flex-wrap">
              <FormField
                name="invoice"
                control={fixedAssetForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Factura</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese la factura"
                        {...field}
                      ></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="initialNetWorth"
                control={fixedAssetForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Neto Inicial</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="previousDA"
                control={fixedAssetForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciación de Patrimonio Neto</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="basis-2/3 flex flex-col items-end gap-4">
              <FormField
                name="detail"
                control={fixedAssetForm.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Detalle</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none"
                        rows={7}
                        placeholder="Ingrese una descripción detallada"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="flex items-center justify-center gap-2"
                disabled={createMutation.isPending}
              >
                <Save size={20} />
                {mode === "create" ? " Guardar" : " Actualizar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
