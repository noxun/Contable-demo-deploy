// SON DATOS DE PRUEBA PARA "HOJA DE TRABAJO"

const items = [];

for (let i = 1; i <= 8; i++) {
  items.push({
    id: i,
    codeAccount: `${i}.7.1.2.3`,
    nameAccount: `Nombre de Cuenta - PRUEBA N° ${i}`,
    balanceSheetBack: i * 1000,
    balanceSheetPresent: i * 1200,
    difference: `${i * 200}`,
    periodDepression: i * 100,
    amorOfIntangibleAsset: i * 50,
    aitb: i * 30,
    valueMaintenance: i * 20,
    provCompensation: i * 40,
    payCompensation: i * 35,
    payDividends: i * 60,
    purchaseFixedAssets: i * 80,
    saleFixedAssets: i * 70,
    paymentCompensation: i * 90,
    paymentDividends: i * 100,
    diference: i * 200, // numérico, como se espera
    clasification: i % 2 === 0 ? "Operativo" : "Inversión"
  });
}

export const mockData = {
  balanceSheetBackTotal: 8000,
  balanceSheetPresentTotal: 9600,
  differenceTotal: "1600",
  periodDepressionTotal: 800,
  amorOfIntangibleAssetTotal: 400,
  aitbTotal: 240,
  valueMaintenanceTotal: 160,
  provCompensationTotal: 320,
  payCompensationTotal: 280,
  payDividendsTotal: 480,
  purchaseFixedAssetsTotal: 640,
  saleFixedAssetsTotal: 560,
  paymentCompensationTotal: 720,
  paymentDividendsTotal: 800,
  diferenceTotal: 1600,
  clasificationTotal: null,
  netChangeInCash: 3000,
  initialBalanceOfCash: 5000,
  finalBalanceOfCash: 8000,
  finalBalanceOfCashOfBalanceSheet: 8000,
  difference: 0,
  items
};