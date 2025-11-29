import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth-guard/auth.guard';
import { LayoutComponent } from './core/layout/layout.component';
import { LayoutNoAuthComponent } from './core/layout-no-auth/layout-no-auth.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'home', loadChildren: () => import('./features/home/home.routes')},
        { path: 'sales', loadChildren: () => import('./features/sales/sales.routes')},
    ]
  },
  { path: 'login', component: LayoutNoAuthComponent, loadChildren: () => import('./features/login/login.routes')}

];
