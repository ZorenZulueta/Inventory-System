import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0,
    pendingOrders: 0, lowStockProducts: 0, outOfStockProducts: 0, deliveredOrders: 0,
  };
  recentOrders: any[] = [];
  lowStockItems: any[] = [];
  loading = true;
  isAdmin = false;
  userName = '';

    quickLinks = [
    { path: '/products', icon: '??', label: 'Browse Products', color: 'teal', desc: 'View all available products' },
    { path: '/orders', icon: '??', label: 'My Orders', color: 'blue', desc: 'Track your orders' },
    { path: '/profile', icon: '??', label: 'My Profile', color: 'purple', desc: 'Update your account' },
  ];

  adminLinks = [
    { path: '/products', icon: '???', label: 'Manage Products', color: 'teal', desc: 'Add, edit, delete products' },
    { path: '/admin/orders', icon: '??', label: 'Manage Orders', color: 'orange', desc: 'Update order statuses' },
    { path: '/profile', icon: '??', label: 'My Profile', color: 'purple', desc: 'View account' },
  ];

  constructor(private http: HttpClient, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: any) => {
      this.isAdmin = user?.role === 'admin';
      this.userName = user?.name || 'User';
      this.cdr.markForCheck();
      this.loadStats();
    });
  }

  loadStats(): void {
    const url = this.isAdmin
      ? `${environment.apiUrl}/orders/stats`
      : `${environment.apiUrl}/orders/my`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (this.isAdmin) {
          this.stats = { ...this.stats, ...data.stats };
          this.recentOrders = data.recentOrders || [];
          this.lowStockItems = data.lowStockItems || [];
        } else {
          const orders = data || [];
          this.recentOrders = orders.slice(0, 5);
          this.stats.totalOrders = orders.length;
          this.stats.pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  formatCurrency(n: number): string {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n || 0);
  }

  getStatusConfig(status: string): any {
    const map: any = {
      pending:    { color: 'bg-yellow-100 text-yellow-700', icon: '?' },
      processing: { color: 'bg-blue-100 text-blue-700', icon: '??' },
      shipped:    { color: 'bg-purple-100 text-purple-700', icon: '??' },
      delivered:  { color: 'bg-green-100 text-green-700', icon: '?' },
      cancelled:  { color: 'bg-red-100 text-red-700', icon: '?' },
    };
    return map[status] || { color: 'bg-gray-100 text-gray-600', icon: '•' };
  }

  getStockColor(status: string): string {
    if (status === 'out_of_stock') return 'bg-red-100 text-red-700';
    if (status === 'low_stock') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  }

  getColorClasses(color: string): string {
    const map: any = {
      teal:   "border-teal-200 hover:border-teal-400 hover:bg-teal-50",
      blue:   "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
      purple: "border-purple-200 hover:border-purple-400 hover:bg-purple-50",
      orange: "border-orange-200 hover:border-orange-400 hover:bg-orange-50",
      red:    "border-red-200 hover:border-red-400 hover:bg-red-50",
    };
    return map[color] || "border-gray-200 hover:border-gray-400 hover:bg-gray-50";
  }
}


