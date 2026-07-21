import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../../../lib/components/load/system-load/system-load.service';
import { Category } from '../../../interfaces/category';
import { CategoriesService } from '../../../services/categories/categories.service';
import { contrastTextColor } from '../../../../lib/utils/color-contrast';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  private categoriesService = inject(CategoriesService);
  private alertService = inject(AlertService);
  private loadService = inject(LoadService);
  private fb = inject(FormBuilder);

  categories = this.categoriesService.categories;
  editingCategoryId = signal<string | null>(null);
  confirmingDeleteId = signal<string | null>(null);
  deletingId = signal<string | null>(null);

  readonly DEFAULT_COLOR = '#6366F1';

  contrastTextColor = contrastTextColor;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    color: [this.DEFAULT_COLOR, Validators.required]
  });

  ngOnChanges() {
    if (this.open) {
      this.loadCategories();
    }
  }

  async loadCategories() {
    this.loadService.show();
    try {
      await this.categoriesService.loadCategories();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao carregar categorias.', 'error');
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
      const { title, color } = this.form.value;
      if (this.editingCategoryId()) {
        await this.categoriesService.updateCategory(this.editingCategoryId()!, { title: title!, color: color! });
        this.alertService.show('Categoria atualizada com sucesso!', 'success');
      } else {
        await this.categoriesService.createCategory({ title: title!, color: color! });
        this.alertService.show('Categoria criada com sucesso!', 'success');
      }
      this.resetForm();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao salvar categoria.', 'error');
    } finally {
      this.loadService.hide();
    }
  }

  editCategory(category: Category) {
    this.editingCategoryId.set(category._id);
    this.form.reset({ title: category.title, color: category.color });
  }

  cancelEdit() {
    this.resetForm();
  }

  requestDelete(id: string) {
    this.confirmingDeleteId.set(id);
  }

  cancelDelete() {
    this.confirmingDeleteId.set(null);
  }

  async deleteCategory(id: string) {
    this.confirmingDeleteId.set(null);
    this.deletingId.set(id);
    try {
      await this.categoriesService.deleteCategory(id);
      this.alertService.show('Categoria excluída com sucesso!', 'success');
      if (this.editingCategoryId() === id) this.resetForm();
    } catch (error: any) {
      this.alertService.show(error?.error?.message || 'Erro ao excluir categoria.', 'error');
    } finally {
      this.deletingId.set(null);
    }
  }

  private resetForm() {
    this.editingCategoryId.set(null);
    this.form.reset({ title: '', color: this.DEFAULT_COLOR });
  }

  close() {
    this.resetForm();
    this.closed.emit();
  }
}
