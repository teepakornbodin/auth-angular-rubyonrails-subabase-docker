import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;   // วินาที (300)
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('current_user');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }

  register(name: string, email: string, password: string, passwordConfirmation: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/register`, {
      user: { name, email, password, password_confirmation: passwordConfirmation }
    }).pipe(tap(res => this.saveSession(res)));
  }

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/login`, {
      email, password
    }).pipe(tap(res => this.saveSession(res)));
  }

  // เรียกตรงๆ จาก interceptor (ไม่ผ่าน interceptor loop)
  refreshTokens(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<TokenResponse>(
      `${this.baseUrl}/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { 'X-Skip-Interceptor': 'true' } }  // flag ให้ interceptor ข้าม
    ).pipe(tap(res => this.saveSession(res)));
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    // ส่ง logout ไป backend (revoke redis) — fire and forget
    if (refreshToken) {
      this.http.post(`${this.baseUrl}/auth/logout`, { refresh_token: refreshToken }).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUser.set(null);
  }

  private saveSession(res: TokenResponse): void {
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    localStorage.setItem('current_user', JSON.stringify(res.data.user));
    this.currentUser.set(res.data.user);
  }
}
