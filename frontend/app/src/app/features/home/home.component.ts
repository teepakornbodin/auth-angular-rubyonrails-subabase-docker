import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

interface Article {
  id: number;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
  author: { id: number; name: string; email: string };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <span class="logo">⬡</span>
          <span class="brand">LeanFull</span>
        </div>
        <div class="header-right">
          <div class="user-pill">
            <div class="avatar">{{ initials() }}</div>
            <span>{{ user()?.name }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">ออกจากระบบ</button>
        </div>
      </header>

      <!-- Main -->
      <main class="main">

        <!-- User Card -->
        <section class="user-card">
          <div class="user-info">
            <div class="big-avatar">{{ initials() }}</div>
            <div>
              <h2>สวัสดี, {{ user()?.name }} 👋</h2>
              <p class="email">{{ user()?.email }}</p>
              <p class="joined">เข้าร่วมเมื่อ {{ user()?.created_at | date:'dd MMM yyyy' }}</p>
            </div>
          </div>
          <div class="token-section">
            <div class="token-label">Access Token (หมดใน 5 นาที)</div>
            <div class="token-box">
              <code>{{ accessToken() | slice:0:60 }}...</code>
              <button class="copy-btn" (click)="copyToken()">{{ copied() ? '✓' : 'copy' }}</button>
            </div>
          </div>
        </section>

        <!-- Articles -->
        <section class="articles-section">
          <div class="section-header">
            <h3>Articles ล่าสุด</h3>
            <span class="badge">{{ articles().length }} รายการ</span>
          </div>

          <div class="loading" *ngIf="loadingArticles()">
            <div class="spinner"></div>
            <span>กำลังโหลด...</span>
          </div>

          <div class="error-msg" *ngIf="articlesError()">{{ articlesError() }}</div>

          <div class="articles-grid" *ngIf="!loadingArticles()">
            <div class="article-card" *ngFor="let a of articles()">
              <div class="article-top">
                <span class="status" [class.published]="a.published">
                  {{ a.published ? 'Published' : 'Draft' }}
                </span>
                <span class="date">{{ a.created_at | date:'dd MMM yy' }}</span>
              </div>
              <h4>{{ a.title }}</h4>
              <p>{{ a.body | slice:0:100 }}{{ a.body.length > 100 ? '...' : '' }}</p>
              <div class="author">by {{ a.author.name }}</div>
            </div>

            <div class="empty" *ngIf="articles().length === 0">
              ยังไม่มี article — ลองเพิ่มผ่าน API ดูก่อน
            </div>
          </div>
        </section>

      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    :host { display: block; font-family: 'DM Sans', sans-serif; }

    .page {
      min-height: 100vh;
      background: #0a0a0f;
      background-image: radial-gradient(ellipse 50% 40% at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 60%);
      color: #e2e8f0;
    }

    /* Header */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(10px);
      position: sticky; top: 0; z-index: 10;
      background: rgba(10,10,15,0.8);
    }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .logo { font-size: 22px; color: #818cf8; }
    .brand { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: #fff; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .user-pill {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      padding: 6px 14px; border-radius: 100px; font-size: 13px;
    }
    .avatar, .big-avatar {
      background: linear-gradient(135deg,#6366f1,#8b5cf6);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .avatar { width: 28px; height: 28px; font-size: 11px; }
    .big-avatar { width: 56px; height: 56px; font-size: 20px; }
    .logout-btn {
      padding: 7px 16px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.3);
      background: rgba(239,68,68,0.08); color: #fca5a5;
      font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .logout-btn:hover { background: rgba(239,68,68,0.15); }

    /* Main */
    .main { max-width: 900px; margin: 0 auto; padding: 36px 24px; }

    /* User Card */
    .user-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; padding: 28px; margin-bottom: 32px;
      animation: fadeIn 0.4s ease;
    }
    .user-info { display: flex; gap: 20px; align-items: center; margin-bottom: 24px; }
    .user-info h2 { font-family: 'Syne', sans-serif; font-size: 22px; margin: 0 0 4px; color: #fff; }
    .email { color: #6b7280; margin: 0; font-size: 14px; }
    .joined { color: #4b5563; margin: 4px 0 0; font-size: 12px; }

    .token-section {}
    .token-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
    .token-box {
      display: flex; align-items: center; gap: 10px;
      background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 10px 14px;
    }
    .token-box code { font-size: 11px; color: #818cf8; flex: 1; word-break: break-all; }
    .copy-btn {
      padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(129,140,248,0.3);
      background: rgba(129,140,248,0.08); color: #818cf8;
      font-size: 11px; cursor: pointer; white-space: nowrap;
    }

    /* Articles */
    .articles-section {}
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .section-header h3 { font-family: 'Syne', sans-serif; font-size: 18px; color: #fff; margin: 0; }
    .badge {
      background: rgba(129,140,248,0.15); color: #818cf8;
      padding: 2px 10px; border-radius: 100px; font-size: 12px;
    }

    .loading { display: flex; align-items: center; gap: 12px; color: #6b7280; padding: 20px 0; }
    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.1); border-top-color: #818cf8;
      border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    .error-msg { color: #fca5a5; font-size: 13px; padding: 12px; }

    .articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .article-card {
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px; padding: 20px;
      transition: border-color 0.2s, transform 0.2s;
      animation: fadeIn 0.4s ease;
    }
    .article-card:hover { border-color: rgba(129,140,248,0.3); transform: translateY(-2px); }
    .article-top { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .status {
      font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px;
      padding: 2px 8px; border-radius: 100px;
      background: rgba(107,114,128,0.2); color: #6b7280;
    }
    .status.published { background: rgba(34,197,94,0.1); color: #86efac; }
    .date { font-size: 11px; color: #4b5563; }
    .article-card h4 { font-family: 'Syne', sans-serif; font-size: 14px; color: #fff; margin: 0 0 8px; }
    .article-card p { font-size: 13px; color: #6b7280; margin: 0 0 12px; line-height: 1.5; }
    .author { font-size: 11px; color: #4b5563; }

    .empty { color: #4b5563; font-size: 14px; padding: 20px; text-align: center; grid-column: 1/-1; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class HomeComponent implements OnInit {
  // 1. ใช้ inject() เพื่อแก้ปัญหา TS2729 (Property used before initialization)
  private auth = inject(AuthService);
  private api = inject(ApiService);

  user = this.auth.currentUser;
  articles = signal<Article[]>([]);
  loadingArticles = signal(true);
  articlesError = signal('');
  accessToken = signal('');
  copied = signal(false);

  ngOnInit() {
    this.accessToken.set(localStorage.getItem('access_token') || '');
    this.loadArticles();
  }

  initials(): string {
    // 3. ใส่ Type ให้พารามิเตอร์ n เพื่อแก้ TS7006
    return this.user()?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  }

  loadArticles() {
    this.loadingArticles.set(true);
    // 4. ระบุโครงสร้าง Response ให้ชัดเจน และใส่ : any หรือ Type ใน next
    this.api.get<{ data: Article[] }>('/articles').subscribe({
      next: (res: any) => { 
        this.articles.set(res.data || []);
        this.loadingArticles.set(false);
      },
      error: (err: any) => {
        console.error('Articles Error:', err);
        this.articlesError.set('โหลด articles ไม่ได้');
        this.loadingArticles.set(false);
      }
    });
  }

  copyToken() {
    navigator.clipboard.writeText(this.accessToken());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  logout() {
    this.auth.logout();
  }
}