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
