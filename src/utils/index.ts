import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function calculatePnL(
  shares: number,
  avgPrice: number,
  currentPrice: number
): { pnl: number; percentage: number } {
  const invested = shares * avgPrice;
  const currentValue = shares * currentPrice;
  const pnl = currentValue - invested;
  const percentage = invested > 0 ? (pnl / invested) * 100 : 0;
  
  return { pnl, percentage };
}