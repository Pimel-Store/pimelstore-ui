import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/api';
import { CreateSale, Sale, UpdateSale } from '../../core/interfaces/sale';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  async getSales(params: { page?: number; limit?: number; initial_date?: string; final_date?: string } = {}): Promise<ApiResponse<Sale[]>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.initial_date) httpParams = httpParams.set('initial_date', params.initial_date);
    if (params.final_date) httpParams = httpParams.set('final_date', params.final_date);

    return firstValueFrom(
      this.http.get<ApiResponse<Sale[]>>(`${this.baseUrl}/sales`, { params: httpParams })
    );
  }

  async createSale(data: CreateSale): Promise<ApiResponse<Sale>> {
    return firstValueFrom(
      this.http.post<ApiResponse<Sale>>(`${this.baseUrl}/sales`, data)
    );
  }

  async updateSale(id: string, data: UpdateSale): Promise<ApiResponse<Sale>> {
    const params = new HttpParams().set('id', id);
    return firstValueFrom(
      this.http.put<ApiResponse<Sale>>(`${this.baseUrl}/sales`, data, { params })
    );
  }

  async deleteSale(id: string): Promise<ApiResponse<{ deletedSaleId: string }>> {
    const params = new HttpParams().set('id', id);
    return firstValueFrom(
      this.http.delete<ApiResponse<{ deletedSaleId: string }>>(`${this.baseUrl}/sales`, { params })
    );
  }
}
