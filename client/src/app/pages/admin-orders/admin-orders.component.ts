import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styles: []
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  loading = true;
  selectedStatus = 'all';
  searchQuery = '';
  updatingId: string | null = null;
  expandedOrder: string | null = null;
  apiUrl = environment.apiUrl;

  statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/orders`).subscribe({
      next: (data) => {
        this.orders = data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    let result = [...this.orders];
    if (this.selectedStatus !== 'all') {
      result = result.filter(o => o.status === this.selectedStatus);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.userName?.toLowerCase().includes(q) ||
        o.userEmail?.toLowerCase().includes(q)
      );
    }
    this.filtered = result;
  }

  updateStatus(order: any, status: string): void {
    if (order.status === status) return;
    this.updatingId = order.id;
    this.http.patch(`${this.apiUrl}/orders/${order.id}/status`, { status }).subscribe({
      next: () => {
        order.status = status;
        this.applyFilter();
        this.updatingId = null;
      },
      error: () => this.updatingId = null
    });
  }

  toggle(id: string): void {
    this.expandedOrder = this.expandedOrder === id ? null : id;
  }

  countByStatus(status: string): number {
    return status === 'all'
      ? this.orders.length
      : this.orders.filter(o => o.status === status).length;
  }

  totalRevenue(): number {
    return this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
  }

  statusCfg(s: string): any {
    return ({
      pending:    { cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: '⏳' },
      processing: { cls: 'bg-blue-100 text-blue-700 border-blue-200',   dot: 'bg-blue-400',   icon: '🔄' },
      shipped:    { cls: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-400', icon: '🚚' },
      delivered:  { cls: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-400',  icon: '✅' },
      cancelled:  { cls: 'bg-red-100 text-red-700 border-red-200',     dot: 'bg-red-400',    icon: '❌' },
    } as any)[s] || { cls: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400', icon: '•' };
  }

  fmt(n: number): string {
    return `₱${(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}