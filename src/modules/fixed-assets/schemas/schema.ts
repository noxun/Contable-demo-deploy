import z from 'zod'

export const schemaFormFixedAssets = z.object({
  fixedAssetsId: z.union([z.string(), z.number()]),
  detail: z.string().nonempty({ message: 'Porfavor ingrese el detalle' }),
  reference: z.string().nonempty({ message: 'Porfavor ingrese la referencia' }),
  proveedor: z.string().nonempty({ message: 'Porfavor ingrese el proveedor' }),
  invoice: z.string().nonempty({ message: 'Porfavor ingrese la factura' }),
  registrationDate: z
    .string()
    .nonempty({ message: "Por favor seleccione la fecha de registro" })
    .refine((value) => value && !isNaN(new Date(value).getTime()), {
      message: "Debe ser una fecha válida",
    }),
  startDate: z
    .string()
    .nonempty({ message: "Por favor seleccione la fecha de inicio" })
    .refine((value) => value && !isNaN(new Date(value).getTime()), {
      message: "Debe ser una fecha válida",
    }),
  initialNetWorth: z.string(),
  previousDA: z.string(),
})