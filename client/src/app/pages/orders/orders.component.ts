import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  showSuccess = false;
  expandedOrder: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['success']) this.showSuccess = true;
      setTimeout(() => this.showSuccess = false, 4000);
    });
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any[]>(`${this.apiUrl}/orders/my`).subscribe({
      next: (data) => { this.orders = data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggleExpand(id: string): void {
    this.expandedOrder = this.expandedOrder === id ? null : id;
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

  formatCurrency(amount: number): string {
    return `₱${(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}