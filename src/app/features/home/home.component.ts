import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../lib/components/load/system-load/system-load.service';
import { DashboardData, DailyData, MonthData } from '../../core/interfaces/dashboard';
import { DashboardService } from './dashboard.service';

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

  dashboard = signal<DashboardData | null>(null);
  selectedYear = signal(new Date().getFullYear());

  readonly MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  get yearOptions(): number[] {
    const current = new Date().getFullYear();
    return [current - 2, current - 1, current];
  }

  get monthList(): MonthData[] {
    const data = this.dashboard()?.monthly ?? {};
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return data[month.toString()] ?? { totalItems: 0, totalValue: 0, month, year: this.selectedYear() };
    });
  }

  get maxMonthValue(): number {
    return Math.max(...this.monthList.map(m => m.totalValue), 1);
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

  barHeight(month: MonthData): number {
    if (this.maxMonthValue === 0) return 0;
    return Math.max((month.totalValue / this.maxMonthValue) * 100, month.totalValue > 0 ? 5 : 0);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDayDate(d: DailyData): string {
    return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;
  }
}
