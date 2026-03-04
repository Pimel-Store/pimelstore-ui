import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../lib/components/load/system-load/system-load.service';
import { Pagination } from '../../core/interfaces/api';
import { PaymentMethod, Sale } from '../../core/interfaces/sale';
import { SalesService } from './sales.service';

@Component({
  selector: 'app-sales',
  imports: [ReactiveFormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  private salesService = inject(SalesService);
  private alertService = inject(AlertService);
  private loadService = inject(LoadService);
  private fb = inject(FormBuilder);

  sales = signal<Sale[]>([]);
  pagination = signal<Pagination | null>(null);
  showModal = signal(false);
  deletingId = signal<string | null>(null);
  currentPage = signal(1);
  filterInitialDate = signal('');
  filterFinalDate = signal('');
  displayValue = signal('');

  readonly LIMIT = 10;

  readonly paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'pix', label: 'Pix' },
    { value: 'cash', label: 'Dinheiro' },
    { value: 'other', label: 'Outro' },
  ];

  form = this.fb.group({
    product: ['', [Validators.required, Validators.minLength(2)]],
    payment_method: ['' as PaymentMethod | '', Validators.required],
    value: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.loadSales();
  }

  async loadSales() {
    this.loadService.show();
    try {
      const res = await this.salesService.getSales({
        page: this.currentPage(),
        limit: this.LIMIT,
        initial_date: this.filterInitialDate() || undefined,
        final_date: this.filterFinalDate() || undefined
      });
      this.sales.set(res.data ?? []);
      if (res.pagination) this.pagination.set(res.pagination);
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao carregar vendas.', 'error');
    } finally {
      this.loadService.hide();
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loadService.show();
    try {
      const { product, payment_method, value } = this.form.value;
      await this.salesService.createSale({
        product: product!,
        payment_method: payment_method as PaymentMethod,
        value: Number(value)
      });
      this.alertService.show('Venda criada com sucesso!', 'success');
      this.form.reset();
      this.displayValue.set('');
      this.showModal.set(false);
      this.currentPage.set(1);
      await this.loadSales();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao criar venda.', 'error');
    } finally {
      this.loadService.hide();
    }
  }

  async deleteSale(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) return;
    this.deletingId.set(id);
    try {
      await this.salesService.deleteSale(id);
      this.alertService.show('Venda excluída com sucesso!', 'success');
      await this.loadSales();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao excluir venda.', 'error');
    } finally {
      this.deletingId.set(null);
    }
  }

  applyFilter(initial: string, final: string) {
    this.filterInitialDate.set(initial);
    this.filterFinalDate.set(final);
    this.currentPage.set(1);
    this.loadSales();
  }

  clearFilter() {
    this.filterInitialDate.set('');
    this.filterFinalDate.set('');
    this.currentPage.set(1);
    this.loadSales();
  }

  async goToPage(page: number) {
    this.currentPage.set(page);
    await this.loadSales();
  }

  onValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');

    if (!digits) {
      this.displayValue.set('');
      input.value = '';
      this.form.get('value')?.setValue(null);
      return;
    }

    const number = parseInt(digits, 10) / 100;
    const formatted = number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    this.displayValue.set(formatted);
    input.value = formatted;
    this.form.get('value')?.setValue(number);
  }

  openModal() {
    this.form.reset();
    this.displayValue.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.form.reset();
    this.displayValue.set('');
    this.showModal.set(false);
  }

  get visiblePages(): number[] {
    const total = this.pagination()?.totalPages ?? 1;
    const current = this.currentPage();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  paymentLabel(method: PaymentMethod): string {
    return this.paymentMethods.find(p => p.value === method)?.label ?? method;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
