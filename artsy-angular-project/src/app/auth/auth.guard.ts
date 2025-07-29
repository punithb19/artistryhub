import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

canActivate(route: unknown, state: unknown): Observable<boolean> {
  return this.authService.isLoading$.pipe(
    filter(isLoading => !isLoading),
    switchMap(() => {
      return this.authService.isLoggedIn$.pipe(
        tap(loggedIn => {
          if (!loggedIn) this.router.navigate(['/login']);
        })
      );
    })
  );
}

}
