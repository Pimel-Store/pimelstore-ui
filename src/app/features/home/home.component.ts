import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../lib/components/load/system-load/system-load.service';
import { DashboardData, DailyData, MonthData } from '../../core/interfaces/dashboard';
import { DashboardService } from './dashboard.service';
import { RevenueVisibilityService } from '../../core/services/revenue-visibility/revenue-visibility.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private dashboardService = inject(DashboardService);
  private alertService = inject(AlertService);
  private loadService = inject(LoadService);
  private revenueVisibility = inject(RevenueVisibilityService);

  private readonly viewModeKey = 'dashboard-view-mode';

  dashboard = signal<DashboardData | null>(null);
  selectedYear = signal(new Date().getFullYear());
  viewMode = signal<'gross' | 'net'>(this.getStoredViewMode());
  revenueHidden = this.revenueVisibility.hidden;

  readonly MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  get yearOptions(): number[] {
    const current = new Date().getFullYear();
    return [current - 2, current - 1, current];
  }

  get monthList(): MonthData[] {
    const data = this.dashboard()?.monthly ?? {};
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return data[month.toString()] ?? { totalItems: 0, totalValue: 0, totalExpenses: 0, netValue: 0, month, year: this.selectedYear() };
    });
  }

  get maxMonthValue(): number {
    return Math.max(...this.monthList.map(m => this.valueFor(m)), 1);
  }

  get recentDays(): DailyData[] {
    return [...(this.dashboard()?.daily ?? [])].reverse().slice(0, 10);
  }

  ngOnInit() {
    this.loadDashboard();
  }

  async loadDashboard() {
    this.loadService.show();
    try {
      const res = await this.dashboardService.getDashboard(this.selectedYear());
      this.dashboard.set(res.data);
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao carregar o dashboard.', 'error');
    } finally {
      this.loadService.hide();
    }
  }

  onYearSelect(event: Event) {
    const year = +(event.target as HTMLSelectElement).value;
    this.selectedYear.set(year);
    this.loadDashboard();
  }

  setViewMode(mode: 'gross' | 'net') {
    this.viewMode.set(mode);
    localStorage.setItem(this.viewModeKey, mode);
  }

  private getStoredViewMode(): 'gross' | 'net' {
    return localStorage.getItem(this.viewModeKey) === 'net' ? 'net' : 'gross';
  }

  valueFor(entry: { totalValue: number; netValue?: number }): number {
    return (this.viewMode() === 'net' ? entry.netValue : entry.totalValue) ?? 0;
  }

  barHeight(month: MonthData): number {
    if (this.maxMonthValue === 0) return 0;
    const value = this.valueFor(month);
    return Math.max((value / this.maxMonthValue) * 100, value > 0 ? 5 : 0);
  }

  formatCurrency(value: number | undefined): string {
    return (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDayDate(d: DailyData): string {
    return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;
  }
}
