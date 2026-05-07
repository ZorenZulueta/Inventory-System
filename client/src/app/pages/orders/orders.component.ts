import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  showSuccess = false;
  expandedOrder: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['success']) this.showSuccess = true;
      setTimeout(() => this.showSuccess = false, 4000);
    });
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<any[]>(`${this.apiUrl}/orders/my`).subscribe({
      next: (data) => {
        this.orders = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  toggle(id: string): void {
    this.expandedOrder = this.expandedOrder === id ? null : id;
    this.cdr.markForCheck();
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
}
