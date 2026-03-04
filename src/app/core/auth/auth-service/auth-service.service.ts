import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../interfaces/api';
import { User } from '../../interfaces/user';
import { environment } from './../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private env = environment;

    private key = `${window.location.origin}:user-data`;
    private tokenValidatedAt: number | null = null;
    private readonly TOKEN_CACHE_TTL_MS = 5 * 60 * 1000;

    async login({ email, password }: User): Promise<ApiResponse<User>> {
        const login$ = this.http.post<ApiResponse<User>>(`${this.env.apiUrl}/login`, { email, password });
        const response = await firstValueFrom(login$);
        if (response?.data) {
            this.setUserData(response.data);
        }
        return response ?? { data: {} as User, message: 'No response from server', status: 500 };
    }

    async validateToken(): Promise<ApiResponse<User>> {
        const token$ = this.http.get<ApiResponse<User>>(`${this.env.apiUrl}/token`);
        const response = await firstValueFrom(token$);
        return response ?? { data: {} as User, message: 'No response from server', status: 500 };
    }

    setUserData(userData: User): void {
        localStorage.setItem(this.key, JSON.stringify(userData));
    }

    getUserData(): User | null {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) as User : null;
    }

    async isLoggedIn(): Promise<boolean> {
        try {
            const data = localStorage.getItem(this.key);
            if (!data) return false;

            const now = Date.now();
            if (this.tokenValidatedAt && now - this.tokenValidatedAt < this.TOKEN_CACHE_TTL_MS) {
                return true;
            }

            const user = JSON.parse(data) as User;
            const tokenValidation = await this.validateToken();
            if (!tokenValidation.data?.token) return false;

            this.tokenValidatedAt = now;
            return !!user.token;
        } catch {
            return false;
        }
    }

    logout(): void {
        localStorage.removeItem(this.key);
        this.tokenValidatedAt = null;
    }
}
