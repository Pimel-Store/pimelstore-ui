import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../interfaces/api';
import { User } from '../../interfaces/user';
import { environment } from './../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http = inject(HttpClient);
    private storageKey = 'user-data-info';
    private env = environment;

    constructor() {

    }

    async login({email,password}: User): Promise<ApiResponse<User>> {
        const login$ = this.http.post<ApiResponse<User>>(`${this.env.apiUrl}/login`, {email, password});
        const response = await firstValueFrom(login$);
        if(response && response.data){
            await this.setUserData(response.data);
        }
        return response ?? {data: {} as User, message: 'No response from server', status: 500};
    }

     async validateToken(): Promise<ApiResponse<User>> {
        const token$ = this.http.get<ApiResponse<User>>(`${this.env.apiUrl}/token`);
        const response = await firstValueFrom(token$);
        return response ?? {data: {} as User, message: 'No response from server', status: 500};
    }

    async setUserData(userData: User): Promise<void> {
        localStorage.setItem(this.storageKey, JSON.stringify(userData) || '');
    }

    async getUserData(): Promise<User | null> {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            return JSON.parse(data) as User;
        }
        return null;
    }

    async isLoggedIn(): Promise<boolean> {
      try{
          const data = localStorage.getItem(this.storageKey);
          if (!data) {
              return false;
          }
          const user = JSON.parse(data) as User;
          const tokenValidation = await this.validateToken();
          if (!tokenValidation.data || !tokenValidation.data.token) {
              return false;
          }
          return !!user.token;
        } catch (error: any) {
          alert('Error checking login status: ' + error.error.message);
          return false;
        }
    }
}

