import { AuthService } from './auth-service.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getUserData()).pipe(
      switchMap(user => {
        const token = user?.token ?? '';
        const authReq = req.clone({
          setHeaders: {
            Authorization: token ? `Bearer ${token}` : '',
          }
        });
        return next.handle(authReq);
      })
    );
  }
}
