import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    deliveredOrders: 0,
  };
  recentOrders: any[] = [];
  lowStockItems: any[] = [];
  loading = true;
  isAdmin = false;
  userName = '';

  quickLinks = [
    { path: '/products', icon: '📦', label: 'Browse Products', color: 'teal', desc: 'View all available products' },
    { path: '/orders', icon: '🛒', label: 'My Orders', color: 'blue', desc: 'Track your orders' },
    { path: '/profile', icon: '👤', label: 'My Profile', color: 'purple', desc: 'Update your account' },
  ];

  adminLinks = [
    { path: '/admin/products', icon: '🏷️', label: 'Manage Products', color: 'teal', desc: 'Add, edit, delete products' },
    { path: '/admin/orders', icon: '📋', label: 'Manage Orders', color: 'orange', desc: 'Update order statuses' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users', color: 'purple', desc: 'View all registered users' },
    { path: '/admin/categories', icon: '📁', label: 'Categories', color: 'blue', desc: 'Manage product categories' },
  ];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: any) => {
      this.isAdmin = user?.role === 'admin';
      this.userName = user?.name || user?.displayName || 'User';
      this.cdr.markForCheck();
    });
    this.loadStats();
  }

  loadStats(): void {
    if (this.isAdmin) {
      this.http.get<any>(`${this.getApiUrl()}/orders/stats`).subscribe({
        next: (data) => {
          this.stats = { ...this.stats, ...data.stats };
          this.recentOrders = data.recentOrders || [];
          this.lowStockItems = data.lowStockItems || [];
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); }
      });
    } else {
      this.http.get<any>(`${this.getApiUrl()}/orders/my`).subscribe({
        next: (data) => {
          this.recentOrders = (data || []).slice(0, 5);
          this.stats.totalOrders = data?.length || 0;
          this.stats.pendingOrders = (data || []).filter((o: any) => o.status === 'pending').length;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); }
      });
    }
  }

  getApiUrl(): string { return environment.apiUrl; }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getStatusConfig(status: string): any {
    const map: any = {
      pending:    { color: 'bg-yellow-100 text-yellow-700 border border-yellow-200', icon: '⏳' },
      processing: { color: 'bg-blue-100 text-blue-700 border border-blue-200', icon: '🔄' },
      shipped:    { color: 'bg-purple-100 text-purple-700 border border-purple-200', icon: '🚚' },
      delivered:  { color: 'bg-green-100 text-green-700 border border-green-200', icon: '✅' },
      cancelled:  { color: 'bg-red-100 text-red-700 border border-red-200', icon: '❌' },
    };
    return map[status] || { color: 'bg-gray-100 text-gray-600', icon: '•' };
  }

  getStockColor(status: string): string {
    const map: any = {
      available:    'bg-green-100 text-green-700',
      low_stock:    'bg-yellow-100 text-yellow-700',
      out_of_stock: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  }

  formatCurrency(amount: number): string {
    return `₱${(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }

  getColorClasses(color: string): string {
    const map: any = {
      teal:   'bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400',
      blue:   'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400',
    };
    return map[color] || 'bg-gray-50 text-gray-600 border-gray-200';
  }
}


