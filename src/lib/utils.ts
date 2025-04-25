import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVoucherType(type: string) {
  switch (type) {
    case "0":
      return "Traspaso"
    case "1":
      return "Egreso"
    case "2":
      return "Ingreso"
    default:
      return "Traspaso"
  }
}

export function getVoucherTypeRoute(type: string) {
  switch (type) {
    case "0":
      return "diary"
    case "1":
      return "expenses"
    case "2":
      return "income"
  }
}