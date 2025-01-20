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