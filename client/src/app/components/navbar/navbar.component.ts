import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userName = '';
  userEmail = '';
  menuOpen = false;
  mobileMenuOpen = false;
  currentRoute = '';

  navLinks = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', adminOnly: false },
    { path: '/products', icon: '📦', label: 'Products', adminOnly: false },
    { path: '/orders', icon: '🛒', label: 'My Orders', adminOnly: false },
    { path: '/admin/orders', icon: '📋', label: 'Manage Orders', adminOnly: true },
    { path: '/admin/products', icon: '🏷️', label: 'Manage Products', adminOnly: true },
  ];

  constructor(private auth: AuthService, private router: Router, public cartService: CartService) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = e.url;
        this.mobileMenuOpen = false;
        this.menuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.userName = user?.name || user?.displayName || '';
      this.userEmail = user?.email || '';
    });
    this.currentRoute = this.router.url;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper') && !target.closest('.mobile-menu-wrapper')) {
      this.menuOpen = false;
    }
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  isActive(path: string): boolean {
    return this.currentRoute === path;
  }

  getInitial(): string {
    return this.userName?.charAt(0)?.toUpperCase() || '?';
  }

  logout(): void {
    this.menuOpen = false;
    this.mobileMenuOpen = false;
    this.auth.logout();
  }
}
