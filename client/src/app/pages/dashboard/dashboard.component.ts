import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <app-navbar />

      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-10 animate-fade-in">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Overview</p>
          <h1 class="mt-4 text-4xl font-extrabold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Welcome back, {{ firstName }} 👋</h1>
          <p class="mt-3 text-sm text-slate-500">Here's what's happening with your inventory today.</p>
        </div>

        <div class="grid gap-6 xl:grid-cols-3 mb-8">
          <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:scale-[1.02] animate-fade-in">
            <div class="flex items-center justify-between mb-6">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 shadow-sm">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                </svg>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Total</span>
            </div>
            <p class="text-5xl font-extrabold text-slate-900 mb-2">{{ totalProducts }}</p>
            <p class="text-sm text-slate-500">Products</p>
          </div>

          <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] animate-fade-in" style="animation-delay: 0.1s;">
            <div class="flex items-center justify-between mb-6">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 shadow-sm">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span class="rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">Alert</span>
            </div>
            <p class="text-5xl font-extrabold text-red-600 mb-2">{{ lowStock }}</p>
            <p class="text-sm text-slate-500">Low Stock Items</p>
          </div>

          <div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-[1.02] animate-fade-in" style="animation-delay: 0.2s;">
            <div class="flex items-center justify-between mb-6">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 shadow-sm">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8m-4-4v4" />
                </svg>
              </div>
              <span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-600">Active</span>
            </div>
            <p class="text-5xl font-extrabold text-slate-900 mb-2">{{ categories }}</p>
            <p class="text-sm text-slate-500">Categories</p>
          </div>
        </div>

        <div class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg animate-fade-in" style="animation-delay: 0.3s;">
          <div class="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Recent Products</p>
              <p class="mt-2 text-sm text-slate-500">Latest additions to inventory</p>
            </div>
            <a routerLink="/products" class="inline-flex items-center rounded-full border border-teal-100 bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 transition-all duration-300 hover:from-teal-100 hover:to-teal-200 hover:shadow-md hover:scale-105">
              View all →
            </a>
          </div>

          <div *ngIf="loading" class="px-6 py-12 text-center text-slate-500">
            <div class="mx-auto mb-3 h-11 w-11 animate-spin rounded-full border-2 border-slate-200 border-t-teal-500"></div>
            <p class="text-sm">Loading products...</p>
          </div>

          <div *ngIf="!loading && recentProducts.length === 0" class="px-6 py-12 text-center text-slate-500">
            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 shadow-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-slate-900">No products yet</p>
            <p class="mt-2 text-sm text-slate-500">Add your first product to get started.</p>
          </div>

          <div *ngIf="!loading && recentProducts.length > 0" class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr class="bg-gradient-to-r from-slate-50 to-slate-100 text-left text-xs uppercase tracking-[0.3em] text-slate-500">
                  <th class="px-6 py-4 font-semibold">Product</th>
                  <th class="px-6 py-4 font-semibold">Category</th>
                  <th class="px-6 py-4 font-semibold text-right">Price</th>
                  <th class="px-6 py-4 font-semibold text-right">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of recentProducts; let i = index" class="border-b border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200 hover:shadow-sm animate-fade-in" [style.animation-delay.ms]="i * 50">
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-4">
                      <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-sm transition-transform duration-200 hover:scale-110">
                        <img *ngIf="p.imageUrl" [src]="'http://localhost:3000' + p.imageUrl" class="h-full w-full object-cover" />
                        <svg *ngIf="!p.imageUrl" class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-slate-900">{{ p.name }}</p>
                        <p class="text-xs text-slate-500 truncate" style="max-width:180px;">{{ p.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <span class="inline-flex rounded-full bg-gradient-to-r from-teal-100 to-teal-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 shadow-sm">{{ p.category }}</span>
                  </td>
                  <td class="px-6 py-5 text-right font-semibold text-slate-900">₱{{ p.price | number:'1.0-0' }}</td>
                  <td class="px-6 py-5 text-right">
                    <span [ngClass]="p.quantity <= 5 ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-600' : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'" class="inline-flex rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                      {{ p.quantity }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  lowStock = 0;
  categories = 0;
  recentProducts: Product[] = [];
  loading = true;
  get firstName(): string { return this.auth.getCurrentUser()?.name?.split(' ')?.[0] ?? 'there'; }

  constructor(public auth: AuthService, private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts({ page: 1, limit: 100 }).subscribe({
      next: (res) => {
        this.totalProducts = res.pagination.total;
        this.lowStock = res.data.filter(p => p.quantity <= 5).length;
        this.recentProducts = res.data.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.loading = false;
      },
    });
    this.productService.getCategories().subscribe({
      next: (cats) => { this.categories = cats.length; },
      error: (err) => { console.error('Failed to load categories:', err); },
    });
  }
}

