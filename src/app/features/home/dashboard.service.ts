import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/interfaces/api';
import { DashboardData } from '../../core/interfaces/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  async getDashboard(year?: number): Promise<ApiResponse<DashboardData>> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    return firstValueFrom(
      this.http.get<ApiResponse<DashboardData>>(`${this.baseUrl}/dashboard`, { params })
    );
  }
}
