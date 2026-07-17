import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../interfaces/api';
import { Category, CreateCategory, UpdateCategory } from '../../interfaces/category';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  categories = signal<Category[]>([]);

  async loadCategories(): Promise<void> {
    const res = await this.getCategories();
    this.categories.set(res.data ?? []);
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return firstValueFrom(
      this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/categories`)
    );
  }

  async createCategory(data: CreateCategory): Promise<ApiResponse<Category>> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<Category>>(`${this.baseUrl}/categories`, data)
    );
    await this.loadCategories();
    return res;
  }

  async updateCategory(id: string, data: UpdateCategory): Promise<ApiResponse<Category>> {
    const params = new HttpParams().set('id', id);
    const res = await firstValueFrom(
      this.http.put<ApiResponse<Category>>(`${this.baseUrl}/categories`, data, { params })
    );
    await this.loadCategories();
    return res;
  }

  async deleteCategory(id: string): Promise<ApiResponse<{ deletedCategoryId: string }>> {
    const params = new HttpParams().set('id', id);
    const res = await firstValueFrom(
      this.http.delete<ApiResponse<{ deletedCategoryId: string }>>(`${this.baseUrl}/categories`, { params })
    );
    await this.loadCategories();
    return res;
  }
}
