import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private Autorization: string = 'Authorization';
  private Bearer: string = 'Bearer ';

  constructor(private readonly authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.authService.accessToken) {
      return next.handle(req);
    }
    req = req.clone({
      headers: req.headers.set(
        this.Autorization,
        this.Bearer + this.authService.accessToken
      ),
    });
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          console.error('Token expirado');
          this.authService.logout();
        }

        return throwError(() => err);
      })
    );
  }
}
