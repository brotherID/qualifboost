import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError(error => {
      console.log("status :",error.status);
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('access_token');
        router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      }
      return throwError(() => error);
    })
  );
};
