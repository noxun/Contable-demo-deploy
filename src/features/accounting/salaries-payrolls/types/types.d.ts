import { SchemaPayroll, SchemaSalary } from "../schemas/shema";

export type SchemaPayrollType = z.infer<typeof SchemaPayroll>

export type SchemaSalaryType = z.infer<typeof SchemaSalary>

export interface ResponsePayrolls {
  salaryTaxReturnTotal: number;
  bonusAntiquityTotal: number;
  internalPayrollSalaryTotal: number;
  productionBonus: number;
  valueForOvertime: number;
  totalGanadoT: number;
  afpTotal: number;
  loanTotal: number;
  exelTrainingCorseTotal: number;
  anbFineSettlementTotal: number;
  onAccountTotal: number;
  dsctoShirtDelaysTotal: number;
  liquidPayableTotal: number;
  listSalariesWages: Payroll[]
}

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
  totalGanado: number,
  afp: number,
  loan: number,
  exelTrainingCorse: number,
  anbFineSettlement: number,
  onAccount: number,
  dsctoShirtDelays: number,
  liquidPayable: number,
  currenDate: Date,
}

export interface ItemPayment {
  idItems: number,
  bonusAntiquity: number,
  extraTimeMinutes: number,
  valueForOvertime: number,
  productionBonus: number,
  loan: number,
  exelTrainingCorse: number,
  anbFineSettlement: number,
  onAccount: number,
  dsctoShirtDelays: number,
}

export interface ResponseSalariesAndPayrolls {
  salaryTaxReturnTotal: number;
  bonusAntiquityTotal: number;
  internalPayrollSalaryTotal: number;
  productionBonus: number;
  valueForOvertime: number;
  totalGanadoT: number;
  afpTotal: number;
  loanTotal: number;
  exelTrainingCorseTotal: number;
  anbFineSettlementTotal: number;
  onAccountTotal: number;
  dsctoShirtDelaysTotal: number;
  liquidPayableTotal: number;
  itemsSalariesWages: SalaryAndPayrollItem[];
}

export interface SalaysAndPayrollItem {
  id: number;
  dateNow: Date;
  nombres: string;
  area: string;
  sexo: string;
  cargo: string;
  entryDate: Date;
  salaryTaxReturn: number;
  internalPayrollSalary: number;
  idItems: number;
  salariesAndwagesId: number;
  bonusAntiquity: number;
  productionBonus: number;
  extraTimeMinutes: number;
  valueForOvertime: number;
  totalGanado: number;
  afp: number;
  loan: number;
  exelTrainingCorse: number;
  anbFineSettlement: number;
  onAccount: number;
  dsctoShirtDelays: number;
  liquidPayable: number;
  currenDate: Date;
  isPaid: boolean;
}
