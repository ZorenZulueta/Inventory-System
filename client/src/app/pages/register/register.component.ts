import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex">

      <!-- Left Panel -->
      <div class="hidden lg:flex flex-col justify-between w-[45%] bg-teal-700 p-12">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
            </svg>
          </div>
          <span class="text-white font-bold text-xl tracking-tight">StockFlow</span>
        </div>

        <div>
          <div class="grid grid-cols-3 gap-3 mb-8 opacity-60">
            <div class="h-20 bg-white/10 rounded-xl"></div>
            <div class="h-20 bg-white/10 rounded-xl mt-4"></div>
            <div class="h-20 bg-white/10 rounded-xl"></div>
            <div class="h-20 bg-white/10 rounded-xl"></div>
            <div class="h-20 bg-white/10 rounded-xl mt-4"></div>
            <div class="h-20 bg-white/10 rounded-xl"></div>
          </div>
          <h2 class="text-white text-3xl font-bold leading-snug mb-3">
            Start managing smarter,<br/>not harder.
          </h2>
          <p class="text-teal-200 text-sm leading-relaxed">
            Join StockFlow and take control of your inventory with real-time tracking and insights.
          </p>
        </div>

        <p class="text-teal-300 text-xs">&copy; 2026 StockFlow. All rights reserved.</p>
      </div>

      <!-- Right Panel -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-md">

          <div class="mb-8">
            <div class="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center mb-6 lg:hidden">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 mb-1">Create an account</h1>
            <p class="text-slate-500 text-sm">Get started with StockFlow today</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="error" class="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p class="text-sm font-medium">{{ error }}</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input formControlName="name" type="text" placeholder="Juan dela Cruz"
                class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
              <p *ngIf="form.get('name')?.touched && form.get('name')?.invalid"
                 class="mt-1.5 text-xs text-red-500">Full name is required.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
              <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid"
                 class="mt-1.5 text-xs text-red-500">Please enter a valid email.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div class="relative">
                <input formControlName="password" [type]="showPassword ? 'text' : 'password'" placeholder="Min. 6 characters"
                  class="w-full px-4 py-2.5 pr-10 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
                <button type="button" (click)="togglePasswordVisibility()" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="form.get('password')?.touched && form.get('password')?.invalid"
                 class="mt-1.5 text-xs text-red-500">Password must be at least 6 characters.</p>
            </div>

            <button type="submit" [disabled]="loading"
              class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2.5 rounded-xl
                     text-sm transition-colors flex items-center justify-center gap-2 mt-2">
              <svg *ngIf="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-slate-500">
            Already have an account?
            <a routerLink="/login" class="text-teal-600 font-semibold hover:underline ml-1">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  form: any;
  loading = false;
  error = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { name, email, password } = this.form.value;
    this.auth.register({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error = e?.error?.message || 'Registration failed.'; this.loading = false; },
    });
  }
}
