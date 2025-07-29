import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Cookies are automatically sent, no need for manual header
    const clonedReq = req.clone({
      withCredentials: true // Ensure cookies are sent
    });
    return next.handle(clonedReq);
  }
}
