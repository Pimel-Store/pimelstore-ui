import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        // { path: 'home', loadChildren: () => import('./features/home/home.routes')},
    ]
  },
  // { path: 'forgot-password', loadChildren: () => import('./features/auth/forgot-password/forgot-password.routes')},
  // { path: 'reset-password', loadChildren: () => import('./features/auth/reset-password/reset-password.routes')},
  // { path: 'change-password', loadChildren: () => import('./features/auth/change-password/change-password.routes')},
  // { path: 'login', loadChildren: () => import('./features/auth/login/login.routes')},
  // { path: 'access-denied', component: AccessDeniedComponent },
  // { path: 'file-upload', component: FileUploadComponent },
  // { path: '**', component: NotFoundComponent },
];
