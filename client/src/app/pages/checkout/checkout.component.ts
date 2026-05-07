import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    public cart: CartService,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      shippingAddress: ['', Validators.required],
      phone: ['', Validators.required],
      notes: [''],
      paymentMethod: ['cod', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.cart.items.length === 0) this.router.navigate(['/cart']);
    const user = this.auth.getCurrentUser();
    if (user) {
      this.http.get<any>(`${this.apiUrl}/auth/me`).subscribe({
        next: (data) => {
          this.form.patchValue({
            shippingAddress: data.address || '',
            phone: data.phone || '',
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.cart.items.length === 0) return;
    this.loading = true;
    this.error = '';

    const order = {
      items: this.cart.items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount: this.cart.totalPrice,
      shippingAddress: this.form.value.shippingAddress,
      phone: this.form.value.phone,
      notes: this.form.value.notes,
      paymentMethod: this.form.value.paymentMethod,
    };

    this.http.post(`${this.apiUrl}/orders`, order).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['/orders'], { queryParams: { success: '1' } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }

  formatCurrency(amount: number): string {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  }
}