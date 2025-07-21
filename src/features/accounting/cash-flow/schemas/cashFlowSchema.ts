import { z } from "zod"

export const directCashFlowSchema = z.object({
  netResult: z.number(),
  depActivosFijos: z.number(),
  amorActivosIntangibles: z.number(),
  prevIncobrabilidad: z.number(),
  prevObsDeInventarios: z.number(),
  prevIndemnizaciones: z.number(),
  perdidaInvPermanentes: z.number(),
  ajusteInflacionTenBienes: z.number(),
  diferenciaDeBienes: z.number(),
  cuentasCobrarComer: z.number(),
  otrasCuentasCobrar: z.number(),
  inventario: z.number(),
  anticiposProveedores: z.number(),
  gastosPrepagados: z.number(),
  cuentasPagarComer: z.number(),
  obligFiscalesSociales: z.number(),
  interesesPagar: z.number(),
  ingresosDiferidos: z.number(),
  otrasCuentasPagar: z.number(),
  previsionParaIndemn: z.number(),
  feao: z.number(),
  feaoInvTemp: z.number(),
  feaoInvPPE: z.number(),
  feaoInvActiveInt: z.number(),
  feaoInvPermanentes: z.number(),
  feai: z.number(),
  feaiPagoDividendos: z.number(),
  feaiDeudaFinanciera: z.number(),
  feaiDeudaBursatil: z.number(),
  feaf: z.number(),
  feafEfectivTotal: z.number(),
  feafSaldoInicio: z.number(),
  feafMonOtrosMetodos: z.number(),
  saldoFinal: z.number()
})

export const indirectCashFlowSchema = z.object({
  cobrosClientes: z.number(),
  otrosCobros: z.number(),
  pagosCompras: z.number(),
  pagosGastosAdmin: z.number(),
  pagosGastosComer: z.number(),
  pagosGastosFinan: z.number(),
  pagosImpuestos: z.number(),
  otrosPagos: z.number(),
  feao: z.number(),
  resultAntesInteresImp: z.number(),
  partidasNoGeneranMov: z.number(),
  capex: z.number(),
  movNetosActivosPasivosOp: z.number(),
  felf: z.number(),
  felp: z.number()
})


export type DirectCashFlow = z.infer<typeof directCashFlowSchema>
export type IndirectCashFlow = z.infer<typeof indirectCashFlowSchema>