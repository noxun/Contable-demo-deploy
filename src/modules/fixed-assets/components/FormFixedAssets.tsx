"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { SchemaFixedAsset } from "../types/types"
import { schemaFormFixedAssets } from "../schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { postAssetFixed } from "@/lib/data"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerField } from "./DatePickerField"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export const FormFixedAssets = () => {

  const fixedAssetForm = useForm<SchemaFixedAsset>({
    resolver: zodResolver(schemaFormFixedAssets),
    defaultValues: {
      fixedAssetsId: '',
      detail: '',
      reference: '',
      proveedor: '',
      invoice: '',
      registrationDate: '',
      startDate: '',
      initialNetWorth: 0,
      previousDA: 0,
    }
  })

  const mutation = useMutation({
    mutationFn: postAssetFixed,
    onMutate: () => {
      toast("Registrando activo fijo...")
    },
    onSuccess: () => {
      toast.success("Activo fijo registrado correctamente")
      fixedAssetForm.reset()
    },
    onError: (error) => {
      toast.error("Error al registrar el activo fijo")
      console.error('Ocurrio un error: ', error)
    }
  })

  //logica para enviar el fomulario
  const onSumbit = (data: SchemaFixedAsset) => {
    mutation.mutate(data)
  }


  return (
    <Form {...fixedAssetForm} >
      <form
        className="flex flex-col items-end w-full justify-start gap-4"
        onSubmit={fixedAssetForm.handleSubmit(onSumbit)}
      >
        <div className='w-full flex md:flex-row flex-col justify-between md:items-start items-center gap-2 md:gap-8 '>
          <FormField
            name='fixedAssetsId'
            render={({ field }) => (
              <FormItem className='flex flex-col' >
                <FormLabel>Activos</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-w-[240px]">
                      <SelectValue placeholder="Seleccione un activo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">EDIFICIOS</SelectItem>
                    <SelectItem value="2">MUEBLES Y ENSERES</SelectItem>
                    <SelectItem value="3">MAQUINARIAS EN GENERAL</SelectItem>
                    <SelectItem value="4">VEHICULOS</SelectItem>
                    <SelectItem value="5">HERRAMIENTAS</SelectItem>
                    <SelectItem value="6">EQUIPOS DE COMPUTACION</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            name="registrationDate"
            control={fixedAssetForm.control}
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Fecha de registro</FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="startDate"
            control={fixedAssetForm.control}
            render={({ field }) => (
              <FormItem className='flex flex-col' >
                <FormLabel>Fecha de inicio</FormLabel>
                <FormControl>
                  <DatePickerField
                    value={field.value}
                    onChange={field.onChange}
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
              <FormItem className='w-full'>
                <FormLabel>Proveedor</FormLabel>
                <FormControl>
                  <Input  {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="reference"
            control={fixedAssetForm.control}
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Referencia</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex md:gap-8 w-full gap-2 md:flex-row flex-col">
          <div className='w-full flex flex-col gap-4 basis-1/3 flex-wrap'>
            <FormField
              name="invoice"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Factura</FormLabel>
                  <FormControl>
                    <Input placeholder='Ingrese la factura' {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="initialNetWorth"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Valor Neto Inicial</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="previousDA"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Depreciación de Patrimonio Neto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className='basis-2/3 flex flex-col items-end gap-4'>
            <FormField
              name="detail"
              control={fixedAssetForm.control}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Detalle</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='resize-none'
                      rows={7}
                      placeholder="Ingrese una descripción detallada"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button>
              {mutation.isPending ? "Cargando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}