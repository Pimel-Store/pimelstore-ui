export interface MonthData {
  totalItems: number;
  totalValue: number;
  month: number;
  year: number;
}

export interface DailyData {
  year: number;
  month: number;
  day: number;
  totalItems: number;
  totalValue: number;
}

export interface AnnualData {
  year?: number;
  totalItems: number;
  totalValue: number;
}

export interface DashboardData {
  monthly: Record<string, MonthData | null>;
  daily: DailyData[];
  annual: AnnualData;
}
