import z from 'zod'

export const SchemaPayroll = z.object({
  DateNow: z
    .string()
    .nonempty({ message: "Por favor seleccione la fecha de registro" })
    .refine((value) => value && !isNaN(new Date(value).getTime()), {
      message: "Debe ser una fecha válida",
    }),
  Nombres: z.string().nonempty({ message: "El nombre es obligatorio" }),
  Area: z.string().nonempty({ message: "El área es obligatoria" }),
  Sexo: z.enum(["F", "M"], { message: "Seleccione un genero" }),
  Cargo: z.string().nonempty({ message: "El cargo es obligatorio" }),
  EntryDate: z
    .string()
    .nonempty({ message: "Por favor seleccione la fecha de registro" })
    .refine((value) => value && !isNaN(new Date(value).getTime()), {
      message: "Debe ser una fecha válida",
    }),
  SalaryTaxReturn: z
    .string()
    .nonempty({ message: "El salario sujeto a impuestos es obligatorio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, { message: "El salario debe ser un número mayor a 0" }),
  InternalPayrollSalary: z
    .string()
    .nonempty({ message: "El salario de la planilla interna es obligatorio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, { message: "El salario debe ser un número mayor a 0" }),
});

export const SchemaSalary = z.object({
  salariesAndwagesId: z.string().nonempty({ message: "El id de planilla es obligatorio" }),
  productionBonus: z
    .string()
    .nonempty({ message: "El bono de produccion no puede estar vacio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, { message: "El bono debe ser un número mayor a 0" }),
  extraTimeMinutes: z
    .string()
    .nonempty({ message: "El tiempo extra no puede estar vacio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, { message: "El tiempo extra debe ser un número mayor a 0" }),
  valueForOvertime: z
    .string()
    .nonempty({ message: "El valor por horas extra es obligatorio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value))
    .refine((value) => value > 0, { message: "El valor por horas extra debe ser mayor a 0" }),
  loan: z
    .string()
    .nonempty({ message: "El prestamo no puede estar vacio" })
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => parseFloat(value)),
  exelTrainingCorse: z
    .string()
    .default("0")
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => Math.max(0, parseFloat(value)))
    .refine((value) => value >= 0, { message: "El valor no puede ser negativo" }),
  anbFineSettlement: z
    .string()
    .default("0")
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => Math.max(0, parseFloat(value)))
    .refine((value) => value >= 0, { message: "El valor no puede ser negativo" }),
  onAccount: z
    .string()
    .default("0")
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => Math.max(0, parseFloat(value)))
    .refine((value) => value >= 0, { message: "El valor no puede ser negativo" }),
  dsctoShirtDelays: z
    .string()
    .default("0")
    .refine((value) => !isNaN(Number(value)), { message: "Ingrese solo números" })
    .transform((value) => Math.max(0, parseFloat(value)))
    .refine((value) => value >= 0, { message: "El valor no puede ser negativo" }),
})