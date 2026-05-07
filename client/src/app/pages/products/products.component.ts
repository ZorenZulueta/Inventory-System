import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Product } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <app-navbar />

      <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 animate-fade-in">
          <div class="mb-6 sm:mb-0">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Inventory</p>
            <h1 class="mt-2 text-4xl font-extrabold text-slate-900">Products</h1>
          </div>
          <a *ngIf="auth.isAdmin()" routerLink="/products/new"
             class="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-[24px] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 no-underline transform hover:scale-[1.02]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </a>
        </div>

        <!-- Search & Filter Bar -->
        <div class="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in" style="animation-delay: 0.1s;">
          <div class="relative flex-1">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search products..."
              class="w-full bg-white border border-slate-200 rounded-[24px] pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 hover:border-slate-300" />
          </div>
          <select [(ngModel)]="category" (ngModelChange)="onSearch()"
            class="bg-white border border-slate-200 rounded-[24px] px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 hover:border-slate-300 min-w-[200px]">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="py-20 text-center">
          <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-teal-500"></div>
          <p class="text-sm text-slate-500">Loading products...</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && products.length === 0" class="rounded-[32px] border border-slate-200 bg-white shadow-sm py-20 px-6 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
            </svg>
          </div>
          <p class="text-lg font-semibold text-slate-900 mb-2">No products found</p>
          <p class="text-sm text-slate-500">Try a different search or add a new product</p>
        </div>

        <!-- Table -->
        <div *ngIf="!loading && products.length > 0" class="rounded-[32px] border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in" style="animation-delay: 0.2s;">

          <div class="overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-0">
              <thead>
                <tr class="bg-gradient-to-r from-slate-50 to-slate-100 text-left text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">
                  <th class="px-6 py-4">Product</th>
                  <th class="px-6 py-4">Category</th>
                  <th class="px-6 py-4 text-right">Price</th>
                  <th class="px-6 py-4 text-center">Stock</th>
                  <th *ngIf="auth.isAdmin()" class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of products; let i = index" class="border-b border-slate-200 hover:bg-slate-50 transition-all duration-200 animate-fade-in" [style.animation-delay.ms]="i * 50">

                  <td class="px-6 py-5">
                    <div class="flex items-center gap-4">
                      <div class="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <img *ngIf="p.imageUrl" [src]="apiUrl + p.imageUrl" class="h-full w-full object-cover" />
                        <svg *ngIf="!p.imageUrl" class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-900">{{ p.name }}</p>
                        <p class="text-xs text-slate-500 truncate" style="max-width: 200px;">{{ p.description }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-5">
                    <span class="inline-flex rounded-full bg-teal-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">{{ p.category }}</span>
                  </td>

                  <td class="px-6 py-5 text-right font-semibold text-slate-900">₱{{ p.price | number:'1.0-0' }}</td>

                  <td class="px-6 py-5 text-center">
                    <span [ngClass]="p.quantity <= 5 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'" 
                          class="inline-flex rounded-full px-3 py-1 text-sm font-semibold border">
                      {{ p.quantity }}
                      <span *ngIf="p.quantity <= 5" class="ml-1 text-xs opacity-75">low</span>
                    </span>
                  </td>

                  <td *ngIf="auth.isAdmin()" class="px-6 py-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/products/edit', p.id]"
                         class="inline-flex rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 transition-all duration-200 hover:bg-teal-100 hover:border-teal-300 no-underline">
                        Edit
                      </a>
                      <button (click)="delete(p.id!)"
                         class="inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-all duration-200 hover:bg-red-100 hover:border-red-300 cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 border-t border-slate-200 bg-slate-50">
            <p class="text-sm text-slate-600">
              Showing <span class="font-semibold">{{ products.length }}</span> of <span class="font-semibold">{{ pagination.total }}</span> products
            </p>
            <div class="flex items-center gap-2">
              <button (click)="changePage(pagination.page - 1)" [disabled]="pagination.page <= 1"
                class="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                ← Prev
              </button>
              <span class="px-3 py-2 text-sm font-semibold text-slate-600">
                {{ pagination.page }} / {{ pagination.totalPages }}
              </span>
              <button (click)="changePage(pagination.page + 1)" [disabled]="pagination.page >= pagination.totalPages"
                class="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  search = '';
  category = '';
  apiUrl = environment.apiUrl.replace(/\/api$/, '');
  pagination = { total: 0, page: 1, limit: 10, totalPages: 1 };
  private searchTimeout: any;

  constructor(public auth: AuthService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.productService.getCategories().subscribe(c => this.categories = c);
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ search: this.search, category: this.category, page: this.pagination.page, limit: this.pagination.limit }).subscribe({
      next: (res) => { this.products = res.data; this.pagination = res.pagination; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.pagination.page = 1;
    this.searchTimeout = setTimeout(() => this.loadProducts(), 400);
  }

  changePage(page: number): void { this.pagination.page = page; this.loadProducts(); }

  delete(id: string): void {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({ next: () => this.loadProducts(), error: () => alert('Failed to delete') });
  }
}
