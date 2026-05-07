import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Product } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-teal-600">Inventory</p>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">Products</h1>
          </div>
          <a *ngIf="auth.isAdmin()" routerLink="/products/new"
             class="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            + Add Product
          </a>
        </div>

        <!-- Search & Filter -->
        <div class="flex flex-col sm:flex-row gap-3 mb-6">
          <div class="relative flex-1">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">??</span>
            <input type="text" [(ngModel)]="search" (ngModelChange)="onSearch()"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
          </div>
          <select [(ngModel)]="category" (ngModelChange)="onSearch()"
            class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[160px]">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="py-20 text-center">
          <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm text-gray-500">Loading products...</p>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && products.length === 0" class="bg-white rounded-2xl border py-20 text-center">
          <p class="text-4xl mb-3">??</p>
          <p class="font-semibold text-gray-700 mb-1">No products found</p>
          <p class="text-sm text-gray-400">Try a different search or category</p>
        </div>

        <!-- Product Grid -->
        <div *ngIf="!loading && products.length > 0"
             class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div *ngFor="let p of products"
               class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition group flex flex-col">

            <!-- Image -->
            <div class="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              <img *ngIf="p.imageUrl" [src]="apiUrl + p.imageUrl"
                   class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <span *ngIf="!p.imageUrl" class="text-4xl">??</span>
              <!-- Stock badge -->
              <span *ngIf="p.quantity <= 5 && p.quantity > 0"
                    class="absolute top-2 left-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-200">
                Low Stock
              </span>
              <span *ngIf="p.quantity === 0"
                    class="absolute top-2 left-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                Out of Stock
              </span>
              <!-- Admin actions overlay -->
              <div *ngIf="auth.isAdmin()"
                   class="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                <a [routerLink]="['/products/edit', p.id]"
                   class="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 shadow-sm">
                  Edit
                </a>
                <button (click)="delete(p.id!)"
                   class="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 shadow-sm">
                  Delete
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="p-3 flex flex-col flex-1">
              <span class="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-1">{{ p.category }}</span>
              <p class="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{{ p.name }}</p>
              <p class="text-xs text-gray-400 mb-2">Stock: {{ p.quantity }}</p>
              <div class="mt-auto flex items-center justify-between gap-2">
                <span class="text-base font-extrabold text-gray-900">?{{ p.price | number:'1.0-0' }}</span>
                <button *ngIf="!auth.isAdmin()"
                        (click)="addToCart(p)"
                        [disabled]="p.quantity === 0"
                        [class]="cartService.isInCart(p.id!)
                          ? 'flex-shrink-0 bg-teal-100 text-teal-700 border border-teal-300 text-xs font-bold px-3 py-1.5 rounded-lg'
                          : 'flex-shrink-0 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-40'">
                  {{ cartService.isInCart(p.id!) ? '? Added' : '+ Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && pagination.totalPages > 1"
             class="flex items-center justify-between mt-6 bg-white border rounded-xl px-4 py-3">
          <p class="text-sm text-gray-500">
            Showing {{ products.length }} of {{ pagination.total }}
          </p>
          <div class="flex items-center gap-2">
            <button (click)="changePage(pagination.page - 1)" [disabled]="pagination.page <= 1"
              class="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              ? Prev
            </button>
            <span class="text-sm font-semibold text-gray-700">{{ pagination.page }} / {{ pagination.totalPages }}</span>
            <button (click)="changePage(pagination.page + 1)" [disabled]="pagination.page >= pagination.totalPages"
              class="px-3 py-1.5 text-sm font-semibold border rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
              Next ?
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  search = '';
  category = '';
  loading = true;
  apiUrl = environment.apiUrl.replace('/api', '');
  pagination = { page: 1, total: 0, totalPages: 1, limit: 12 };

  constructor(
    public auth: AuthService,
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({ next: c => this.categories = c, error: () => {} });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({
      page: this.pagination.page,
      limit: this.pagination.limit,
      search: this.search,
      category: this.category
    }).subscribe({
      next: (res: any) => {
        this.products = (res as any).data || (res as any).products || res;
        if ((res as any).pagination) this.pagination = { ...this.pagination, ...(res as any).pagination };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    this.pagination.page = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    this.pagination.page = page;
    this.loadProducts();
  }

  addToCart(p: Product): void {
    if (p.quantity === 0) return;
    this.cartService.addToCart(p);
  }

  delete(id: string): void {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({ next: () => this.loadProducts() });
  }
}


