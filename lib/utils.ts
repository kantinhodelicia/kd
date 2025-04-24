import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Substituir a função formatPrice atual por esta versão atualizada para Cabo Verde
export const formatPrice = (price: number): string => {
  // Formata o preço como escudo cabo-verdiano (CVE)
  return `${price}$00`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
