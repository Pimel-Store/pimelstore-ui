import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../lib/components/load/system-load/system-load.service';
import { Pagination } from '../../core/interfaces/api';
import { PaymentMethod } from '../../core/interfaces/sale';
import { Expense } from '../../core/interfaces/expense';
import { Category } from '../../core/interfaces/category';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ExpensesService } from './expenses.service';

@Component({
  selector: 'app-expenses',
  imports: [ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  private expensesService = inject(ExpensesService);
  private categoriesService = inject(CategoriesService);
  private alertService = inject(AlertService);
  private loadService = inject(LoadService);
  private fb = inject(FormBuilder);

  expenses = signal<Expense[]>([]);
  categories = this.categoriesService.categories;
  pagination = signal<Pagination | null>(null);
  showModal = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingExpenseId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  confirmingDeleteId = signal<string | null>(null);
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
    description: ['', [Validators.required, Validators.minLength(2)]],
    category_id: ['', Validators.required],
    payment_method: ['' as PaymentMethod | '', Validators.required],
    value: [null as number | null, [Validators.required, Validators.min(0.01)]],
    expensed_at: [this.getNowDateTimeLocal(), Validators.required]
  });

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories();
  }

  async loadCategories() {
    try {
      await this.categoriesService.loadCategories();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao carregar categorias.', 'error');
    }
  }

  async loadExpenses() {
    this.loadService.show();
    try {
      const res = await this.expensesService.getExpenses({
        page: this.currentPage(),
        limit: this.LIMIT,
        initial_date: this.filterInitialDate() || undefined,
        final_date: this.filterFinalDate() || undefined
      });
      this.expenses.set(res.data ?? []);
      if (res.pagination) this.pagination.set(res.pagination);
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao carregar despesas.', 'error');
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
      const { description, category_id, payment_method, value, expensed_at } = this.form.value;
      if (this.modalMode() === 'edit' && this.editingExpenseId()) {
        await this.expensesService.updateExpense(this.editingExpenseId()!, {
          description: description!,
          category_id: category_id!,
          payment_method: payment_method as PaymentMethod,
          value: Number(value),
          expensed_at: new Date(expensed_at!).toISOString()
        });
        this.alertService.show('Despesa atualizada com sucesso!', 'success');
      } else {
        await this.expensesService.createExpense({
          description: description!,
          category_id: category_id!,
          payment_method: payment_method as PaymentMethod,
          value: Number(value),
          expensed_at: new Date(expensed_at!).toISOString()
        });
        this.alertService.show('Despesa criada com sucesso!', 'success');
        this.currentPage.set(1);
      }
      this.form.reset();
      this.displayValue.set('');
      this.showModal.set(false);
      await this.loadExpenses();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao salvar despesa.', 'error');
    } finally {
      this.loadService.hide();
    }
  }

  requestDelete(id: string) {
    this.confirmingDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmingDeleteId.set(null);
  }

  async deleteExpense(id: string) {
    this.confirmingDeleteId.set(null);
    this.deletingId.set(id);
    try {
      await this.expensesService.deleteExpense(id);
      this.alertService.show('Despesa excluída com sucesso!', 'success');
      await this.loadExpenses();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao excluir despesa.', 'error');
    } finally {
      this.deletingId.set(null);
    }
  }

  applyFilter(initial: string, final: string) {
    this.filterInitialDate.set(initial);
    this.filterFinalDate.set(final);
    this.currentPage.set(1);
    this.loadExpenses();
  }

  clearFilter() {
    this.filterInitialDate.set('');
    this.filterFinalDate.set('');
    this.currentPage.set(1);
    this.loadExpenses();
  }

  async goToPage(page: number) {
    this.currentPage.set(page);
    await this.loadExpenses();
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

  private toDateTimeLocal(isoString: string): string {
    const d = new Date(isoString);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private getNowDateTimeLocal(): string {
    return this.toDateTimeLocal(new Date().toISOString());
  }

  openModal() {
    this.modalMode.set('create');
    this.editingExpenseId.set(null);
    this.form.reset({ expensed_at: this.getNowDateTimeLocal() });
    this.displayValue.set('');
    this.showModal.set(true);
  }

  openEditModal(expense: Expense) {
    this.modalMode.set('edit');
    this.editingExpenseId.set(expense._id);
    const dateStr = expense.expensed_at || expense.created_at || new Date().toISOString();
    const formatted = expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    this.displayValue.set(formatted);
    this.form.reset({
      description: expense.description,
      category_id: expense.category_id,
      payment_method: expense.payment_method,
      value: expense.value,
      expensed_at: this.toDateTimeLocal(dateStr)
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.form.reset();
    this.displayValue.set('');
    this.editingExpenseId.set(null);
    this.showModal.set(false);
  }

  get visiblePages(): number[] {
    const total = this.pagination()?.totalPages ?? 1;
    const current = this.currentPage();
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  categoryOf(categoryId: string): Category | undefined {
    return this.categories().find(c => c._id === categoryId);
  }

  paymentLabel(method: PaymentMethod): string {
    return this.paymentMethods.find(p => p.value === method)?.label ?? method;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatDate(expense: Expense): string {
    const date = expense.expensed_at || expense.created_at;
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
