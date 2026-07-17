import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/api';
import { CreateExpense, Expense, UpdateExpense } from '../../core/interfaces/expense';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  async getExpenses(params: { page?: number; limit?: number; initial_date?: string; final_date?: string } = {}): Promise<ApiResponse<Expense[]>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.initial_date) httpParams = httpParams.set('initial_date', params.initial_date);
    if (params.final_date) httpParams = httpParams.set('final_date', params.final_date);

    return firstValueFrom(
      this.http.get<ApiResponse<Expense[]>>(`${this.baseUrl}/expenses`, { params: httpParams })
    );
  }

  async createExpense(data: CreateExpense): Promise<ApiResponse<Expense>> {
    return firstValueFrom(
      this.http.post<ApiResponse<Expense>>(`${this.baseUrl}/expenses`, data)
    );
  }

  async updateExpense(id: string, data: UpdateExpense): Promise<ApiResponse<Expense>> {
    const params = new HttpParams().set('id', id);
    return firstValueFrom(
      this.http.put<ApiResponse<Expense>>(`${this.baseUrl}/expenses`, data, { params })
    );
  }

  async deleteExpense(id: string): Promise<ApiResponse<{ deletedExpenseId: string }>> {
    const params = new HttpParams().set('id', id);
    return firstValueFrom(
      this.http.delete<ApiResponse<{ deletedExpenseId: string }>>(`${this.baseUrl}/expenses`, { params })
    );
  }
}
