import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container">
      <div class="login-wrapper">
        
        <!-- Brand -->
        <div class="brand">
          <div class="logo">⬡</div>
          <span class="brand-name">LeanFull</span>
        </div>

        <!-- Card -->
        <div class="card">
          <h2>เข้าสู่ระบบ</h2>
          <p class="desc">ยินดีต้อนรับกลับ กรุณากรอกข้อมูลเพื่อดำเนินการต่อ</p>

          <!-- Error -->
          <div class="error" *ngIf="error()" role="alert">
            {{ error() }}
          </div>

          <!-- Form -->
          <form (ngSubmit)="submit()" #loginForm="ngForm" novalidate>
            <div class="field">
              <label for="email">อีเมล</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="คุณ@ตัวอย่าง.com"
                [disabled]="loading()"
                required
                autocomplete="email"
              />
            </div>

            <div class="field">
              <label for="password">รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                [disabled]="loading()"
                (keyup.enter)="submit()"
                required
                autocomplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              class="btn" 
              [disabled]="loading() || !email || !password"
            >
              <span *ngIf="!loading()">เข้าสู่ระบบ</span>
              <span *ngIf="loading()" class="spinner"></span>
            </button>
          </form>

          <!-- Footer -->
          <div class="footer">
            <span>ยังไม่มีบัญชี?</span>
            <a routerLink="/register" class="link">สมัครสมาชิก</a>
          </div>
        </div>

      </div>
    </main>
  `,
  styles: [`
    /* ===== Base Reset ===== */
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                   Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ===== Container ===== */
    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      padding: 24px;
    }

    .login-wrapper {
      width: 100%;
      max-width: 400px;
    }

    /* ===== Brand ===== */
    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 32px;
    }

    .logo {
      font-size: 28px;
      color: #111827;
      line-height: 1;
    }

    .brand-name {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.3px;
    }

    /* ===== Card ===== */
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 32px;
    }

    .card h2 {
      font-size: 22px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px;
    }

    .desc {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 24px;
      line-height: 1.5;
    }

    /* ===== Error ===== */
    .error {
      padding: 10px 14px;
      background: #fef2f2;
      border-left: 3px solid #ef4444;
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 20px;
      border-radius: 0 6px 6px 0;
    }

    /* ===== Form Fields ===== */
    .field {
      margin-bottom: 20px;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 11px 14px;
      font-size: 14px;
      color: #111827;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #9ca3af;
    }

    input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    input:disabled {
      background: #f9fafb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    /* ===== Button ===== */
    .btn {
      width: 100%;
      padding: 12px;
      background: #111827;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, transform 0.05s;
      margin-top: 4px;
    }

    .btn:hover:not(:disabled) {
      background: #030712;
    }

    .btn:active:not(:disabled) {
      transform: scale(0.995);
    }

    .btn:disabled {
      background: #e5e7eb;
      color: #9ca3af;
      cursor: not-allowed;
    }

    /* ===== Spinner ===== */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ===== Footer ===== */
    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;
      font-size: 14px;
      color: #6b7280;
    }

    .link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .link:hover {
      text-decoration: underline;
    }

    /* ===== Responsive ===== */
    @media (max-width: 480px) {
      .card {
        padding: 28px 24px;
      }
      
      .brand {
        margin-bottom: 24px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error.set('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    this.loading.set(true);
    this.error.set('');

   this.auth.login(this.email, this.password).subscribe({
  next: (res: any) => {
    console.log('1. Login สำเร็จแล้ว!', res);

    // AuthService จะ save session (access_token/refresh_token) ให้แล้ว
    this.router.navigate(['/home']).then(navigated => {
      console.log('2. ผลการเปลี่ยนหน้า:', navigated);
    });
    this.loading.set(false);
  },
  error: (err) => {
    console.error('Login Failed:', err);
    this.error.set(err.error?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    this.loading.set(false);
  }
});
  }
}