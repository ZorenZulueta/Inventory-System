import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <app-navbar />

      <div class="max-w-4xl mx-auto px-6 py-10">

        <!-- Back + Title -->
        <div class="mb-10 animate-fade-in">
          <a routerLink="/products" class="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 no-underline">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Products
          </a>
          <h1 class="text-4xl font-extrabold text-slate-900 mb-2">{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h1>
          <p class="text-slate-500">{{ isEdit ? 'Update the product details below' : 'Fill in the details to add a new product' }}</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
          <div class="p-8 sm:p-12">

            <!-- Error Alert -->
            <div *ngIf="error" class="mb-8 rounded-[28px] border border-red-200 bg-red-50 px-6 py-4 text-red-700 flex items-center gap-3 animate-fade-in">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-sm font-medium">{{ error }}</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-7">

              <!-- Name + Category Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input type="text" formControlName="name" placeholder="e.g. MacBook Pro"
                    class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                  <p *ngIf="f['name'].touched && f['name'].invalid" class="mt-2 text-xs text-red-500">Name is required</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <input type="text" formControlName="category" placeholder="e.g. Electronics"
                    class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                  <p *ngIf="f['category'].touched && f['category'].invalid" class="mt-2 text-xs text-red-500">Category required</p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">Description</label>
                <textarea formControlName="description" placeholder="Product description..."
                  class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300 resize-vertical min-h-[120px]"></textarea>
              </div>

              <!-- Price + Quantity Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">
                    Price (₱) <span class="text-red-500">*</span>
                  </label>
                  <input type="number" formControlName="price" placeholder="0.00" min="0" step="0.01"
                    class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                  <p *ngIf="f['price'].touched && f['price'].invalid" class="mt-2 text-xs text-red-500">Valid price required</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">
                    Quantity <span class="text-red-500">*</span>
                  </label>
                  <input type="number" formControlName="quantity" placeholder="0" min="0"
                    class="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 focus:bg-white hover:border-slate-300" />
                  <p *ngIf="f['quantity'].touched && f['quantity'].invalid" class="mt-2 text-xs text-red-500">Valid quantity required</p>
                </div>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2.5 uppercase tracking-[0.3em]">Product Image</label>
                <div class="relative border-2 border-dashed border-slate-200 rounded-[28px] p-8 text-center transition-all duration-300 cursor-pointer hover:border-teal-400 hover:bg-teal-50 group">
                  <input type="file" (change)="onFile(\$event)" accept="image/jpeg,image/png,image/gif,image/webp"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-[28px]" />
                  <div *ngIf="!previewUrl" class="py-4">
                    <div class="flex justify-center mb-3">
                      <div class="p-3 bg-teal-100 rounded-2xl group-hover:bg-teal-200 transition-colors">
                        <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                    </div>
                    <p class="text-sm font-semibold text-slate-900 mb-1">Click to upload image</p>
                    <p class="text-xs text-slate-500">JPG, PNG, GIF, WEBP • Max 5MB</p>
                  </div>
                  <div *ngIf="previewUrl" class="py-4">
                    <img [src]="previewUrl" class="max-h-[160px] mx-auto rounded-xl object-cover shadow-md mb-3" />
                    <p class="text-xs font-semibold text-teal-600">Click to change image</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <button type="submit" [disabled]="loading"
                  class="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white font-semibold py-3 px-6 rounded-[24px] transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <svg *ngIf="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  {{ loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
                </button>
                <a routerLink="/products"
                  class="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-[24px] text-center transition-all duration-300 hover:border-slate-400 hover:bg-slate-50 no-underline flex items-center justify-center">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  isEdit = false;
  productId = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  backendUrl = environment.apiUrl.replace(/\/api$/, '');

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.productId;
    if (this.isEdit) {
      this.productService.getProduct(this.productId).subscribe({
        next: (p) => { this.form.patchValue(p); if (p.imageUrl) this.previewUrl = this.backendUrl + p.imageUrl; },
        error: () => this.router.navigate(['/products']),
      });
    }
  }

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.previewUrl = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.selectedFile) fd.append('image', this.selectedFile);
    const req = this.isEdit ? this.productService.updateProduct(this.productId, fd) : this.productService.createProduct(fd);
    req.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => { this.error = err.error?.message || 'Failed to save product'; this.loading = false; },
    });
  }
}
