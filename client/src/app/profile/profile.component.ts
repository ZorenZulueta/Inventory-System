import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  form: FormGroup;
  loading = false;
  success = '';
  error = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  activeTab: 'info' | 'orders' = 'info';
  recentOrders: any[] = [];
  ordersLoading = true;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile(): void {
    this.http.get(`${this.apiUrl}/auth/me`).subscribe({
      next: (data: any) => {
        this.profile = data;
        this.form.patchValue({
          name: data.name || data.displayName || '',
          phone: data.phone || '',
          address: data.address || '',
        });
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Could not load profile';
        this.cdr.markForCheck();
      }
    });
  }

  loadOrders(): void {
    this.http.get<any[]>(`${this.apiUrl}/orders/my`).subscribe({
      next: (data) => {
        this.recentOrders = data || [];
        this.ordersLoading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.ordersLoading = false; this.cdr.markForCheck(); }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('phone', this.form.value.phone || '');
    formData.append('address', this.form.value.address || '');
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.http.put(`${this.apiUrl}/auth/profile`, formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = 'Profile updated successfully!';
        if (res.name) this.profile = { ...this.profile, ...res };
        this.selectedFile = null;
        this.previewUrl = null;
        setTimeout(() => { this.success = ''; this.cdr.markForCheck(); }, 3000);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Update failed';
        this.cdr.markForCheck();
      }
    });
  }

  get apiUrl(): string { return environment.apiUrl; }
  getInitial(): string { return (this.profile?.name || '?').charAt(0).toUpperCase(); }

  getStatusConfig(status: string): any {
    const map: any = {
      pending:    { color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
      processing: { color: 'bg-blue-100 text-blue-700', icon: '🔄' },
      shipped:    { color: 'bg-purple-100 text-purple-700', icon: '🚚' },
      delivered:  { color: 'bg-green-100 text-green-700', icon: '✅' },
      cancelled:  { color: 'bg-red-100 text-red-700', icon: '❌' },
    };
    return map[status] || { color: 'bg-gray-100 text-gray-600', icon: '•' };
  }

  formatCurrency(amount: number): string {
    return `₱${(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}


