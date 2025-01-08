export function validateArray(list: any): boolean {
  return list instanceof Array && list.length > 0;
}
export function roundDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
export function numberWithDecimals(num: number): string {
  return num || num === 0
    ? roundDecimals(num).toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : "";
}

export function formatNumber(value: number) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const formattedValue = absValue.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (absValue >= 10000) {
    return isNegative ? `-${formattedValue}` : formattedValue;
  }

  const parts = formattedValue.split(',');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return isNegative
    ? `-${formattedInteger},${decimalPart}`
    : `${formattedInteger},${decimalPart}`;
}

//en desarrollo
export function numberToLiteral(numero: number, moneda: string = "bolivianos"): string {
  const unidades: string[] = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const especiales: string[] = ["", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const decenas: string[] = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const centenas: string[] = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

  const veintidosACinco: string[] = [
    "veintiuno", "veintidós", "veintitrés", "veinticuatro",
    "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"
  ];

  function numeroACientos(n: number): string {
    if (n < 10) return unidades[n];
    if (n < 20) return especiales[n - 10];
    if (n < 30) return veintidosACinco[n - 20];
    if (n < 100) {
      const d: number = Math.floor(n / 10);
      const u: number = n % 10;
      return decenas[d] + (u > 0 ? " y " + unidades[u] : "");
    }
    const c: number = Math.floor(n / 100);
    const resto: number = n % 100;
    return centenas[c] + (resto > 0 ? " " + numeroACientos(resto) : "");
  }

  function numeroAMiles(n: number): string {
    if (n < 1000) return numeroACientos(n);
    const m: number = Math.floor(n / 1000);
    const resto: number = n % 1000;
    const miles: string = m === 1 ? "mil" : numeroACientos(m) + " mil";
    return miles + (resto > 0 ? " " + numeroACientos(resto) : "");
  }

  function numeroAMillones(n: number): string {
    if (n < 1000000) return numeroAMiles(n);
    const mill: number = Math.floor(n / 1000000);
    const resto: number = n % 1000000;
    const millones: string = mill === 1 ? "un millón" : numeroACientos(mill) + " millones";
    return millones + (resto > 0 ? " " + numeroAMiles(resto) : "");
  }

  if (numero < 0) {
    return "menos " + numberToLiteral(Math.abs(numero), moneda);
  }

  const parteEntera: number = Math.floor(numero);
  const parteDecimal: number = Math.round((numero - parteEntera) * 100);
  const literalEntero: string = numeroAMillones(parteEntera);
  const literalDecimal: string = `${parteDecimal.toString().padStart(2, "0")}/100`;

  return `${literalEntero} con ${literalDecimal} ${moneda}`;
}

// Rutas para descargar los excel
export const ReportPaths = {
  BookBigger: 'BookBigguerDataExel',
  reportExcel: 'Xlxs'
} as const;

//valores de los reportPaths
export type ReportType = typeof ReportPaths[keyof typeof ReportPaths];



