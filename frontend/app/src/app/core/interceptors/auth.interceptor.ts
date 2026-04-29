import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// ป้องกัน refresh loop
let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // ถ้ามี flag X-Skip-Interceptor ให้ผ่านเลย (กัน loop ตอน refresh)
  if (req.headers.has('X-Skip-Interceptor')) {
    return next(req.clone({ headers: req.headers.delete('X-Skip-Interceptor') }));
  }

  // แนบ access token ทุก request
  const token = auth.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ถ้าได้ 401 + code TOKEN_EXPIRED > ลอง refresh
      const isTokenExpired =
        error.status === 401 &&
        error.error?.code === 'TOKEN_EXPIRED';

      if (isTokenExpired && !isRefreshing) {
        isRefreshing = true;

        return auth.refreshTokens().pipe(
          switchMap((res) => {
            isRefreshing = false;
            // retry request เดิมด้วย access token ใหม่
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.data.access_token}` }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            // refresh ล้มเหลว > logout
            auth.clearSession();
            router.navigate(['/auth/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
