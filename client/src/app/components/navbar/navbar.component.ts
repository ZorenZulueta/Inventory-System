import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <!-- Logo -->
        <div class="flex items-center gap-8">
          <a routerLink="/dashboard" class="flex items-center gap-2.5 no-underline">
            <div class="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
            </div>
            <span class="text-slate-900 font-bold text-lg tracking-tight">StockFlow</span>
          </a>

          <!-- Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/dashboard" routerLinkActive="bg-teal-50 text-teal-700"
               class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors no-underline">
              Dashboard
            </a>
            <a routerLink="/products" routerLinkActive="bg-teal-50 text-teal-700"
               class="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors no-underline">
              Products
            </a>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <a *ngIf="auth.isAdmin()" routerLink="/products/new"
             class="hidden sm:flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors no-underline">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Product
          </a>

          <!-- User badge -->
          <div class="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <span class="text-xs font-bold text-teal-700">{{ initials }}</span>
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-semibold text-slate-800 leading-none">{{ userName }}</p>
              <p class="text-xs text-slate-500 mt-0.5 capitalize">{{ auth.getCurrentUser()?.role }}</p>
            </div>
            <button (click)="logout()"
              class="ml-1 p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 font-semibold hover:shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  get userName() { return this.auth.getCurrentUser()?.name ?? ''; }
  get initials() {
    return this.userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
