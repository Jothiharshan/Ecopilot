import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getHealthColorClass(level: string): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
} {
  switch (level) {
    case "Excellent":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        badgeBg: "bg-emerald-500/20",
        badgeText: "text-emerald-300",
      };
    case "Good":
      return {
        bg: "bg-teal-500/10 dark:bg-teal-500/15",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-500/30",
        badgeBg: "bg-teal-500/20",
        badgeText: "text-teal-300",
      };
    case "Average":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        badgeBg: "bg-amber-500/20",
        badgeText: "text-amber-300",
      };
    case "Needs Improvement":
      return {
        bg: "bg-orange-500/10 dark:bg-orange-500/15",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500/30",
        badgeBg: "bg-orange-500/20",
        badgeText: "text-orange-300",
      };
    case "Critical":
    default:
      return {
        bg: "bg-rose-500/10 dark:bg-rose-500/15",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/30",
        badgeBg: "bg-rose-500/20",
        badgeText: "text-rose-300",
      };
  }
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case "Critical":
      return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    case "High":
      return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30";
    case "Medium":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "Low":
    default:
      return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  }
}
