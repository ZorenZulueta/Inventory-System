import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div class="relative w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)] transform transition-all duration-500 hover:shadow-[0_40px_80px_-40px_rgba(15,23,42,0.6)]">
        <div class="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-teal-200 to-teal-300 opacity-80 blur-3xl animate-pulse"></div>
        <div class="absolute -right-28 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200 to-blue-300 opacity-80 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 opacity-30 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>

        <div class="grid min-h-[680px] grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-teal-600 p-12 text-white relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-transparent"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-10">
                <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 shadow-lg shadow-slate-950/10 backdrop-blur-sm border border-white/20">
                  <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.35em] text-slate-300">StockFlow</p>
                  <h1 class="text-3xl font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Inventory made easy</h1>
                </div>
              </div>
              <div class="grid gap-5">
                <div class="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <p class="text-xs uppercase tracking-[0.3em] text-slate-300">Insights</p>
                  <p class="mt-3 text-lg font-semibold">Stay on top of stock in real time.</p>
                </div>
                <div class="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105" style="animation-delay: 0.1s;">
                  <p class="text-xs uppercase tracking-[0.3em] text-slate-300">Security</p>
                  <p class="mt-3 text-lg font-semibold">Secure login with role-based access.</p>
                </div>
              </div>
            </div>
            <div class="relative z-10 space-y-4">
              <p class="text-sm text-slate-300">Unlock faster workflows with clean inventory tracking.</p>
              <div class="flex items-center gap-3 text-slate-200">
                <span class="inline-flex h-3 w-3 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Optimized for modern teams</span>
              </div>
            </div>
          </div>

          <div class="relative flex items-center justify-center bg-white p-10 sm:p-14">
            <div class="w-full max-w-md transform transition-all duration-500">
              <div class="mb-10 text-center">
                <p class="text-sm uppercase tracking-[0.3em] text-teal-600 font-semibold">Welcome back</p>
                <h2 class="mt-4 text-3xl font-semibold text-slate-900">Sign in to your workspace</h2>
                <p class="mt-2 text-sm text-slate-500">Enter your details and start managing stock faster.</p>
              </div>

              <div *ngIf="error" class="mb-6 rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 animate-fade-in">
                {{ error }}
              </div>

              <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
                <label class="block group">
                  <span class="mb-2 block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-teal-600">Email address</span>
                  <input formControlName="email" type="email" placeholder="you@example.com"
                    class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                  <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="mt-2 text-xs text-red-500 animate-fade-in">Please enter a valid email.</p>
                </label>

                <label class="block group">
                  <span class="mb-2 block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-teal-600">Password</span>
                  <div class="relative">
                    <input formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="••••••••"
                      class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                    <button type="button" (click)="togglePasswordVisibility()" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                      <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    </button>
                  </div>
                  <p *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="mt-2 text-xs text-red-500 animate-fade-in">Password is required.</p>
                </label>

                <button type="submit" [disabled]="loading"
                  class="flex w-full items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-teal-700 hover:to-teal-800 hover:shadow-lg hover:shadow-teal-500/25 disabled:cursor-not-allowed disabled:from-teal-400 disabled:to-teal-500 transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg *ngIf="loading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {{ loading ? 'Signing in...' : 'Sign in' }}
                </button>
              </form>

              <p class="mt-6 text-center text-sm text-slate-500">
                Don't have an account?
                <a routerLink="/register" class="font-semibold text-teal-600 hover:text-teal-700 transition-colors duration-200 hover:underline">Create one</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { email, password } = this.form.value;
    this.auth.login({ email, password }).subscribe({
      next: () => { const user = this.auth.getCurrentUser(); this.router.navigate([user?.role === 'admin' ? '/dashboard' : '/products']); },
      error: (e: any) => { this.error = e?.error?.message || 'Invalid credentials.'; this.loading = false; },
    });
  }
}

