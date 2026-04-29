import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-auth-debug',
  imports: [CommonModule],
  template: `
    <div style="padding: 24px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
      <h2 style="margin: 0 0 12px;">Auth Debug</h2>
      <p style="margin: 0 0 16px; color: #555;">
        หน้านี้ไว้เทส refresh token ให้เห็นใน DevTools → Network
        (ต้องเรียกผ่าน Angular HttpClient เพื่อให้ interceptor ทำงาน)
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
        <button (click)="callMe()" style="padding: 10px 12px;">Call GET /auth/me</button>
        <button (click)="createArticle()" style="padding: 10px 12px;">Call POST /articles</button>
        <button (click)="logout()" style="padding: 10px 12px;">Logout (clear session)</button>
      </div>

      <div style="display: grid; gap: 8px; margin-bottom: 16px;">
        <div><b>Logged in?</b> {{ auth.isLoggedIn() }}</div>
        <div><b>Access token (prefix)</b> {{ tokenPreview }}</div>
      </div>

      <div style="padding: 12px; background: #111; color: #eee; border-radius: 8px; white-space: pre-wrap;">
        {{ output }}
      </div>
    </div>
  `
})
export class AuthDebugComponent {
  output = 'Open DevTools → Network แล้วกดปุ่มด้านบน';

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  get tokenPreview(): string {
    const t = localStorage.getItem('access_token');
    if (!t) return '(none)';
    return `${t.slice(0, 18)}…`;
  }

  async callMe(): Promise<void> {
    this.output = 'Calling GET /api/v1/auth/me ...';
    try {
      const res = await firstValueFrom(this.api.get<any>('/auth/me'));
      this.output = JSON.stringify(res, null, 2);
    } catch (e: any) {
      this.output = this.formatError(e);
    }
  }

  async createArticle(): Promise<void> {
    this.output = 'Calling POST /api/v1/articles ...';
    const payload = {
      article: {
        title: `Dummy ${new Date().toISOString()}`,
        body: 'Dummy body',
        published: true
      }
    };

    try {
      const res = await firstValueFrom(this.api.post<any>('/articles', payload));
      this.output = JSON.stringify(res, null, 2);
    } catch (e: any) {
      this.output = this.formatError(e);
    }
  }

  logout(): void {
    this.auth.logout();
    this.output = 'Logged out. ไป login ใหม่แล้วกลับมาหน้านี้ได้';
  }

  private formatError(e: any): string {
    const status = e?.status;
    const body = e?.error;
    return `Error\nstatus: ${status}\nbody: ${typeof body === 'string' ? body : JSON.stringify(body, null, 2)}`;
  }
}

