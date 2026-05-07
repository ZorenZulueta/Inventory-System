import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User { id: string; name: string; email: string; role: 'admin' | 'user'; }
export interface AuthResponse { message: string; token: string; user: User; }
export interface LoginForm { email: string; password: string; }
export interface RegisterForm { name: string; email: string; password: string; role?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/register', data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(data: LoginForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.currentUserSubject.value?.role === 'admin'; }
  getCurrentUser(): User | null { return this.currentUserSubject.value; }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
