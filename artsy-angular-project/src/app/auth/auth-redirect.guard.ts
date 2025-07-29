import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: unknown, state: unknown): Observable<boolean> {
    return this.authService.isLoading$.pipe(
      filter(isLoading => !isLoading), // Wait until loading is complete
      take(1), // Only take one emission and complete
      map(() => {
        const isLoggedIn = this.authService.currentUserValue !== null;
        if (isLoggedIn) {
          console.log('User is logged in, redirecting from auth page');
          this.router.navigate(['/search']);
          return false; // Prevent navigation to login/register
        }
        return true; // Allow navigation if not logged in
      })
    );
  }
}
