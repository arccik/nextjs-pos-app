import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function formatCurrency(
  amount?: string | number | null,
  currency: string = "GBP",
  locale: string = "en-GB",
): string {
  if (!amount) return "";
  const amountNumber = Number(amount);
  if (isNaN(amountNumber)) return "";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amountNumber);
}