import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'products/new',
    loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];
