export interface MonthData {
  totalItems: number;
  totalValue: number;
  totalExpenses: number;
  netValue: number;
  month: number;
  year: number;
}

export interface DailyData {
  year: number;
  month: number;
  day: number;
  totalItems: number;
  totalValue: number;
  totalExpenses: number;
  netValue: number;
}

export interface AnnualData {
  year?: number;
  totalItems: number;
  totalValue: number;
  totalExpenseItems: number;
  totalExpenses: number;
  netValue: number;
}

export interface DashboardData {
  monthly: Record<string, MonthData | null>;
  daily: DailyData[];
  annual: AnnualData;
}
