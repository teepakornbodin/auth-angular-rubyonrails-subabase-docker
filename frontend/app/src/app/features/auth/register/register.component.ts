import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="container">
      <div class="register-wrapper">
        
        <!-- Brand -->
        <div class="brand">
          <div class="logo">⬡</div>
          <span class="brand-name">LeanFull</span>
        </div>

        <!-- Card -->
        <div class="card">
          <h2>สมัครสมาชิก</h2>
          <p class="desc">สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</p>

          <!-- Messages -->
          <div class="error" *ngIf="error()" role="alert">
            {{ error() }}
          </div>
          <div class="success" *ngIf="success()" role="status">
            {{ success() }}
          </div>

          <!-- Form -->
          <form (ngSubmit)="submit()" #registerForm="ngForm" novalidate>
            
            <div class="field">
              <label for="name">ชื่อ-นามสกุล</label>
              <input
                id="name"
                type="text"
                [(ngModel)]="name"
                name="name"
                placeholder="ตัวอย่าง: สมชาย ใจดี"
                [disabled]="loading()"
                required
                autocomplete="name"
              />
            </div>

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
                placeholder="อย่างน้อย 6 ตัวอักษร"
                [disabled]="loading()"
                required
                autocomplete="new-password"
                minlength="6"
              />
            </div>

            <div class="field">
              <label for="confirmPassword">ยืนยันรหัสผ่าน</label>
              <input
                id="confirmPassword"
                type="password"
                [(ngModel)]="passwordConfirmation"
                name="confirmPassword"
                placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                [disabled]="loading()"
                (keyup.enter)="submit()"
                required
                autocomplete="new-password"
              />
            </div>

            <button 
              type="submit" 
              class="btn" 
              [disabled]="loading() || !name || !email || !password || !passwordConfirmation"
            >
              <span *ngIf="!loading()">สมัครสมาชิก</span>
              <span *ngIf="loading()" class="spinner"></span>
            </button>
          </form>

          <!-- Footer -->
          <div class="footer">
            <span>มีบัญชีอยู่แล้ว?</span>
            <a routerLink="/login" class="link">เข้าสู่ระบบ</a>
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

    .register-wrapper {
      width: 100%;
      max-width: 420px;
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

    /* ===== Messages ===== */
    .error, .success {
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 20px;
      border-radius: 0 6px 6px 0;
      border-left: 3px solid;
    }

    .error {
      background: #fef2f2;
      border-left-color: #ef4444;
      color: #dc2626;
    }

    .success {
      background: #f0fdf4;
      border-left-color: #22c55e;
      color: #16a34a;
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
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.name || !this.email || !this.password || !this.passwordConfirmation) {
      this.error.set('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.error.set('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.auth.register(this.name, this.email, this.password, this.passwordConfirmation).subscribe({
      next: () => {
        this.success.set('สมัครสมาชิกสำเร็จ! กำลังพาไป...');
        setTimeout(() => this.router.navigate(['/home']), 800);
      },
      error: (err) => {
        const errors = err.error?.errors;
        this.error.set(Array.isArray(errors) ? errors.join(', ') : (err.error?.error || 'สมัครสมาชิกไม่สำเร็จ'));
        this.loading.set(false);
      }
    });
  }
}