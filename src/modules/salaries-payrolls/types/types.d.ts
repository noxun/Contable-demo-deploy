import { SchemaPayroll, SchemaSalary } from "../schemas/shema";

export type SchemaPayrollType = z.infer<typeof SchemaPayroll>

export type SchemaSalaryType = z.infer<typeof SchemaSalary>

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
  salariesAndWagesItems: Salaries[]
}

export interface Salaries {
  id: number,
  salariesAndwagesId: number,
  bonusAntiquity: number,
  productionBonus: number,
  extraTimeMinutes: number,
  valueForOvertime: number,
  loan: number,
  exelTrainingCorse: number,
  anbFineSettlement: number,
  onAccount: number,
  dsctoShirtDelays: number9
}  
