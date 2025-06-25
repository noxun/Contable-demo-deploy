export type CashFlowResponseData = {
  balanceSheet: {
    totalActiveCurrent: number
    totalActiveNoCurrent: number
    totalActive: number
    totalLiabilityCurrent: number
    totalLiabilityNoCurrent: number
    totalLiability: number
    totalEquity: number
    totalLiabilityEquity: number
    activeCurrentItems: Array<{
      account: string
      description: string
      amount: number
    }>
    activeNoCurrentItems: Array<{
      amountDetail: number
      account: string
      description: string
      amount: number
    }>
    liabilityCurrentItems: Array<{
      account: string
      description: string
      amount: number
    }>
    liabilityNoCurrentItems: Array<any>
    equityItems: Array<{
      account: string
      description: string
      amount: number
    }>
  }
  statementIncome: {
    totalExpense: number
    totalIncome: number
    periodUtility: number
    taxOnProfits: number
    managementResult: number
    expenses: Array<{
      account: string
      description: string
      amount: number
    }>
    income: Array<{
      account: string
      description: string
      amount: number
    }>
  }
  clashFlowDirect: {
    netResult: number
    depActivosFijos: number
    amorActivosIntangibles: number
    prevIncobrabilidad: number
    prevObsDeInventarios: number
    prevIndemnizaciones: number
    perdidaInvPermanentes: number
    ajusteInflacionTenBienes: number
    diferenciaDeBienes: number
    cuentasCobrarComer: number
    otrasCuentasCobrar: number
    inventario: number
    anticiposProveedores: number
    gastosPrepagados: number
    cuentasPagarComer: number
    obligFiscalesSociales: number
    interesesPagar: number
    ingresosDiferidos: number
    otrasCuentasPagar: number
    previsionParaIndemn: number
    feao: number
    feaoInvTemp: number
    feaoInvPPE: number
    feaoInvActiveInt: number
    feaoInvPermanentes: number
    feai: number
    feaiPagoDividendos: number
    feaiDeudaFinanciera: number
    feaiDeudaBursatil: number
    feaf: number
    feafEfectivTotal: number
    feafSaldoInicio: number
    feafMonOtrosMetodos: number
    saldoFinal: number
  }
  clashFlowIndirect: {
    cobrosClientes: number
    otrosCobros: number
    pagosCompras: number
    pagosGastosAdmin: number
    pagosGastosComer: number
    pagosGastosFinan: number
    pagosImpuestos: number
    otrosPagos: number
    feao: number
    resultAntesInteresImp: number
    partidasNoGeneranMov: number
    capex: number
    movNetosActivosPasivosOp: number
    felf: number
    felp: number
  }
}
