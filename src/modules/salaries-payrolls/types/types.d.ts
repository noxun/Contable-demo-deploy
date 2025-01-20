import { SchemaPayroll } from "../schemas/shema";

export type SchemaPayrollType = z.infer<typeof SchemaPayroll>

export interface Payroll {
  id: number;
  dateNow: Date;
  nombres: string;
  area: string;
  sexo: string;
  cargo: string;
  entryDate: Date;
  salaryTaxReturn: number;
  internalPayrollSalary: number;
}
