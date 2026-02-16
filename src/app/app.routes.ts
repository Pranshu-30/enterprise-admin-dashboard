import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import type { UserRole } from './core/models';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users/new',
        data: { roles: ['Admin', 'Manager'] as UserRole[] },
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./users/user-form/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'users/edit/:id',
        data: { roles: ['Admin', 'Manager'] as UserRole[] },
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./users/user-form/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'users',
        data: { roles: ['Admin', 'Manager'] as UserRole[] },
        canActivate: [roleGuard],
        loadComponent: () =>
          import('./users/user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/product-list/product-list.component').then((m) => m.ProductListComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
